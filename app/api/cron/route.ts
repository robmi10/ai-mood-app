import { Resend } from 'resend';
import * as React from 'react';
import EmailTemplate from '@/app/_components/email';
import { db } from '@/utils/db/db';

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

async function fetchUserData() {
    try {
        const users = await db.selectFrom('users')
            .selectAll()
            .execute();
        return users;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
    }
}

export async function POST() {
    const users = await fetchUserData();

    if (!users) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    console.log("check all users list ->", users)
    const emailPromises = users.map(user => {
        return resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [`${user.email}`],
            subject: "Daily Mood Reminder",
            react: EmailTemplate({ name: user.name }) as React.ReactElement,
        });
    });
    try {
        const results = await Promise.all(emailPromises);
        return new Response(JSON.stringify({ success: true, results }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }

}