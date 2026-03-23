"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles, User } from "lucide-react";
import { Button } from "../ui/button";

interface AppShellProps {
  children: React.ReactNode;
  showAuthCta?: boolean;
}

export function AppShell({ children, showAuthCta }: AppShellProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                VisionTutor
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-secondary" aria-hidden />
                AI Powered Learning
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/study" className="hover:text-primary">
              Study
            </Link>
            <Link href="/dashboard/practice" className="hover:text-primary">
              Practice
            </Link>
            <Link href="/dashboard/leaderboard" className="hover:text-primary">
              Leaderboard
            </Link>
          </nav>

          {showAuthCta && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => router.push("/login")}
              >
                <User className="mr-1 h-4 w-4" aria-hidden />
                <span>Sign in</span>
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={() => router.push("/register")}
              >
                <span>Get started</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

