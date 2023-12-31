import { db } from "@/utils/db";
import { publicProcedure, createTRPCRouter } from "../../trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => {
    const users = await db
      .selectFrom("users")
      .select(["age", "name"])
      .executeTakeFirstOrThrow();

    return { users };
  }),
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        age: z.number(),
      })
    )
    .mutation(async (opts) => {
      console.log("inside insert user here opts ->!", opts);
      await db
        .insertInto("users")
        .values({ name: opts.input.name, age: opts.input.age })
        .executeTakeFirstOrThrow();
    }),
});
