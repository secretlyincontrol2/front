/**
 * Token and user helpers — localStorage wrapper for JWT auth.
 */

const TOKEN_KEY = "bupt_token";
const USER_KEY = "bupt_user";

// ── Token ──────────────────────────────────────────────────────
export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// ── User info cache ────────────────────────────────────────────
export interface CachedUser {
  _id: string;
  name: string;
  email: string;
  isOnboarded?: boolean;
}

export function saveUser(user: CachedUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): CachedUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function removeUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

// ── Logout (clears everything) ─────────────────────────────────
export function logout() {
  removeToken();
  removeUser();
}
