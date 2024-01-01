"use client";
import { api } from "@/lib/api";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { useState } from "react";
export default function UserForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const getUsers = api.users.getUsers.useQuery();
  const createUser = api.users.createUser.useMutation({
    onSettled: () => {
      getUsers.refetch();
      setName("");
      setAge("");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUser.mutateAsync({ name: name, age: Number(age) });
  };

  return (
    <div className="flex h-auto flex-col justify-center items-center gap-12 p-24 bg-red-400">
      <div className="text-4xl text-white font-bold">CREATE USER</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-64"
          placeholder="insert name ..."
        />
        <Input
          value={age}
          type="number"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          className="w-64"
          placeholder="insert age ..."
        />
        <Button type="submit">SUBMIT</Button>
      </form>

      <div className="bg-blue w-96 h-auto bg-blue-300 flex flex-col gap-2 text-white text-3xl">
        {getUsers?.data?.users.map((user, i) => {
          return (
            <div key={i} className="flex flex-row gap-2">
              <span>Name: {user.name}</span>
              <span>Age: {user.age}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
