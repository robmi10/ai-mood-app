import { formatPointToMood } from '@/lib/utils/formatMood';
import { useTheme } from 'next-themes';
import React from 'react';
import { XAxis, YAxis, ResponsiveContainer, AreaChart, CartesianGrid, Tooltip, Area, TooltipProps } from "recharts";

type MoodData = {
    name: string;
    value: number; // Keep as number for chart plotting
    moodString?: string; // Optional: for tooltip display
};

type Props = {
    data: any
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const mood = formatPointToMood(payload[0].value as number);
        return (
            <div className="custom-tooltip">
                <p className="label">{`${mood}`}</p>
            </div>
        );
    }

    return null;
};

export default function AreaCharts({ data }: Props) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const isLight = theme === 'light' || theme === 'system'
    const areadata: MoodData[] = data[0].moods.map((mood: any) => {
        return {
            name: mood.createdAt.substr(0, 3),
            value: mood.moodScore,
        };
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areadata}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#e7e6fa" : "#000000"} />
                <XAxis dataKey="name" stroke={isDark ? "#e7e6fa" : "#000000"} />
                <YAxis stroke={isDark ? "#e7e6fa" : "#000000"} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={isDark ? "#e7e6fa" : "#000000"} fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
