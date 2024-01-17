import { Resend } from 'resend';
import * as React from 'react';
import EmailTemplate from '@/app/_components/email';
import { api } from '@/lib/api';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    const getUsers = api.users.getUsers.useQuery();
    const user = getUsers?.data?.users[0]
    if (!user) return false
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [user.email],
            subject: "Daily Mood Reminder",
            react: EmailTemplate() as React.ReactElement,
        });

        if (error) {
            return Response.json({ error });
        }

        return Response.json({ data });
    } catch (error) {
        return Response.json({ error });
    }
}