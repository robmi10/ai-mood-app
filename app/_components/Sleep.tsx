"use client";
import { Button } from "@/lib/components/ui/button";
import { useContext, useState } from "react";
import { twMerge } from 'tailwind-merge'
import MoodContext from "./context/MoodContext";


export default function Sleep() {
    const { selectedSleep, setSelectedSleep } = useContext(MoodContext);

    const SLEEP = [
        'GOOD SLEEP',
        'OK SLEEP',
        'BAD SLEEP',
    ]

    const handleMoodClick = (sleep: string) => {
        setSelectedSleep(sleep)
    };

    return (
        <div className="flex h-auto flex-col items-center gap-12">
            <div className="flex gap-2">
                <Button onClick={() => { handleMoodClick(SLEEP[0]) }} className={twMerge('bg-yellow-50 text-xl font-medium p-4 rounded-full w-42 hover:bg-yellow-200 transition-colors delay-100 ease-in-out', selectedSleep === SLEEP[0] && 'bg-yellow-200')}>GOOD SLEEP</Button>
                <Button onClick={() => { handleMoodClick(SLEEP[1]) }} className={twMerge('bg-yellow-50 text-xl font-medium p-4 rounded-full w-42 hover:bg-yellow-200 transition-colors delay-100 ease-in-out', selectedSleep === SLEEP[1] && 'bg-yellow-200')}>OK SLEEP</Button>
                <Button onClick={() => { handleMoodClick(SLEEP[2]) }} className={twMerge('bg-yellow-50 text-xl font-medium p-4 rounded-full w-42 hover:bg-yellow-200 transition-colors delay-100 ease-in-out', selectedSleep === SLEEP[2] && 'bg-yellow-200')}>BAD SLEEP</Button>
            </div>
        </div >
    );
}
