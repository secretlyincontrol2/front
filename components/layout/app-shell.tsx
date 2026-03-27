"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { removeToken, removeUser, getUser } from "@/lib/auth";

interface AppShellProps {
  children: React.ReactNode;
  showAuthCta?: boolean;
}

export function AppShell({ children, showAuthCta }: AppShellProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = getUser();

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.push("/login");
  };

  const NavLinks = () => (
    <>
      <Link href="/dashboard" className="hover:text-primary transition-colors">
        Dashboard
      </Link>
      <Link href="/dashboard/study" className="hover:text-primary transition-colors">
        Study
      </Link>
      <Link href="/dashboard/practice" className="hover:text-primary transition-colors">
        Practice
      </Link>
      <Link href="/dashboard/flashcards" className="hover:text-primary transition-colors">
        Flashcards
      </Link>
      <Link href="/dashboard/leaderboard" className="hover:text-primary transition-colors">
        Leaderboard
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/30">
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                BUPT AI
              </span>
              <span className="flex items-center gap-1 text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
                <Sparkles className="h-2.5 w-2.5 text-secondary" aria-hidden />
                Tutor
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2">
            {showAuthCta ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={() => router.push("/login")}
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/register")}
                >
                  Get started
                </Button>
              </>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs font-medium text-slate-600 md:inline">
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-primary/20 bg-primary-soft/30 text-primary"
                  onClick={() => router.push("/dashboard")}
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-slate-600 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="absolute left-0 top-[57px] w-full border-b border-border bg-white p-4 shadow-lg animate-in slide-in-from-top duration-200 md:hidden">
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              <div onClick={() => setIsMenuOpen(false)}>
                <NavLinks />
              </div>
              <div className="mt-2 border-t border-border pt-4 flex flex-col gap-2">
                {user ? (
                   <Button
                   variant="outline"
                   className="justify-start gap-2 text-red-500 border-red-100 bg-red-50/50"
                   onClick={handleLogout}
                 >
                   <LogOut className="h-4 w-4" />
                   Sign out
                 </Button>
                ) : (
                  <Button onClick={() => { router.push("/login"); setIsMenuOpen(false); }}>
                    Sign in
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-border bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BUPT AI Tutor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

