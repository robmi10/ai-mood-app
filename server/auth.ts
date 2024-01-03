import { db } from "@/utils/db";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn(credentials: any) {
      console.log({ credentials })
      const user = credentials.user.name
      const email = credentials.user.email
      const res = await db
        .selectFrom("users").where('name', '=', user).execute()

      console.log("res ->", res)
      if (res.length === 0) {
        await db
          .insertInto("users")
          .values({ name: user, email: email })
          .execute();
      }
      return true
    },
  },

};

