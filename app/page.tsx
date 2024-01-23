import { getServerSession } from "next-auth";
import UserForm from "./_components/MoodForm";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";


export default async function Home() {
  const session = await getServerSession();

  if (!session) return <div className="flex items-center justify-center flex-col h-screen gap-8 ">
    <div className="h-2/4 flex flex-col justify-between w-8/12 md:w-6/12">
      <div className="space-y-8 text-white">
        <h1 className="text-2xl md:text-5xl font-bold">Embrace Your Feelings, Transform Your Days</h1>
        <h1 className="text-xl md:text-2xl font-bold">Sign in to unlock insights into your mood and wellbeing</h1>
      </div>

      <div className="flex md:w-2/4 justify-between border rounded-full  bg-white">
        <Link className="text-2xl font-bold p-6 rounded-full transition-colors delay-100 ease-in-out" href="api/auth/signin"><FaGithub size={35} /></Link>
        <Link className="text-2xl font-bold p-6 rounded-full transition-colors delay-100 ease-in-out" href="api/auth/signin"><SiGmail size={35} /></Link>
        <Link className="text-2xl font-bold p-6 rounded-full transition-colors delay-100 ease-in-out" href="api/auth/signin"><FaFacebook size={35} /></Link>
      </div>
    </div>
  </div>;

  return (
    <div className="flex min-h-screen flex-col items-center gap-2 p-12 md:p-24">
      <UserForm />
    </div>
  );
}
