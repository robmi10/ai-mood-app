import { db } from "@/utils/db/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import openai, { getEmbedding } from "@/utils/ai/openai";
import { pineconeIndex } from "@/utils/db/pinecone";
import { ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { formatPointToMood } from "@/lib/utils/formatMood";
import { formatDateWithDay, getMonthName } from "@/lib/utils/formatDate";
import { getStartAndEndDate, getTimeMonthlyFrameDate, getTimeWeeklyFrameDate } from "@/lib/utils/getLatestDate";

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

            console.log("latestMoodId ->", latestMoodId)
            const moodId = latestMoodId ? Number(latestMoodId.id) + 1 : 0

            console.log("moodId ->", moodId)
            await db.transaction().execute(async (trx) => {
                try {
                    trx.insertInto("moods").values({
                        userId: opts.input.userId, moodScore: opts.input.moodScore,
                        notes: opts.input.notes, activities: opts.input.activities,
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
            console.log("start ->", start)
            console.log("end ->", end)
            console.log("timeFrame ->", timeFrame)
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

            console.log("mostCommonMoodScore ->", mostCommonMoodScore)
            console.log("associatedDataForMoodScore ->", associatedDataForMoodScore)

            // const embedding = await getEmbedding(mostCommonMoods[0])
            // const vectorMoodFilter = await pineconeIndex.query({ vector: embedding, topK: 5, filter: { userId: opts.input.userId } })
            // const allMoodsFromUser = await db.selectFrom("moods").selectAll().where("userId", '=', opts.input.userId).where('createdAt', '>=', start)
            //     .where('createdAt', '<=', end).execute()
            // const pineconeIds = vectorMoodFilter.matches.map(match => match.id);

            // console.log("pineconeIds ->", pineconeIds)
            // // console.log("allMoodsFromUser ->", allMoodsFromUser)

            // const matchedMoods = allMoodsFromUser.filter(mood => pineconeIds.includes(mood?.id.toString()));

            // console.log("matchedMoods pinecone ->", matchedMoods)
            // let prompt = `As a mood analyzer, provide a concise summary of key mood patterns for a ${timeFrame} time frame. 
            // The predominant mood pattern is a score of ${mostCommonMoods[0].moodScore}, associated with activities 
            // ike ${mostCommonMoods[0].activities}, ${mostCommonMoods[0].weather} weather, 
            // and '${mostCommonMoods[0].sleepQuality}' sleep. Recent mood entries:\n`;
            // matchedMoods.forEach(entry => {
            //     prompt += `Weekday: ${formatDateWithDay(entry?.createdAt.toString())}, Mood: ${formatPointToMood(entry.moodScore)}, Activities: ${entry.activities && entry.activities.join(', ')}, Weather: ${entry.weather}, Sleep Quality: ${entry.sleepQuality}.\n`;
            // });
            // prompt += "Identify key trends and insights from these mood entries in a brief summary.";
            // const systemMessage: ChatCompletionSystemMessageParam = {
            //     role: "system",
            //     content: prompt
            // }

            // console.log("prompt ->", prompt)

            // const response = await openai.chat.completions.create({
            //     model: "gpt-3.5-turbo",
            //     stream: false,
            //     messages: [systemMessage]
            // })

            // const message = response.choices[0].message
            return true;
        }),
    getMoodStatisticTime: protectedProcedure.input(z.object({ timeFrame: z.number() })).query(async (opts) => {
        let userId = 1;
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

        const { start, end } = getTimeWeeklyFrameDate(currentFrame)
        if (currentFrame === 'WEEKLY') {
            const allMoodsWeekly = await db
                .selectFrom('moods')
                .selectAll()
                .where('userId', '=', userId)
                .where('createdAt', '>=', start)
                .where('createdAt', '<=', end)
                .execute();

            allMoodsWeekly.forEach(mood => {
                const moodType = formatPointToMood(mood.moodScore);
                if (moodTallies[moodType] !== undefined) {
                    moodTallies[moodType].sum += mood.moodScore;
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
                    createdAt: formatDateWithDay(mood.createdAt?.toString()),
                }
            })
            statistics.push({
                moods,
                averageMoods
            })
        }
        else if (currentFrame === 'MONTHLY') {
            const monthlyTimeFrames = getTimeMonthlyFrameDate(currentFrame)
            const moods = []
            for (const frame of monthlyTimeFrames) {
                const allMoodsMonthly = await db
                    .selectFrom('moods')
                    .selectAll()
                    .where('userId', '=', userId)
                    .where('createdAt', '>=', frame.start)
                    .where('createdAt', '<=', frame.end)
                    .execute();

                let sum = 0;
                allMoodsMonthly.forEach(mood => {
                    sum += mood.moodScore;
                });

                allMoodsMonthly.forEach(mood => {
                    const moodType = formatPointToMood(mood.moodScore);
                    if (moodTallies[moodType] !== undefined) {
                        moodTallies[moodType].sum += mood.moodScore;
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

        console.log("todaysMood ->", todaysMood)
        const hasUserAlreadyAnsweredForToday = todaysMood.length > 0

        console.log("hasUserAlreadyAnsweredForToday ->", hasUserAlreadyAnsweredForToday)
        return { hasUserAlreadyAnsweredForToday }
    })
});
