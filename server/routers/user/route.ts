import { db } from "@/utils/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const usersRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async () => {
    const users = await db
      .selectFrom("users")
      .select(["email", "name", "id"])
      .execute();

    return { users };
  }),
});
