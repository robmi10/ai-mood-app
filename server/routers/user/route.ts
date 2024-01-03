import { db } from "@/utils/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async () => {
    const users = await db
      .selectFrom("users")
      .select(["email", "name"])
      .execute();

    return { users };
  }),
  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      })
    )
    .mutation(async (opts) => {
      await db
        .insertInto("users")
        .values({ name: opts.input.name, email: opts.input.email })
        .execute();
    }),
});
