import { getServerSession } from "next-auth";
import UserForm from "./_components/MoodForm";
import { EmailSignInButton, GithubSignInButton, GoogleSignInButton } from "./_components/authButtons";

export default async function Home() {
  const session = await getServerSession();


  if (!session) return <div className="flex items-center justify-center flex-col h-screen gap-8 ">
    <div className="h-2/4 flex flex-col justify-between w-8/12 md:w-6/12 animate-fadeSmooth">
      <div className="space-y-8 text-white">
        <h1 className="text-2xl md:text-5xl font-bold">Embrace Your Feelings, Transform Your Days</h1>
        <h1 className="text-xl md:text-2xl font-bold">Sign in to unlock insights into your mood and wellbeing</h1>
      </div>
      <div className="flex md:w-4/5 justify-around flex-col h-auto border p-8 rounded-xl space-y-4 text-black bg-white">

        <div className="w-full justify-center">
          <EmailSignInButton />
          <GoogleSignInButton />
          <GithubSignInButton />
        </div>
      </div>
    </div>
  </div >;

  return (
    <div className="flex min-h-screen flex-col items-center gap-2 p-12 md:p-24">
      <UserForm />
    </div>
  );
}
