import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

export async function createInnerContext() {
  const session = await getServerSession();
  return { session };
}

export type Context = Awaited<ReturnType<typeof createInnerContext>>;

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const createTRPCRouter = t.router;

const isUserAuthed = t.middleware(({ ctx, next }) => {
  console.log("ctx check ->", ctx)
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  });
});

export const protectedProcedure = t.procedure.use(isUserAuthed);
