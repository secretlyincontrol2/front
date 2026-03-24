/**
 * ===========================================================================
 *  BUPT AI TUTORING SYSTEM — UNIFIED API SERVICE
 * ===========================================================================
 */

import { getToken } from "./auth";

// ──────────────────────────────────────────────────────────────
//  BASE URLs
// ──────────────────────────────────────────────────────────────
// On Render, the Node app proxies /api/ai to port 3002.
// So we can use the same base URL for everything.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = getToken();
    const url = `${API_BASE}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options?.headers,
            },
            ...options,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `API Error: ${response.status}`);
        }

        return data as T;
    } catch (error: unknown) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Cannot connect to server. Ensure backend is running.");
        }
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    token: string;
    isOnboarded?: boolean;
}

export interface UserProfile {
    _id: string;
    lastname: string;
    firstname: string;
    schoolEmail: string;
    courses: string[];
    points: number;
    studyHoursTotal: number;
}

export interface PracticeQuestion {
    id: number;
    type: "multiple_choice" | "short_answer";
    question: string;
    options?: string[];
    correctAnswer?: string;
    expectedAnswer?: string;
    explanation: string;
}

export interface UserProgress {
    totalStudyMinutes: number;
    totalPracticePoints: number;
    streak: number;
    completedTopics: string[];
}

export interface LeaderboardEntry {
    _id: string;
    firstname: string;
    lastname: string;
    department?: string;
    points: number;
    studyHoursTotal: number;
}

// ═══════════════════════════════════════════════════════════════
//  API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/** AUTH */
export async function registerUser(payload: any): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function loginUser(payload: any): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getMe(): Promise<UserProfile> {
    return apiFetch<UserProfile>("/auth/me");
}

/** AI TUTORING */
export async function sendChat(
    department: string,
    course: string,
    message: string,
    conversationHistory: { from: string; text: string }[] = []
): Promise<{ from: "tutor"; text: string }> {
    return apiFetch<{ from: "tutor"; text: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ department, course, message, conversationHistory }),
    });
}

export async function generatePractice(
    department: string,
    course: string,
    topic: string,
    numQuestions: number = 5,
    difficulty: string = "medium"
): Promise<{ questions: PracticeQuestion[] }> {
    return apiFetch<{ questions: PracticeQuestion[] }>("/ai/practice", {
        method: "POST",
        body: JSON.stringify({ department, course, topic, numQuestions, difficulty }),
    });
}

export async function uploadNoteForTutoring(
    file: File,
    question: string = "Summarize this document and explain key concepts.",
    course: string = "General"
): Promise<{ response: string }> {
    const formData = new FormData();
    formData.append("note", file);
    formData.append("question", question);
    formData.append("course", course);

    const token = getToken();
    const url = `${API_BASE}/ai/upload-note`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Upload failed: ${response.statusText}`);
    }

    return response.json();
}

/** LEADERBOARD */
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return apiFetch<LeaderboardEntry[]>(`/users/leaderboard?limit=${limit}`);
}

/** PROGRESS */
export async function getProgress(studentId: string): Promise<UserProgress> {
    return apiFetch<UserProgress>(`/ai/progress/${studentId}`);
}

export async function updateProgress(
    studentId: string,
    course: string,
    topic: string,
    correct: boolean,
    studyMinutes: number = 0
): Promise<any> {
    return apiFetch<any>(`/ai/progress/${studentId}`, {
        method: "POST",
        body: JSON.stringify({ course, topic, correct, studyMinutes }),
    });
}

export async function updateOnboarding(payload: any): Promise<any> {
    return apiFetch<any>("/auth/onboarding", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
export async function getCourses(): Promise<{ departments: any[] }> {
    return apiFetch<{ departments: any[] }>("/ai/courses");
}
