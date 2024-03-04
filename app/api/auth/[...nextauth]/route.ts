import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { db } from "@/utils/db/db";

const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID ?? "",
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID ?? "",
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET ?? "",
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials || {};
                if (!email || !password) {
                    return null; // Ensure you return null if credentials are missing
                }
                const getUser = await db
                    .selectFrom("users").selectAll().where('email', '=', email)
                    .execute();

                if (getUser.length === 0) {
                    throw new Error('No user found with the given email');
                }

                const user = getUser[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    throw new Error('Incorrect password');
                }
                return { id: String(user.id), name: user.name, email: user.email };
            }
        }),

    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn(credentials: any) {
            const user = credentials.user.name
            const email = credentials.user.email
            const res = await db
                .selectFrom("users").where('name', '=', user).execute()
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
