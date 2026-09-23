import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Auth Demo</h1>
      <p>A small app for exercising a full signup / login / password-reset flow.</p>
      <nav>
        <Link href="/signup">Sign up</Link>
        {" · "}
        <Link href="/login">Log in</Link>
      </nav>
    </main>
  );
}
