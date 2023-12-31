import { api } from "@/lib/api";
import React from "react";

export default function UserList() {
  const user = api.users.getUsers.useQuery();
  return (
    <div>
        <span>{user.age}</span>
    </div>
  );
}
