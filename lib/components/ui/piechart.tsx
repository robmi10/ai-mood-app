import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
type Props = {
    data: any
}
export default function PieCharts({ data }: Props) {
    const [activeIndex, setActiveIndex] = useState(false);

    const piedata = data[0].averageMoods.map((mood: any) => ({
        name: mood.mood,
        value: mood.average
    }));

    const onPieEnter = (_: any, index: any) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(false);
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={piedata}
                        label
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                    >
                        {piedata.map((entry: any, index: any) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index === activeIndex ? "#8884d8" : "#aaa6f7"}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
