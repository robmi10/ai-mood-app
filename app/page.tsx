import { getServerSession } from "next-auth";
import UserForm from "./_components/MoodForm";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();

  if (!session) return <div className="flex items-center justify-center flex-col  h-screen gap-8">
    <h1 className="text-2xl font-bold">LOGIN</h1>
    <Link className="text-2xl font-bold border p-4 bg-blue-100 rounded-sm hover:bg-blue-300 transition-colors delay-100 ease-in-out" href="api/auth/signin">LOGIN VIA GITHUB</Link>
  </div>;

  return (
    <div className="flex min-h-screen flex-col items-center gap-2 p-24">
      <UserForm />
    </div>
  );
}
