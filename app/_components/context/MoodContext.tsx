"use client";
import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';
interface MoodContextType {
    selectedSleep: string;
    setSelectedSleep: Dispatch<SetStateAction<string>>;
    selectedWeather: string;
    setSelectedWeather: Dispatch<SetStateAction<string>>;
    selectedActivity: string[];
    setSelectedActivity: Dispatch<SetStateAction<string[]>>;
    selectedMood: string;
    setSelectedMood: Dispatch<SetStateAction<string>>;
    moodScore: number;
    setMoodScore: Dispatch<SetStateAction<number>>;
}

const defaultValue: MoodContextType = {
    selectedSleep: "",
    setSelectedSleep: () => { },
    selectedWeather: "",
    setSelectedWeather: () => { },
    selectedActivity: [],
    setSelectedActivity: (() => { }) as Dispatch<SetStateAction<string[]>>,
    selectedMood: "",
    setSelectedMood: () => { },
    moodScore: 0,
    setMoodScore: () => { },
};

const MoodContext = createContext(defaultValue);

interface MoodProviderProps {
    children: ReactNode;
}

export const MoodProvider = ({ children }: MoodProviderProps) => {
    const [selectedSleep, setSelectedSleep] = useState("");
    const [selectedWeather, setSelectedWeather] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
    const [selectedMood, setSelectedMood] = useState<string>("");
    const [moodScore, setMoodScore] = useState<number>(0);

    return (
        <MoodContext.Provider value={{
            selectedSleep, setSelectedSleep, selectedWeather,
            setSelectedWeather, selectedActivity, setSelectedActivity, selectedMood, setSelectedMood,
            moodScore, setMoodScore
        }}>
            {children}
        </MoodContext.Provider>
    );
};

export default MoodContext;
