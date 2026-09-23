"use client";

import { FormEvent, useState } from "react";

export function LoginForm({
  verified,
  invalidToken,
}: {
  verified: boolean;
  invalidToken: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setSubmitting(false);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <>
      {verified && <p role="status">Your email is verified. You can log in now.</p>}
      {invalidToken && <p role="alert">That verification link is invalid or expired.</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          Log in
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
      <p>
        <a href="/reset-password">Forgot your password?</a>
      </p>
    </>
  );
}
