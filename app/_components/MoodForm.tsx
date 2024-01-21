"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { useContext, useState } from "react";
import { signOut } from 'next-auth/react';
import { Input } from "@/lib/components/ui/input";
import Activites from "./Activites";
import Weather from "./Weather";
import Sleep from "./Sleep";
import MoodContext from "./context/MoodContext";
import Statistic from "./Statistic";
import Mood from "./Mood";

export default function asyncUserForm() {
  const [notes, setNotes] = useState("");
  const { selectedSleep, setSelectedSleep, selectedWeather,
    setSelectedWeather, selectedActivity, setSelectedActivity, setSelectedMood, moodScore } = useContext(MoodContext);
  const getUsers = api.users.getUsers.useQuery();
  const user = getUsers?.data?.users[0]
  const todayAnswer = api.mood.getUserHasAlreadyAnsweredToday.useQuery({ userId: user?.id })
  const hasUserAnsweredToday = todayAnswer.isSuccess && todayAnswer?.data?.hasUserAlreadyAnsweredForToday

  console.log("hasUserAnsweredToday ->", hasUserAnsweredToday)

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


  const handleSubmit = () => {
    createDailyMood.mutate({
      userId: user?.id || 2, moodScore: moodScore,
      notes: notes, activities: selectedActivity, sleepQuality: selectedSleep, weather: selectedWeather
    }, {
      onSuccess() {
        todayAnswer.refetch()
      }
    })
  }

  if (todayAnswer.isLoading) { return <div>LOADING...</div> }


  return (
    <>
      {!hasUserAnsweredToday && <div className="flex h-auto flex-col gap-12 items-center w-3/6">
        <div className="w-full space-y-8">
          <div className="text-4xl text-white font-bold items-center">{user?.name} How Are You Feeling Today? </div>
          <div className="text-2xl text-white font-bold items-center"> Just take a moment to reflect on your day. Select the mood that resonates with you currently.</div>
        </div>
        <Mood />
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
