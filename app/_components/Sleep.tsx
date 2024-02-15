"use client";
import { Button } from "@/lib/components/ui/button";
import { useContext } from "react";
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
        if (sleep === selectedSleep) {
            setSelectedSleep("")
        } else {
            setSelectedSleep(sleep)
        }
    };

    return (
        <div className="flex h-auto flex-col items-center gap-12">
            <div className="grid grid-cols-2 md:flex gap-2 md:w-[480px]">
                <Button onClick={() => { handleMoodClick(SLEEP[0]) }} className={twMerge('bg-pink-200 dark:bg-pink-400 md:text-xl h-full font-medium p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-pink-400 dark:hover:bg-pink-700 transition-colors delay-100 ease-in-out', selectedSleep === SLEEP[0] && 'bg-pink-400 dark:bg-pink-700')}>GOOD SLEEP</Button>
                <Button onClick={() => { handleMoodClick(SLEEP[1]) }} className={twMerge('bg-pink-200 dark:bg-pink-400 md:text-xl h-full font-medium p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-pink-400 dark:hover:bg-pink-700 transition-colors delay-100 ease-in-out', selectedSleep === SLEEP[1] && 'bg-pink-400 dark:bg-pink-700')}>OK SLEEP</Button>
                <Button onClick={() => { handleMoodClick(SLEEP[2]) }} className={twMerge('bg-pink-200 dark:bg-pink-400 md:text-xl h-full font-medium p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-pink-400 dark:hover:bg-pink-700 transition-colors delay-100 ease-in-out', selectedSleep === SLEEP[2] && 'bg-pink-400 dark:bg-pink-700')}>BAD SLEEP</Button>
            </div>
        </div >
    );
}
