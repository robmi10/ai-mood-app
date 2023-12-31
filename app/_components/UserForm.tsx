"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { useState } from "react";

export default function UserForm() {
  const createUser = api.users.createUser.useMutation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("inside handleSubmit ->", name, age);
    createUser.mutateAsync({ name: name, age: Number(age) });
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-12 p-24 bg-red-400">
      <div className="text-4xl text-white font-bold">CREATE USER</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-64"
          placeholder="insert name ..."
        />
        <Input
          type="number"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          className="w-64"
          placeholder="insert age ..."
        />
        <Button onClick={handleSubmit}>SUBMIT</Button>
      </form>
    </div>
  );
}
