import { db } from "@/utils/db/db";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET ?? "",
    })
    ,
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

export default authOptions