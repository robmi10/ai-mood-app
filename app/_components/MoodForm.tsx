"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { useState } from "react";
import { signOut } from 'next-auth/react';
import { Input } from "@/lib/components/ui/input";
import { twMerge } from 'tailwind-merge'


export default function asyncUserForm() {
  const [selectedMood, setSelectedMood] = useState("");
  const [notes, setNotes] = useState("");
  const getUsers = api.users.getUsers.useQuery();

  const user = getUsers?.data?.users[0]
  const MOODS = [
    'GOOD',
    'OKAY',
    'BAD'
  ]

  const createDailyMood = api.mood.createMood.useMutation({
    onSettled() {
      getUsers.refetch()
    }
  })

  const moodScore = (mood: string) => {
    const score = mood === MOODS[0] ? 2 : mood === MOODS[1] ? 1 : 0
    return score
  }

  const handleSubmit = () => {
    console.log("inside handleSubmit")
    createDailyMood.mutate({ userId: user?.id || 2, moodScore: moodScore(selectedMood), notes: notes })
  }

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div className="flex h-auto flex-col items-center gap-12">
      <div className="text-4xl text-black font-bold items-center">WELCOME {user?.name}</div>
      <div className="text-2xl text-black font-bold items-center"> HOW IS YOUR MOOD TODAY?</div>
      <Button onClick={() => { handleMoodClick(MOODS[0]) }} className={twMerge('bg-blue-50 text-3xl font-medium p-4 rounded-md w-2/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[0] === selectedMood && 'bg-blue-200')}>GOOD</Button>
      <Button onClick={() => { handleMoodClick(MOODS[1]) }} className={twMerge('bg-blue-50 text-3xl font-medium p-4 rounded-md w-2/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[1] === selectedMood && 'bg-blue-200')}>OKAY</Button>
      <Button onClick={() => { handleMoodClick(MOODS[2]) }} className={twMerge('bg-blue-50 text-3xl font-medium p-4 rounded-md w-2/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out', MOODS[2] === selectedMood && 'bg-blue-200')}>BAD</Button>
      <Input onChange={(e) => { setNotes(e.target.value) }} className="w-full h-full p-4" type="text" placeholder="Explain more about your mood today" />
      <Button onClick={() => { handleSubmit() }}>SUBMIT</Button>
      <Button onClick={() => { signOut() }}>SIGNOUT</Button>
    </div >
  );
}
