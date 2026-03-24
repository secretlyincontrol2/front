"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { apiService } from "@/lib/api";

interface FieldErrors {
  matricNumber?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      matricNumber: String(formData.get("matricNumber") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextErrors: any = {};
    if (!data.matricNumber) nextErrors.matricNumber = "Matric number is required.";
    if (!data.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    apiService.login(data)
      .then(() => {
        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });
        router.push("/dashboard");
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error("Login error:", error);
        toast.error("Login failed", {
          description: error.message || "Please check your credentials and try again.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Sign in to continue
        </h2>
        <p className="text-sm text-muted-foreground">
          Use your school email and password to access your tutoring space.
        </p>
      </div>

      <Input
        name="matricNumber"
        label="Matric number"
        placeholder="21/1234"
        autoComplete="username"
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
          This is a UI preview. Your answers will be saved once the backend is
          connected.
        </p>
        <Button type="submit" loading={loading}>
          Continue to setup
        </Button>
      </div>
    </form>
  );
}

