"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { useContext, useState } from "react";
import { Input } from "@/lib/components/ui/input";
import { BouncerLoader } from './animation/Bouncer'
import Activites from "./Activites";
import Weather from "./Weather";
import Sleep from "./Sleep";
import MoodContext from "./context/MoodContext";
import Statistic from "./Statistic";
import Mood from "./Mood";


export default function asyncUserForm() {
  const [notes, setNotes] = useState("");
  const { selectedSleep, setSelectedSleep, selectedWeather,
    setSelectedWeather, selectedActivity, setSelectedActivity, setSelectedMood, moodScore, account } = useContext(MoodContext);
  const user = account?.user ?? false;
  const getUsers = api.users.getUsers.useQuery();
  const _userId = getUsers?.data?.users.filter((option: any) => option.email === user?.email)[0].id ?? 0

  const todayAnswer = api.mood.getUserHasAlreadyAnsweredToday.useQuery({ userId: _userId })
  const hasUserAnsweredToday = todayAnswer.isSuccess && todayAnswer?.data?.hasUserAlreadyAnsweredForToday

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
      userId: _userId ?? 0, moodScore: moodScore,
      notes: notes, activities: selectedActivity, sleepQuality: selectedSleep, weather: selectedWeather
    }, {
      onSuccess() {
        todayAnswer.refetch()
      }
    })
  }
  if (!user || createDailyMood.isPending || todayAnswer.isPending) return <div className='h-screen flex justify-center items-center'><BouncerLoader dark={false} /></div>

  return (
    <>
      {!hasUserAnsweredToday && <div className="flex h-auto flex-col gap-8 items-center w-full mt-8 md:w-3/6 animate-fadeIn">
        <div className="w-full space-y-8">
          <div className="md:text-4xl text-white font-bold items-center">{user?.name} How Are You Feeling Today? </div>
          <div className="md:text-2xl text-white font-bold items-center"> Just take a moment to reflect on your day. Select the mood that resonates with you currently.</div>
        </div>
        <Mood />
        <Activites />
        <Weather />
        <Sleep />
        <Input onChange={(e) => { setNotes(e.target.value) }} value={notes} className="w-full h-full p-4 bg-white rounded-xl shadow-lg border-none text-black" type="text" placeholder="Explain more about your mood today" />
        <div className="space-x-2 bg-red w-full flex justify-end">
          <Button className="bg-white w-24 rounded-xl shadow-lg text-black" onClick={() => { handleSubmit() }}>SUBMIT</Button>
        </div>
      </div>}
      {hasUserAnsweredToday && <Statistic />}
    </>
  );
}
