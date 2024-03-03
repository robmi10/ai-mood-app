"use client"
import { FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { signIn } from "next-auth/react";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';

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


export function EmailSignInButton() {
    const { toast } = useToast()
    const router = useRouter();
    const [formState, setFormState] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = async (event: any) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            toast({
                variant: 'destructive',
                title: "Login Failed",
                description: "Invalid login credentials. Please try again.",
            });
        } else {
            toast({
                variant: 'success',
                title: "Logged In",
                description: "You are now logged in.",
            });
            router.push('/');
            router.refresh();
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;

        if (confirmPassword !== password) {
            toast({
                variant: 'destructive',
                title: "Password Error",
                description: "Passwords don't match.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
            return
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    variant: 'success',
                    title: "Registration Success",
                    description: "User is registered.",
                });

                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFormState(false);
            } else {
                toast({
                    variant: 'destructive',
                    title: "Registration Failed",
                    description: data.message,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "Unexpected Error",
                description: "An unexpected error occurred.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }
    };


    return (
        <>
            {!formState ? (
                <form onSubmit={handleLogin} className="space-y-3 animate-fadeSmooth">
                    <p>LOGIN</p>
                    <Input name="email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} className="rounded-lg" placeholder="Email" />
                    <Input name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" className="rounded-lg" placeholder="Password" />
                    <p className="text-xs cursor-pointer hover:text-red-500 transition-colors duration-75 ease-in-out" onClick={() => {
                        setFormState(true);
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    }}>Don't have an account to login with, register here?</p>
                    <Button type="submit" className="border w-full">Submit</Button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-3 animate-fadeSmooth">
                    <p>REGISTER</p>
                    <Input name="name" onChange={(e) => { setName(e.target.value) }} value={name} className="rounded-lg" placeholder="Name" />
                    <Input name="email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} className="rounded-lg" placeholder="Email" />
                    <Input name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" className="rounded-lg" placeholder="Create a new password" />
                    <Input name="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" className="rounded-lg" placeholder="Enter your Password" />
                    <p className="text-xs cursor-pointer hover:text-red-500 transition-colors duration-75 ease-in-out" onClick={() => {
                        setFormState(false);
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    }}>Have an account to login with?</p>
                    <Button type="submit" className="border w-full">Submit</Button>
                </form>
            )}
        </>
    );
}

