"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { useState } from "react";
import { signOut } from 'next-auth/react';
import { Input } from "@/lib/components/ui/input";

export default function asyncUserForm() {
  const [mood, setMood] = useState("");
  const getUsers = api.users.getUsers.useQuery();

  const user = getUsers?.data?.users[0]

  const createUser = api.users.createUser.useMutation({
    onSettled: () => {
      getUsers.refetch();
      setMood("");
    },
  });

  return (
    <div className="flex h-auto flex-col items-center gap-12">
      <div className="text-4xl text-black font-bold items-center">WELCOME {user?.name}</div>
      <div className="text-2xl text-black font-bold items-center"> HOW IS YOUR MOOD TODAY?</div>
      <Button className="bg-blue-50 text-3xl font-medium p-4 rounded-md w-2/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out">GOOD</Button>
      <Button className="bg-blue-50 text-3xl font-medium p-4 rounded-md w-2/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out">OKAY</Button>
      <Button className="bg-blue-50 text-3xl font-medium p-4 rounded-md w-2/4 hover:bg-blue-200 transition-colors delay-100 ease-in-out">BAD</Button>
      <Input className="w-full h-full p-4" type="text" placeholder="Explain more about your mood today" />
      <Button>SUBMIT</Button>
      <Button onClick={() => { signOut() }}>SIGNOUT</Button>
    </div >
  );
}
