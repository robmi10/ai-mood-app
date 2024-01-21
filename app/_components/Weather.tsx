"use client";
import { Button } from "@/lib/components/ui/button";
import { useContext } from "react";
import { twMerge } from 'tailwind-merge'
import MoodContext from "./context/MoodContext";


export default function Weather() {
    const { selectedWeather, setSelectedWeather } = useContext(MoodContext);

    const WEATHER = [
        'SUNNY',
        'CLOUDY',
        'RAINY',
        'SNOWY',
    ]

    const handleMoodClick = (weather: string) => {
        setSelectedWeather(weather)
    };

    return (
        <div className="flex h-auto flex-col items-center gap-12">
            <div className="flex gap-2">
                <Button onClick={() => { handleMoodClick(WEATHER[0]) }} className={twMerge('bg-purple-200 text-xl shadow-lg h-full font-medium p-4 rounded-full w-3/4 hover:bg-purple-400 transition-colors delay-100 ease-in-out', selectedWeather === WEATHER[0] && 'bg-purple-400')}>SUNNY</Button>
                <Button onClick={() => { handleMoodClick(WEATHER[1]) }} className={twMerge('bg-purple-200 text-xl shadow-lg h-full font-medium p-4 rounded-full w-3/4 hover:bg-purple-400 transition-colors delay-100 ease-in-out', selectedWeather === WEATHER[1] && 'bg-purple-400')}>CLOUDY</Button>
                <Button onClick={() => { handleMoodClick(WEATHER[2]) }} className={twMerge('bg-purple-200 text-xl shadow-lg h-full font-medium p-4 rounded-full w-3/4 hover:bg-purple-400 transition-colors delay-100 ease-in-out', selectedWeather === WEATHER[2] && 'bg-purple-400')}>RAINY</Button>
                <Button onClick={() => { handleMoodClick(WEATHER[3]) }} className={twMerge('bg-purple-200 text-xl shadow-lg h-full font-medium p-4 rounded-full w-3/4 hover:bg-purple-400 transition-colors delay-100 ease-in-out', selectedWeather === WEATHER[3] && 'bg-purple-400')}>SNOWY</Button>
            </div>
        </div >
    );
}
