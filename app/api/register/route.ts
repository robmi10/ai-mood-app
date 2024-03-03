import { db } from "@/utils/db/db";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function POST(req: any) {
    const body = await req.json(); // 👈

    const { name, email, password } = body;

    try {
        const userExists = await db
            .selectFrom("users").selectAll()
            .where('email', '=', email)
            .execute();
        if (userExists.length > 0) {
            return NextResponse.json({ message: "User already exists." }, { status: 400 });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db
                .insertInto("users")
                .values({ name: name, email: email, password: hashedPassword })
                .execute();

            return NextResponse.json({ message: "User registered successfully." }, { status: 200 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });

    }

}
