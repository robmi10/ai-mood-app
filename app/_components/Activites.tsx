"use client";
import { Button } from "@/lib/components/ui/button";
import { useContext } from "react";
import { twMerge } from 'tailwind-merge'
import MoodContext from "./context/MoodContext";


export default function Activites() {
    const { selectedActivity, setSelectedActivity } = useContext(MoodContext);

    const ACTIVITY = [
        'WORKING',
        'EXCERSISING',
        'RELAXING',
        'SOCIALIZING',
        'FAMILY'
    ]

    const handleMoodClick = (activity: string) => {

        if (selectedActivity.includes(activity)) {
            setSelectedActivity(selectedActivity.filter(act => act !== activity));
        } else {
            setSelectedActivity([...selectedActivity, activity]);
        }
    };

    return (
        <div className="flex h-auto flex-col items-center gap-12">
            <div className="grid grid-cols-2 md:flex gap-2">
                <Button onClick={() => { handleMoodClick(ACTIVITY[0]) }} className={twMerge('bg-green-200 md:text-xl h-full font-normal shadow-lg p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-green-400 transition-colors delay-100 ease-in-out', selectedActivity.includes(ACTIVITY[0]) && 'bg-green-400')}>WORKING</Button>
                <Button onClick={() => { handleMoodClick(ACTIVITY[1]) }} className={twMerge('bg-green-200 md:text-xl h-full font-normal shadow-lg p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-green-400 transition-colors delay-100 ease-in-out', selectedActivity.includes(ACTIVITY[1]) && 'bg-green-400')}>EXCERCISING</Button>
                <Button onClick={() => { handleMoodClick(ACTIVITY[2]) }} className={twMerge('bg-green-200 md:text-xl h-full font-normal shadow-lg p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-green-400 transition-colors delay-100 ease-in-out', selectedActivity.includes(ACTIVITY[2]) && 'bg-green-400')}>RELAXING</Button>
                <Button onClick={() => { handleMoodClick(ACTIVITY[3]) }} className={twMerge('bg-green-200 md:text-xl h-full font-normal shadow-lg p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-green-400 transition-colors delay-100 ease-in-out', selectedActivity.includes(ACTIVITY[3]) && 'bg-green-400')}>SOCIALIZING</Button>
                <Button onClick={() => { handleMoodClick(ACTIVITY[4]) }} className={twMerge('bg-green-200 md:text-xl h-full font-normal shadow-lg p-2 md:p-4 rounded-full w-32 md:w-3/4 hover:bg-green-400 transition-colors delay-100 ease-in-out', selectedActivity.includes(ACTIVITY[4]) && 'bg-green-400')}>FAMILY</Button>
            </div>
        </div >
    );
}
