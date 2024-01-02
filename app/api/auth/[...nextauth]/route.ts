import { authOptions } from "@/server/auth";
import NextAuth from "next-auth/next";

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
