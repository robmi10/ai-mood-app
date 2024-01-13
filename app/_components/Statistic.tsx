'use client'
import { api } from '@/lib/api'
import AreaCharts from '@/lib/components/ui/barcharts'
import PieCharts from '@/lib/components/ui/piechart'
import React, { useState } from 'react'

const Statistic = () => {
    const [timeFrame, setTimeFrame] = useState(1)
    const getTimeStats = api.mood.getMoodStatisticTime.useQuery({ timeFrame })
    const timeFrameMoods = getTimeStats?.data?.filterMoods
    const timeFrameAverageMood = getTimeStats?.data?.averageMoods
    return (
        <>
            <h1>STATISTIC</h1>
            <div className='w-full flex items-center'>
                {timeFrameMoods && <AreaCharts data={timeFrameMoods} />}
                {timeFrameAverageMood && <PieCharts data={timeFrameAverageMood} />}
            </div>
        </>
    )
}

export default Statistic