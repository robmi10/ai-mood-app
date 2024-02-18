'use client'
import { api } from '@/lib/api'
import AreaCharts from '@/lib/components/ui/barcharts'
import PieCharts from '@/lib/components/ui/piechart'
import React, { useContext, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/lib/components/ui/button'
import { WordByWordRenderer } from './animation/WordAnimation'
import { SelectGroup } from '@radix-ui/react-select'
import MoodContext from './context/MoodContext'

const Statistic = () => {
    const [timeFrame, setTimeFrame] = useState(1)
    const [reflectionMood, setReflectionMood] = useState(false);
    const { account } = useContext(MoodContext);
    const getUsers = api.users.getUsers.useQuery();
    const user = account?.user ?? false;
    const _userId = getUsers?.data?.users.filter((option: any) => option.email === user?.email)[0].id ?? 0
    const getTimeStats = api.mood.getMoodStatisticTime.useQuery({ timeFrame: timeFrame, userId: _userId }, {
        enabled: !!timeFrame
    });

    const getMostCommonMoodCombo = api.mood.getDailyMoodReflectionAndMotivation.useQuery({ userId: _userId, timeFrame }, {
        enabled: !!reflectionMood,
    })
    const aiRespone = getMostCommonMoodCombo?.data?.content
    const timeFrameMoodStatistic = getTimeStats?.data?.statistics
    const timeFrameSelect = [{ value: 1, label: "Weekly" }, { value: 2, label: "Monthly" }]
    const hasStatistic = timeFrameMoodStatistic && timeFrameMoodStatistic[0]?.moods.length > 0

    const handleMoodReflection = () => {
        setReflectionMood(true)
    }

    return (
        <div className='space-y-8 w-full flex flex-col items-center mt-8'>
            <div className='flex h-auto flex-col gap-4 md:w-3/6'>
                <div className="w-full space-y-4 flex flex-col animate-fadeIn">
                    <span className='md:text-4xl text-white font-bold items-center'>Thank You for Logging Your Mood!</span>
                    <span className='md:text-2xl text-white font-bold items-center'>Your mood is logged. Discover patterns and insights for a healthier emotional life.</span>
                </div>
                <div className='mb-12 animate-fadeIn'>
                    <Select defaultValue={timeFrameSelect[0].value.toString()} onValueChange={(value) => { setTimeFrame(Number(value)), setReflectionMood(false) }}>
                        <span className='text-white md:text-xl font-bold mb-2 '> Choose Timeframe</span>
                        <SelectTrigger className="w-[280px] bg-white rounded-xl border-none text-black">
                            <SelectValue placeholder={timeFrameSelect[0].label} />
                        </SelectTrigger>
                        <SelectContent className='rounded-xl bg-white text-black'>
                            {timeFrameSelect.map((time, i) => (
                                <SelectGroup>
                                    <SelectItem className='hover:cursor-pointer hover:bg-blue-500' key={i} value={time.value.toString()}>{time.label}</SelectItem>
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {hasStatistic && <div className='md:w-7/12 w-[350px] flex flex-col md:flex-row items-center animate-fadeIn'>
                {timeFrameMoodStatistic && <AreaCharts data={timeFrameMoodStatistic} />}
                {timeFrameMoodStatistic && <PieCharts data={timeFrameMoodStatistic} />}
            </div>}
            {hasStatistic && <div className='mb-12 md:w-3/6 flex items-center mt-8 animate-fadeIn'>
                {!reflectionMood && <Button onClick={handleMoodReflection} className="bg-white p-2 h-auto rounded-xl shadow-lg text-black hover:bg-slate-100 transition-colors ease-in-out duration-75">GET A MOOD SUMMARY FROM THE LAST {timeFrame === 1 ? 'WEEK' : 'MONTH'}</Button>}
                {getMostCommonMoodCombo.isLoading && <h1 className='animate-pulse bg-white w-4 h-4 rounded-full' />}
                {reflectionMood && aiRespone && <WordByWordRenderer delay={150} text={aiRespone} />}
            </div>}

            {!hasStatistic && <p>Not enough data for current timeframe..</p>}
        </div>
    )
}

export default Statistic