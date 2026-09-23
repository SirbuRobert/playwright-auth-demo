import { LoginForm } from "./login-form";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;

  return (
    <main>
      <h1>Log in</h1>
      <LoginForm
        verified={searchParams.verified === "1"}
        invalidToken={searchParams.error === "invalid-token"}
      />
    </main>
  );
}
