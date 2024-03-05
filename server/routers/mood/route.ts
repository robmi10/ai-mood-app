import { db } from "@/utils/db/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import openai, { getEmbedding } from "@/utils/ai/openai";
import { pineconeIndex } from "@/utils/db/pinecone";
import { ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { formatPointToMood } from "@/lib/utils/formatMood";
import { formatDateWithDay, getMonthName } from "@/lib/utils/formatDate";
import { getStartAndEndDate, getTimeMonthlyFrameDate, getTimeWeeklyFrameDate } from "@/lib/utils/getLatestDate";
import { decrypt, encrypt } from "@/lib/utils/encryptData";

interface Combination {
    count: number;
    data: any;
}

export const moodRouter = createTRPCRouter({
    createMood: protectedProcedure
        .input(
            z.object({
                userId: z.number(),
                moodScore: z.number(),
                notes: z.string(),
                activities: z.array(z.string()),
                weather: z.string(),
                sleepQuality: z.string()
            })
        )
        .mutation(async (opts) => {
            const latestMoodId = await db
                .selectFrom("moods")
                .select("id")
                .orderBy("createdAt", "desc") // Replace "createdAt" with your actual timestamp column name
                .limit(1)
                .executeTakeFirst();
            const moodId = latestMoodId ? Number(latestMoodId.id) + 1 : 0
            await db.transaction().execute(async (trx) => {
                try {
                    trx.insertInto("moods").values({
                        userId: opts.input.userId, moodScore: encrypt(String(opts.input.moodScore)),
                        notes: encrypt(opts.input.notes), activities: opts.input.activities,
                        weather: opts.input.weather, sleepQuality: opts.input.sleepQuality
                    }).returningAll()
                        .executeTakeFirstOrThrow();

                    const moodEntry = {
                        userId: opts.input.userId,
                        moodScore: opts.input.moodScore,
                        activities: opts.input.activities,
                        sleepQuality: opts.input.sleepQuality,
                        notes: opts.input.notes,
                        weather: opts.input.weather,
                        id: moodId,
                        date: new Date()
                    }
                    const embedding = await getEmbedding(moodEntry)
                    await pineconeIndex.upsert([
                        {
                            id: moodId.toString(),
                            values: embedding,
                            metadata: {
                                userId: moodEntry.userId,
                                date: moodEntry.date.toISOString(),
                                moodScore: moodEntry.moodScore,
                                activities: moodEntry.activities.join(', '),
                                weather: moodEntry.weather,
                                sleepQuality: moodEntry.sleepQuality,
                            }
                        }
                    ])
                } catch (error) {
                    console.error("Failed to create mood and embedding:", error);
                    throw error
                }
            })
        }),
    getDailyMoodReflectionAndMotivation:
        protectedProcedure.input(z.object({ userId: z.number(), timeFrame: z.number() })).query(async (opts) => {
            const timeFrameList = ["WEEKLY", "MONTHLY"]
            const timeFrame = timeFrameList[opts.input.timeFrame - 1]
            const { start, end } = getStartAndEndDate(timeFrame)
            const mostCommonMoodScore = await db.selectFrom('moods')
                .select('moodScore')
                .select((eb) => eb.fn.countAll().as("occurrences"))
                .where('createdAt', '>=', start)
                .where('createdAt', '<=', end)
                .where('userId', '=', opts.input.userId)
                .groupBy('moodScore')
                .orderBy('occurrences', 'desc')
                .limit(1)
                .execute();
            const associatedDataForMoodScore = await db.selectFrom('moods')
                .selectAll()
                .where('moodScore', '=', mostCommonMoodScore[0].moodScore)
                .where('createdAt', '>=', start)
                .where('createdAt', '<=', end)
                .where('userId', '=', opts.input.userId)
                .execute();

            const combinationCounts: any = {};

            associatedDataForMoodScore.forEach(entry => {
                const activitiesStr = entry.activities ? entry.activities.join('-') : 'NoActivities';
                const key = `${decrypt(entry.notes as string) || 'None'}-${activitiesStr}-${entry.weather}-${entry.sleepQuality}`;

                if (!combinationCounts[key]) {
                    combinationCounts[key] = { count: 0, data: entry };
                }
                combinationCounts[key].count++;
            });

            // Determine the most frequent combination
            let mostFrequentEntry: any = {};
            let maxCount = 0;

            (Object.values(combinationCounts) as Combination[]).forEach(combination => {
                if (combination.count > maxCount) {
                    maxCount = combination.count;
                    mostFrequentEntry = combination.data;
                }
            });

            const embedding = await getEmbedding(mostFrequentEntry)
            const vectorMoodFilter = await pineconeIndex.query({ vector: embedding, topK: 2, filter: { userId: opts.input.userId } })
            const allMoodsFromUser = await db.selectFrom("moods").selectAll().where("userId", '=', opts.input.userId).where('createdAt', '>=', start)
                .where('createdAt', '<=', end).execute()
            const pineconeIds = vectorMoodFilter.matches.map(match => match.id);
            const matchedMoods = allMoodsFromUser.filter(mood => mood.id && pineconeIds.includes(mood?.id.toString()));

            let prompt = `As a mood analyzer, provide a concise summary of key mood patterns for a ${timeFrame} time frame. 
            The predominant mood pattern is a score of ${Number(decrypt(mostFrequentEntry.moodScore))}, associated with activities 
            ike ${mostFrequentEntry.activities}, ${mostFrequentEntry.weather} weather, 
            and '${mostFrequentEntry.sleepQuality}' sleep. Recent mood entries:\n`;
            matchedMoods.forEach(entry => {
                prompt += `Weekday: ${entry?.createdAt && formatDateWithDay(entry?.createdAt.toString())}, Mood: ${formatPointToMood(Number(decrypt(mostFrequentEntry.moodScore)))}, Activities: ${entry.activities && entry.activities.join(', ')}, Weather: ${entry.weather}, Sleep Quality: ${entry.sleepQuality}.\n`;
            });
            prompt += "Identify key trends and insights from these mood entries in a brief summary.";
            const systemMessage: ChatCompletionSystemMessageParam = {
                role: "system",
                content: prompt
            }
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                stream: false,
                messages: [systemMessage]
            })
            const message = response.choices[0].message
            return message;
        }),
    getMoodStatisticTime: protectedProcedure.input(z.object({ timeFrame: z.number(), userId: z.number() })).query(async (opts) => {
        let userId = opts.input.userId;
        const timeFrameList = ["WEEKLY", "MONTHLY"]
        const currentFrame = timeFrameList[opts.input.timeFrame - 1]
        const moodTallies: any = {
            Awful: { sum: 0, count: 0 },
            Bad: { sum: 0, count: 0 },
            Ok: { sum: 0, count: 0 },
            Good: { sum: 0, count: 0 },
            Great: { sum: 0, count: 0 },
        };
        let statistics = [];
        let averageMoods;

        const { start, end } = getTimeWeeklyFrameDate()
        if (currentFrame === 'WEEKLY') {
            const allMoodsWeekly = await db
                .selectFrom('moods')
                .selectAll()
                .where('userId', '=', userId)
                .where('createdAt', '>=', start)
                .where('createdAt', '<=', end).orderBy('createdAt', 'asc').execute();

            allMoodsWeekly.forEach(mood => {
                const moodType = formatPointToMood(Number(decrypt(mood.moodScore)));
                if (moodTallies[moodType] !== undefined) {
                    moodTallies[moodType].sum += Number(decrypt(mood.moodScore));
                    moodTallies[moodType].count += 1;
                }
            });
            averageMoods = Object.keys(moodTallies).map(moodType => {
                const tally = moodTallies[moodType];
                return {
                    mood: moodType,
                    average: tally.count,
                };
            });
            const moods = allMoodsWeekly.map((mood) => {
                return {
                    ...mood,
                    moodScore: Number(decrypt(mood.moodScore)),
                    createdAt: formatDateWithDay(mood.createdAt?.toString() ?? ""),
                }
            })
            statistics.push({
                moods,
                averageMoods
            })
        }
        else if (currentFrame === 'MONTHLY') {
            const monthlyTimeFrames = getTimeMonthlyFrameDate()
            const moods = []
            for (const frame of monthlyTimeFrames) {
                const allMoodsMonthly = await db
                    .selectFrom('moods')
                    .selectAll()
                    .where('userId', '=', userId)
                    .where('createdAt', '>=', frame.start)
                    .where('createdAt', '<=', frame.end).orderBy('createdAt', 'asc').execute();

                let sum = 0;
                allMoodsMonthly.forEach(mood => {
                    sum += Number(decrypt(mood.moodScore));
                });

                allMoodsMonthly.forEach(mood => {
                    const moodType = formatPointToMood(Number(decrypt(mood.moodScore)));
                    if (moodTallies[moodType] !== undefined) {
                        moodTallies[moodType].sum += Number(decrypt(mood.moodScore));
                        moodTallies[moodType].count += 1;
                    }
                });
                averageMoods = Object.keys(moodTallies).map(moodType => {
                    const tally = moodTallies[moodType];
                    return {
                        mood: moodType,
                        average: tally.count,
                    };
                });
                const average = allMoodsMonthly.length > 0 ? sum / allMoodsMonthly.length : null;
                moods.push({ moodScore: average, createdAt: getMonthName(frame.start.getMonth() + 1) })
                statistics.push({
                    moods,
                    averageMoods
                });
            }
        }
        return { statistics }
    }),
    getUserHasAlreadyAnsweredToday: protectedProcedure.input(z.object({ userId: z.number() })).query(async (opts) => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysMood =
            await db.selectFrom("moods")
                .selectAll().where('userId', '=', opts.input.userId)
                .where('createdAt', '>=', today)
                .execute();
        const hasUserAlreadyAnsweredForToday = todaysMood.length > 0

        return { hasUserAlreadyAnsweredForToday }
    })
});
