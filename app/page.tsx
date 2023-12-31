import UserForm from "./_components/UserForm";
import UserList from "./_components/UserList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-12 p-24 bg-red-400">
      <UserForm />
      <UserList/>
    </div>
  );
}
