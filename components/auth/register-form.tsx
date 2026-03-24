"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { registerUser } from "@/lib/api";

interface FieldErrors {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  matricNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      lastName: String(formData.get("lastName") || "").trim(),
      firstName: String(formData.get("firstName") || "").trim(),
      middleName: String(formData.get("middleName") || "").trim(),
      matricNumber: String(formData.get("matricNumber") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
      confirmPassword: String(formData.get("confirmPassword") || ""),
    };

    const nextErrors: FieldErrors = {};

    if (!data.lastName) nextErrors.lastName = "Last name is required.";
    if (!data.firstName) nextErrors.firstName = "First name is required.";
    if (!data.matricNumber) {
      nextErrors.matricNumber = "Matric number is required.";
    }
    if (!data.email) {
      nextErrors.email = "School email is required.";
    } else if (!data.email.endsWith(".edu.ng")) {
      nextErrors.email = "Use your school email address.";
    }

    if (!data.password) {
      nextErrors.password = "Password is required.";
    } else if (!isStrongPassword(data.password)) {
      nextErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

    if (!data.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (data.confirmPassword !== data.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      await registerUser({
        lastname: data.lastName,
        firstname: data.firstName,
        middlename: data.middleName || undefined,
        matricNumber: data.matricNumber,
        schoolEmail: data.email,
        password: data.password,
      });

      toast.success("Account created successfully!", {
        description: "You can now log in with your matric number and password.",
      });
      router.push("/login");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed.";
      toast.error("Registration failed", { description: message });
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
          Create your study account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your details exactly as they appear on your school records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName}
        />
        <Input
          name="firstName"
          label="First name"
          autoComplete="given-name"
          error={errors.firstName}
        />
        <Input
          name="middleName"
          label="Middle name"
          autoComplete="additional-name"
          hint="Optional"
          error={errors.middleName}
        />
        <Input
          name="matricNumber"
          label="Matric number"
          autoCapitalize="characters"
          autoComplete="off"
          error={errors.matricNumber}
        />
      </div>

      <Input
        name="email"
        type="email"
        label="School email"
        placeholder="firstname.lastname@babcock.edu.ng"
        autoComplete="email"
        error={errors.email}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password}
          hint="At least 8 characters, with uppercase, lowercase, number, and special character."
        />
        <Input
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline">Sign in</a>
        </p>
        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </div>
    </form>
  );
}
