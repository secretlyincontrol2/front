"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginUser } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";

interface FieldErrors {
  matricNumber?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      matricNumber: String(formData.get("matricNumber") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    const nextErrors: FieldErrors = {};
    if (!data.matricNumber) nextErrors.matricNumber = "Matric number is required.";
    if (!data.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await loginUser(data);

      saveToken(res.token);
      saveUser({ _id: res._id, name: res.name, email: res.email, isOnboarded: res.isOnboarded });

      toast.success(`Welcome back, ${res.name}!`);

      router.push(res.isOnboarded ? "/dashboard" : "/onboarding");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error("Login failed", { description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Sign in to continue
        </h2>
        <p className="text-sm text-muted-foreground">
          Use your school email and password to access your tutoring space.
        </p>
      </div>

      <Input
        name="matricNumber"
        label="Matric number"
        placeholder="00/0000"
        autoComplete="off"
        autoCapitalize="characters"
        error={errors.matricNumber}
      />
      <Input
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        error={errors.password}
      />

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary underline">Register here</a>
        </p>
        <Button type="submit" loading={loading}>
          Sign in
        </Button>
      </div>
    </form>
  );
}
