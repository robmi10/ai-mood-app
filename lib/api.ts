import { AppRouter } from "@/server/routers";
import { createTRPCReact } from "@trpc/react-query";

export const api = createTRPCReact<AppRouter>();
