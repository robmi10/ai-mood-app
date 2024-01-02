import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { NextRequest } from "next/server";
import { createInnerContext } from "@/server/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({

    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createInnerContext()
  });

export { handler as GET, handler as POST };
