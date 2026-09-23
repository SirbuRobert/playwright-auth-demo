"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return <button onClick={handleLogout}>Log out</button>;
}
