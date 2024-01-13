import React from 'react'
import { XAxis, YAxis, ResponsiveContainer, AreaChart, CartesianGrid, Tooltip, Area } from "recharts";


type Props = {
    data: any
}

export default function AreaCharts({ data }: Props) {
    const areadata = data.map((mood: any) => {
        console.log("mood ->", mood)
        return {
            name: mood.createdAt.substr(0, 3),
            value: mood.moodScore
        }
    })

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                width={500}
                height={400}
                data={areadata}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    )
}