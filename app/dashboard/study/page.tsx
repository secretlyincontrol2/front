"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CourseSelector } from "@/components/dashboard/course-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  from: string;
  text: string;
}

// Updated: Mock data removed. In production, this will be fetched from the backend.
const materials: any[] = [];

export default function StudyPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      from: "tutor",
      text: "Hello! I am your AI Tutor. Choose a course material on the left or ask me anything to get started.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev: Message[]) => [...prev, { from: "student", text: userMessage }]);
    setLoading(true);

    try {
      const response = await apiService.sendChatMessage(userMessage);
      setMessages((prev: Message[]) => [...prev, { from: "tutor", text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI Tutor.");
      setMessages((prev: Message[]) => [...prev, { from: "tutor", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Study session
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Choose your course, open the uploaded materials, and chat with the
            AI tutor. The bot uses your lecturer&apos;s notes to give accurate answers.
          </p>
        </section>

        <CourseSelector />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
            <header className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Course materials
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select the material you want to read or review.
                </p>
              </div>
              <span className="rounded-full bg-primary-soft/80 px-2 py-1 text-[11px] font-medium text-primary">
                Visual + text based
              </span>
            </header>

            <ul className="flex flex-col gap-2">
              {materials.length > 0 ? (
                materials.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-white px-3 py-2 text-xs hover:border-primary/60 hover:bg-primary-soft/30"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.type} &bull; {item.duration}
                      </p>
                    </div>
                    <Button type="button" size="sm" variant="outline">
                      Open
                    </Button>
                  </li>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>No materials uploaded for this course yet.</p>
                  <p className="text-[10px]">Upload your course documents in the Admin panel (coming soon).</p>
                </div>
              )}
            </ul>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
            <header className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Ask the tutor
                </h2>
                <p className="text-xs text-muted-foreground">
                  Type your questions and the chatbot will give detailed
                  explanations using your course materials.
                </p>
              </div>
              <span className="rounded-full bg-secondary/20 px-2 py-1 text-[11px] font-medium text-secondary">
                Live Chat
              </span>
            </header>

            <div className="flex min-h-[300px] max-h-[400px] overflow-y-auto flex-col gap-2 rounded-xl border border-border/70 bg-muted/60 p-3 text-xs">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[90%] rounded-2xl px-4 py-2 shadow-sm ${
                    message.from === "student"
                      ? "self-end bg-primary text-white"
                      : "self-start bg-white text-slate-900"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {loading && (
                <div className="self-start bg-white text-slate-900 rounded-2xl px-4 py-2 shadow-sm animate-pulse">
                  Tutor is thinking...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
              <Input
                name="question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the tutor to break down a concept, give more examples, or summarise a section..."
                className="h-10 text-xs sm:text-sm"
                disabled={loading}
              />
              <Button type="submit" size="sm" disabled={loading || !input.trim()}>
                {loading ? "..." : "Send"}
              </Button>
            </form>

            <footer className="mt-1 rounded-xl bg-primary-soft/40 p-3 text-[11px] text-muted-foreground">
              Connected to BUPT-AI RAG engine. Responses are generated based on uploaded lecturer notes.
            </footer>
          </section>
        </div>

        <section className="grid gap-4 rounded-2xl border border-border bg-white/80 p-4 text-xs text-muted-foreground shadow-sm sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)] sm:p-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Today&apos;s study summary
            </h2>
            <p className="mt-1">
              Select a material to begin tracking your study progress.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Share your achievement
            </h3>
            <p>
              A share button will let you post a simple card with your today&apos;s
              study time and completed topics to friends or study groups.
            </p>
            <Button type="button" size="sm" variant="outline" disabled>
              Share achievement
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

