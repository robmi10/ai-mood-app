import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


type Props = {
    data: any
}

export default function PieCharts({ data }: Props) {

    console.log("data piedata ->", data)
    const piedata = data.map((mood: any) => {
        return {
            name: mood.mood,
            value: mood.average
        }
    })

    console.log("piedata check->", piedata)
    const COLORS = ['#f52602', '#f56b02', '#fae311', '#5bff24', '#29a300'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie dataKey="value" name='name' data={piedata} fill="#888888" label >  {piedata.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}</Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}