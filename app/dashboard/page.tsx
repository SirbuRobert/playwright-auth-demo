import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.email) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Logged in as {session.email}.</p>
      <LogoutButton />
    </main>
  );
}
