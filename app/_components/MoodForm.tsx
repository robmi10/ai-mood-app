"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { useContext, useState } from "react";
import { signOut } from 'next-auth/react';
import { Input } from "@/lib/components/ui/input";
import { twMerge } from 'tailwind-merge'
import Activites from "./Activites";
import Weather from "./Weather";
import Sleep from "./Sleep";
import MoodContext from "./context/MoodContext";
import Statistic from "./Statistic";

export default function asyncUserForm() {
  const [selectedMood, setSelectedMood] = useState("");
  const [notes, setNotes] = useState("");
  const { selectedSleep, setSelectedSleep, selectedWeather,
    setSelectedWeather, selectedActivity, setSelectedActivity } = useContext(MoodContext);
  const getUsers = api.users.getUsers.useQuery();
  const user = getUsers?.data?.users[0]
  const todayAnswer = api.mood.getUserHasAlreadyAnsweredToday.useQuery({ userId: user?.id })
  const hasUserAnsweredToday = todayAnswer.isSuccess && todayAnswer?.data?.hasUserAlreadyAnsweredForToday

  console.log("hasUserAnsweredToday ->", hasUserAnsweredToday)
  const MOODS = [
    'GREAT',
    'GOOD',
    'OKAY',
    'BAD',
    'AWFUL'
  ]
  const createDailyMood = api.mood.createMood.useMutation({
    onSettled() {
      getUsers.refetch()
      setSelectedActivity([])
      setSelectedSleep("")
      setSelectedWeather("")
      setNotes("")
      setSelectedMood("")
    }
  })

  const moodScore = (mood: string) => {
    const score = mood === MOODS[0] ? 2 : mood === MOODS[1] ? 1 : mood === MOODS[2] ? 0 : mood === MOODS[3] ? -1 : -2
    return score
  }

  const handleSubmit = () => {
    createDailyMood.mutate({
      userId: user?.id || 2, moodScore: moodScore(selectedMood),
      notes: notes, activities: selectedActivity, sleepQuality: selectedSleep, weather: selectedWeather
    })
  }

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
  };


  return (
    <>
      {!hasUserAnsweredToday && <div className="flex h-auto flex-col items-center gap-12">
        <div className="text-4xl text-black font-bold items-center">WELCOME {user?.name}</div>
        <div className="text-2xl text-black font-bold items-center"> HOW IS YOUR MOOD TODAY?</div>
        <div className="flex gap-2">
          <Button onClick={() => { handleMoodClick(MOODS[0]) }} className={twMerge('bg-blue-50 text-3xl h-full font-medium p-4 rounded-md w-3/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[0] === selectedMood && 'bg-blue-200')}>GREAT</Button>
          <Button onClick={() => { handleMoodClick(MOODS[1]) }} className={twMerge('bg-blue-50 text-3xl h-full font-medium p-4 rounded-md w-3/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[1] === selectedMood && 'bg-blue-200')}>GOOD</Button>
          <Button onClick={() => { handleMoodClick(MOODS[2]) }} className={twMerge('bg-blue-50 text-3xl h-full font-medium p-4 rounded-md w-3/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[2] === selectedMood && 'bg-blue-200')}>OKAY</Button>
          <Button onClick={() => { handleMoodClick(MOODS[3]) }} className={twMerge('bg-blue-50 text-3xl h-full font-medium p-4 rounded-md w-3/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[3] === selectedMood && 'bg-blue-200')}>BAD</Button>
          <Button onClick={() => { handleMoodClick(MOODS[4]) }} className={twMerge('bg-blue-50 text-3xl h-full font-medium p-4 rounded-md w-3/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[4] === selectedMood && 'bg-blue-200')}>AWFUL</Button>
        </div>
        <Activites />
        <Weather />
        <Sleep />
        <Input onChange={(e) => { setNotes(e.target.value) }} value={notes} className="w-full h-full p-4" type="text" placeholder="Explain more about your mood today" />
        <Button onClick={() => { handleSubmit() }}>SUBMIT</Button>
        <Button onClick={() => { signOut() }}>SIGNOUT</Button>
      </div>}
      {hasUserAnsweredToday && <h1>Thanks for the provided answer to check on your statistic you can go to the analyze page..</h1>}
      <Statistic />
    </>
  );
}
