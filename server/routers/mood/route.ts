import { db } from "@/utils/db/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import openai, { getEmbedding } from "@/utils/ai/openai";
import { pineconeIndex } from "@/utils/db/pinecone";
import { ChatCompletion, ChatCompletionMessage, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { formatMoodToPoint, formatPointToMood } from "@/lib/utils/formatMood";
import { formatDateWithDay } from "@/lib/utils/formatDate";
import { getLastWeekDates, getTimeFrameDate } from "@/lib/utils/getLatestDate";

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
        protectedProcedure.input(z.object({ userId: z.number() })).query(async (opts) => {
            const mostCommonMoods = await db.selectFrom('moods')
                .select('userId')
                .select('moodScore')
                .select('weather')
                .select('activities')
                .select('sleepQuality')
                .select((eb) => eb.fn.countAll().as("occurrences"))
                .groupBy('userId')
                .groupBy('moodScore')
                .groupBy('weather')
                .groupBy('activities')
                .groupBy('sleepQuality')
                .orderBy('occurrences', 'desc')
                .limit(1)
                .execute();

            const embedding = await getEmbedding(mostCommonMoods[0])
            const vectorMoodFilter = await pineconeIndex.query({ vector: embedding, topK: 4, filter: { userId: opts.input.userId } })
            const allMoodsFromUser = await db.selectFrom("moods").selectAll().where("userId", '=', opts.input.userId).execute()
            const pineconeIds = vectorMoodFilter.matches.map(match => match.id);
            const matchedMoods = allMoodsFromUser.filter(mood => pineconeIds.includes(mood?.id.toString()));
            let prompt = `As a mood analyzer, provide a very short yet insightful summary focusing on key patterns in mood based on the following data. Based on the following mood data, please provide a comprehensive summary and analysis. The most common mood combination is a mood score of ${mostCommonMoods[0].moodScore}, with activities like ${mostCommonMoods[0].activities}, in ${mostCommonMoods[0].weather} weather, and '${mostCommonMoods[0].sleepQuality} Sleep'. Similar mood entries include:\n`;
            matchedMoods.forEach(entry => {
                prompt += `Weekday: ${formatDateWithDay(entry?.createdAt.toString())}, Mood: ${formatPointToMood(entry.moodScore)}, Activities: ${entry.activities && entry.activities.join(', ')}, Weather: ${entry.weather}, Sleep Quality: ${entry.sleepQuality}, Notes: ${entry.notes || 'None'}`;
            });
            prompt += "What patterns or insights can be drawn from these mood entries?";
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
            console.log("message ->", message)
            return message;
        }),
    getMoodStatisticTime: protectedProcedure.input(z.object({ timeFrame: z.number() })).query(async (opts) => {
        let userId = 1;
        const timeFrame = ["WEEKLY", "MONTHLY", "YEARLY"]
        const currentFrame = timeFrame[opts.input.timeFrame]
        const { start, end } = getTimeFrameDate(currentFrame)

        const allMoodsFromSpecificTimeFrame = await db
            .selectFrom('moods')
            .selectAll()
            .where('userId', '=', userId)
            .where('createdAt', '>=', start)
            .where('createdAt', '<=', end)
            .execute();
        const moodTallies: any = {
            Awful: { sum: 0, count: 0 },
            Bad: { sum: 0, count: 0 },
            Ok: { sum: 0, count: 0 },
            Good: { sum: 0, count: 0 },
            Great: { sum: 0, count: 0 },
        };
        allMoodsFromSpecificTimeFrame.forEach(mood => {
            const moodType = formatPointToMood(mood.moodScore);
            if (moodTallies[moodType] !== undefined) {
                moodTallies[moodType].sum += mood.moodScore;
                moodTallies[moodType].count += 1;
            }
        });
        const averageMoods = Object.keys(moodTallies).map(moodType => {
            const tally = moodTallies[moodType];
            return {
                mood: moodType,
                average: tally.count,
            };
        });
        const filterMoods = allMoodsFromSpecificTimeFrame.map((mood) => {
            return {
                ...mood,
                createdAt: formatDateWithDay(mood.createdAt?.toString())
            }
        })
        return { filterMoods, averageMoods }
    })
});
