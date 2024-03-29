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
import { BouncerLoader } from "./animation/Bouncer";

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
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);
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
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsLoading(false);
        } else {
            toast({
                variant: 'success',
                title: "Logged In",
                description: "You are now logged in.",
            });
            setIsLoading(false);
            router.push('/');
            router.refresh();
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const target = event.target as typeof event.target & {
            name: { value: string };
            email: { value: string };
            password: { value: string };
            confirmPassword: { value: string };
        };
        const name = target.name.value;
        const email = target.email.value;
        const password = target.password.value;
        const confirmPassword = target.confirmPassword.value;

        if (confirmPassword !== password) {
            toast({
                variant: 'destructive',
                title: "Password Error",
                description: "Passwords don't match.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsLoading(false);
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
                setIsLoading(false);
            } else {
                toast({
                    variant: 'destructive',
                    title: "Registration Failed",
                    description: data.message,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
                setIsLoading(false);
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
                    <Input name="email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} className="w-full rounded-xl shadow-lg border text-sm placeholder-slate-400"
                        placeholder="Email" />
                    <Input name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" className="w-full rounded-xl shadow-lg border text-sm placeholder-gray-400" placeholder="Password" />
                    <p className="text-xs cursor-pointer hover:text-red-500 transition-colors duration-75 ease-in-out" onClick={() => {
                        setFormState(true);
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    }}>Don't have an account to login with, register here?</p>
                    <Button type="submit" className="border w-full p-5">{!isLoading ? <p>Submit</p> : <BouncerLoader dark={true} />}</Button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-3 animate-fadeSmooth">
                    <p>REGISTER</p>
                    <Input name="name" onChange={(e) => { setName(e.target.value) }} value={name} className="w-full rounded-xl shadow-lg border text-sm placeholder-slate-400" placeholder="Name" />
                    <Input name="email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} className="w-full rounded-xl shadow-lg border text-sm placeholder-slate-400" placeholder="Email" />
                    <Input name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" className="w-full rounded-xl shadow-lg border text-sm placeholder-slate-400" placeholder="Create a new password" />
                    <Input name="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" className="w-full rounded-xl shadow-lg border text-sm placeholder-slate-400" placeholder="Enter your password" />
                    <p className="text-xs cursor-pointer hover:text-red-500 transition-colors duration-75 ease-in-out" onClick={() => {
                        setFormState(false);
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    }}>Have an account to login with?</p>
                    <Button type="submit" className="border w-full p-5">{!isLoading ? <p>Submit</p> : <BouncerLoader dark={true} />}</Button>
                </form>
            )}
        </>
    );
}

