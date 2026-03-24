"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { apiService } from "@/lib/api";

interface FieldErrors {
  lastname?: string;
  firstname?: string;
  middlename?: string;
  matricNumber?: string;
  schoolEmail?: string;
  password?: string;
  confirmPassword?: string;
}

function isStrongPassword(password: string) {
  return (
    password.length > 8 &&
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      lastname: String(formData.get("lastname") || "").trim(),
      firstname: String(formData.get("firstname") || "").trim(),
      middlename: String(formData.get("middlename") || "").trim(),
      matricNumber: String(formData.get("matricNumber") || "").trim(),
      schoolEmail: String(formData.get("schoolEmail") || "").trim(),
      password: String(formData.get("password") || ""),
      confirmPassword: String(formData.get("confirmPassword") || ""),
    };

    const nextErrors: FieldErrors = {};

    if (!data.lastname) nextErrors.lastname = "Last name is required.";
    if (!data.firstname) nextErrors.firstname = "First name is required.";
    if (!data.matricNumber)
      nextErrors.matricNumber = "Matric number is required.";
    if (!data.schoolEmail) {
      nextErrors.schoolEmail = "School email is required.";
    } else if (!data.schoolEmail.endsWith(".edu.ng")) {
      nextErrors.schoolEmail = "Use your school email address.";
    }

    if (!data.password) {
      nextErrors.password = "Password is required.";
    } else if (!isStrongPassword(data.password)) {
      nextErrors.password =
        "Password must be more than 8 characters and include capital letters, small letters, numbers, and a special character.";
    }

    if (!data.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (data.confirmPassword !== data.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    apiService.register(data)
      .then(() => {
        toast.success("Account created successfully!", {
          description: "Please log in with your credentials.",
        });
        router.push("/login");
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error("Registration error:", error);
        toast.error("Registration failed", {
          description: error.message || "Please check your details and try again.",
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
          Create your study account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your details exactly as they appear on your school records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="lastname"
          label="Last name"
          autoComplete="family-name"
          error={errors.lastname}
        />
        <Input
          name="firstname"
          label="First name"
          autoComplete="given-name"
          error={errors.firstname}
        />
        <Input
          name="middlename"
          label="Middle name"
          autoComplete="additional-name"
          hint="Optional"
          error={errors.middlename}
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
        name="schoolEmail"
        type="email"
        label="School email"
        placeholder="firstname.lastname@babcock.edu.ng"
        autoComplete="email"
        error={errors.schoolEmail}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password}
          hint="More than 8 characters, with capital letters, small letters, numbers, and a special character."
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
          By creating an account you agree that your learning data will be used
          to personalize your sessions.
        </p>
        <Button type="submit" loading={loading}>
          Continue to login
        </Button>
      </div>
    </form>
  );
}

