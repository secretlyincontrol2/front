import { AppShell } from "@/components/layout/app-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        <section className="flex-1 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back to your study space
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Log in with your school email so we can continue tracking your
            hours, practice sessions, and goals across devices.
          </p>
        </section>
        <section className="w-full max-w-md">
          <LoginForm />
        </section>
      </div>
    </AppShell>
  );
}

