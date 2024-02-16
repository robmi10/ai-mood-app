"use client";

import { FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { signIn } from "next-auth/react";
import { Button } from "@/lib/components/ui/button";

export function GoogleSignInButton() {
    const handleClick = () => {
        signIn("google");
    };

    return (
        <Button className="text-2xl font-bold p-6 rounded-full transition-colors delay-100 ease-in-out" onClick={handleClick}><SiGmail size={35} /></Button>
    );
}

export function GithubSignInButton() {
    const handleClick = () => {
        signIn("github");
    };

    return (
        <Button className="text-2xl font-bold p-6 rounded-full transition-colors delay-100 ease-in-out" onClick={handleClick}><FaGithub size={35} /></Button>
    );
}

