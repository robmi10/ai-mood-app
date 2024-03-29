import { createTRPCRouter } from "../trpc";
import { moodRouter } from "./mood/route";
import { usersRouter } from "./user/route";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  mood: moodRouter,
});

export type AppRouter = typeof appRouter;
