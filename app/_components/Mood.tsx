"use client";
import { Button } from "@/lib/components/ui/button";
import { useContext } from "react";
import { twMerge } from 'tailwind-merge'
import MoodContext from "./context/MoodContext";


export default function Mood() {
    const { selectedMood, setSelectedMood, setMoodScore } = useContext(MoodContext);
    const MOODS = [
        'GREAT',
        'GOOD',
        'OKAY',
        'BAD',
        'AWFUL'
    ]

    const moodScore = (mood: string) => {
        const score = mood === MOODS[0] ? 2 : mood === MOODS[1] ? 1 : mood === MOODS[2] ? 0 : mood === MOODS[3] ? -1 : -2
        return score
    }

    const handleMoodClick = (mood: string) => {
        setSelectedMood(mood);
        let score = moodScore(mood)
        setMoodScore(score)
    };

    return (
        <div className="flex h-auto flex-col items-center gap-12">
            <div className="flex gap-2">
                <Button onClick={() => { handleMoodClick(MOODS[0]) }} className={twMerge('bg-blue-200 text-3xl h-full font-normal p-4 rounded-full shadow-lg w-3/4 hover:bg-blue-400 transition-colors delay-100 ease-in-out', MOODS[0] === selectedMood && 'bg-blue-400')}>GREAT</Button>
                <Button onClick={() => { handleMoodClick(MOODS[1]) }} className={twMerge('bg-blue-200 text-3xl h-full font-normal p-4 rounded-full shadow-lg w-3/4 hover:bg-blue-400 transition-colors delay-100 ease-in-out', MOODS[1] === selectedMood && 'bg-blue-400')}>GOOD</Button>
                <Button onClick={() => { handleMoodClick(MOODS[2]) }} className={twMerge('bg-blue-200 text-3xl h-full font-normal p-4 rounded-full shadow-lg w-3/4 hover:bg-blue-400 transition-colors delay-100 ease-in-out', MOODS[2] === selectedMood && 'bg-blue-400')}>OKAY</Button>
                <Button onClick={() => { handleMoodClick(MOODS[3]) }} className={twMerge('bg-blue-200 text-3xl h-full font-normal p-4 rounded-full shadow-lg w-3/4 hover:bg-blue-400 transition-colors delay-100 ease-in-out', MOODS[3] === selectedMood && 'bg-blue-400')}>BAD</Button>
                <Button onClick={() => { handleMoodClick(MOODS[4]) }} className={twMerge('bg-blue-200 text-3xl h-full font-normal p-4 rounded-full shadow-lg w-3/4 hover:bg-blue-400 transition-colors delay-100 ease-in-out', MOODS[4] === selectedMood && 'bg-blue-400')}>AWFUL</Button>
            </div>
        </div >
    );
}
