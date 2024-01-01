import { AppRouter } from "@/server/routers";
import { createTRPCReact } from "@trpc/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  // Get the session from NextAuth.js
  const session = await getSession({ req });

  return {
    req,
    res,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export const api = createTRPCReact<AppRouter>();
