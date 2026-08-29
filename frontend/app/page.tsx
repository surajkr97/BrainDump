import AppFooter from "@/components/organisms/AppFooter";
import DashboardHeader from "@/components/organisms/DashboardHeader";
import LoginPrompt from "@/components/organisms/LoginPrompt";
import TodoList from "@/components/organisms/TodoList";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) return <LoginPrompt />;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-7 px-5 py-8 sm:px-8 sm:py-12">
      <DashboardHeader email={session.user.email} />
      <TodoList />
      <AppFooter />
    </main>
  );
}
