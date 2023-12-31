import { createTRPCRouter } from "../trpc";
import { usersRouter } from "./user/route";

export const appRouter = createTRPCRouter({
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
