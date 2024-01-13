'use client'
import { api } from '@/lib/api'
import AreaCharts from '@/lib/components/ui/barcharts'
import PieCharts from '@/lib/components/ui/piechart'
import React, { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/lib/components/ui/button'

const Statistic = () => {
    const [timeFrame, setTimeFrame] = useState(1)
    const [reflectionMood, setReflectionMood] = useState(false);

    const getTimeStats = api.mood.getMoodStatisticTime.useQuery({ timeFrame }, {
        enabled: !!timeFrame
    });
    const getUsers = api.users.getUsers.useQuery();
    const user = getUsers?.data?.users[0]
    const getMostCommonMoodCombo = api.mood.getDailyMoodReflectionAndMotivation.useQuery({ userId: user?.id, timeFrame }, {
        enabled: !!reflectionMood,
    })
    const aiRespone = getMostCommonMoodCombo?.data?.content
    const timeFrameMoodStatistic = getTimeStats?.data?.statistics
    const timeFrameSelect = [{ value: 1, label: "Weekly" }, { value: 2, label: "Monthly" }]

    const handleMoodReflection = () => {
        setReflectionMood(true)
    }

    console.log("timeFrame ->", timeFrame)
    return (
        <div className='flex flex-col w-full items-center'>
            <h1>STATISTIC</h1>
            <div className='mb-24'>
                <Select onValueChange={(value) => { setTimeFrame(Number(value)), setReflectionMood(false) }}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a time frame" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeFrameSelect.map((time, i) => (
                            <SelectItem key={i} value={time.value.toString()}>{time.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='mb-24'>
                {!reflectionMood && <Button onClick={handleMoodReflection} className="border p-2 bg-blue-50 hover:bg-blue-100">GET A MOOD SUMMARY FROM THE LAST {timeFrame === 1 ? 'WEEK' : 'MONTH'}</Button>}
                {getMostCommonMoodCombo.isLoading && <h1>LOADING.... </h1>}
                {reflectionMood && aiRespone && <div className="text-bold text-black font-medium items-center">{aiRespone}</div>}
            </div>
            <div className='w-full flex items-center'>
                {timeFrameMoodStatistic && <AreaCharts data={timeFrameMoodStatistic} />}
                {timeFrameMoodStatistic && <PieCharts data={timeFrameMoodStatistic} />}
            </div>
        </div>
    )
}

export default Statistic