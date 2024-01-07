"use client";
import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';
interface MoodContextType {
    selectedSleep: string;
    setSelectedSleep: Dispatch<SetStateAction<string>>;
    selectedWeather: string;
    setSelectedWeather: Dispatch<SetStateAction<string>>;
    selectedActivity: string[];
    setSelectedActivity: Dispatch<SetStateAction<string[]>>;
}

const defaultValue: MoodContextType = {
    selectedSleep: "",
    setSelectedSleep: () => { },
    selectedWeather: "",
    setSelectedWeather: () => { },
    selectedActivity: [],
    setSelectedActivity: (() => { }) as Dispatch<SetStateAction<string[]>>,
};

const MoodContext = createContext(defaultValue);

interface MoodProviderProps {
    children: ReactNode;
}

export const MoodProvider = ({ children }: MoodProviderProps) => {
    const [selectedSleep, setSelectedSleep] = useState("");
    const [selectedWeather, setSelectedWeather] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<string[]>([]);

    return (
        <MoodContext.Provider value={{
            selectedSleep, setSelectedSleep, selectedWeather,
            setSelectedWeather, selectedActivity, setSelectedActivity
        }}>
            {children}
        </MoodContext.Provider>
    );
};

export default MoodContext;
