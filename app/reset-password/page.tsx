"use client";

import { FormEvent, useState } from "react";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"request" | "confirm" | "done">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await fetch("/api/reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    setStep("confirm");
  }

  async function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setSubmitting(false);
      return;
    }

    setStep("done");
  }

  if (step === "done") {
    return (
      <main>
        <h1>Password updated</h1>
        <p>
          <a href="/login">Log in</a>
        </p>
      </main>
    );
  }

  if (step === "confirm") {
    return (
      <main>
        <h1>Enter your reset code</h1>
        <p>We sent a 6-digit code to {email}.</p>
        <form onSubmit={handleConfirm}>
          <label>
            Code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            Reset password
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main>
      <h1>Reset password</h1>
      <form onSubmit={handleRequest}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          Send code
        </button>
      </form>
    </main>
  );
}
