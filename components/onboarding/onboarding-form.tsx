"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { QuestionCard } from "./question-card";

type StudyMode = "visual" | "audio" | "text";
type ReaderType = "day" | "night" | "both";

interface OnboardingState {
  gender: string;
  age: string;
  preferredStudyMode: string;
  audioOrText: StudyMode | "";
  breakDuration: string;
  dailyHours: string;
  readerType: ReaderType | "";
}

export function OnboardingForm() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [state, setState] = React.useState<OnboardingState>({
    gender: "",
    age: "",
    preferredStudyMode: "",
    audioOrText: "",
    breakDuration: "",
    dailyHours: "",
    readerType: "",
  });

  const completion =
    ([
      state.gender,
      state.age,
      state.preferredStudyMode,
      state.audioOrText,
      state.breakDuration,
      state.dailyHours,
      state.readerType,
    ].filter(Boolean).length /
      7) *
    100;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    window.setTimeout(() => {
      setSaving(false);
      toast.success("Preferences saved (mock).", {
        description:
          "Your tutor will now adapt sessions to your reading habit.",
      });
      router.push("/dashboard");
    }, 900);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Help us understand how you learn
          </h2>
          <p className="text-sm text-muted-foreground">
            Answer a few questions so the chatbot can personalize your study and
            practice sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.max(completion, 12)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round(completion)}% complete
          </span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <QuestionCard
          title="Basic information"
          description="Tell us who you are so we can personalise reminders and messages."
        >
          <Select
            label="Gender"
            name="gender"
            value={state.gender}
            onChange={(event) =>
              setState((prev) => ({ ...prev, gender: event.target.value }))
            }
            options={[
              { label: "Select gender", value: "" },
              { label: "Female", value: "female" },
              { label: "Male", value: "male" },
              { label: "Non-binary", value: "non-binary" },
              { label: "Prefer not to say", value: "na" },
            ]}
          />
          <Input
            label="Age"
            name="age"
            type="number"
            min={15}
            max={80}
            value={state.age}
            onChange={(event) =>
              setState((prev) => ({ ...prev, age: event.target.value }))
            }
          />
        </QuestionCard>

        <QuestionCard
          title="Preferred mode of study"
          description="Choose how you like to study so we can adapt materials and explanations."
        >
          <Select
            label="Preferred mode of study"
            name="preferredStudyMode"
            value={state.preferredStudyMode}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                preferredStudyMode: event.target.value,
              }))
            }
            options={[
              { label: "Select a mode", value: "" },
              { label: "Visual (diagrams, charts)", value: "visual" },
              { label: "Audio explanations", value: "audio" },
              { label: "Reading texts", value: "text" },
              { label: "A mix of everything", value: "mixed" },
            ]}
          />
        </QuestionCard>

        <QuestionCard
          title="Audio or text focus"
          description="Tell us if you enjoy listening to audio or reading text more."
        >
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium transition ${
              state.audioOrText === "audio"
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-white text-muted-foreground hover:bg-muted"
            }`}
            onClick={() =>
              setState((prev) => ({ ...prev, audioOrText: "audio" }))
            }
          >
            I like listening to audios
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium transition ${
              state.audioOrText === "text"
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-white text-muted-foreground hover:bg-muted"
            }`}
            onClick={() =>
              setState((prev) => ({ ...prev, audioOrText: "text" }))
            }
          >
            I prefer reading texts
          </button>
        </QuestionCard>

        <QuestionCard
          title="Focus and break pattern"
          description="How long can you read before taking a break, and how many hours can you spend on your books per day."
        >
          <Select
            label="How long can you read before a break"
            name="breakDuration"
            value={state.breakDuration}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                breakDuration: event.target.value,
              }))
            }
            options={[
              { label: "Select duration", value: "" },
              { label: "15 minutes", value: "15" },
              { label: "25 minutes", value: "25" },
              { label: "40 minutes", value: "40" },
              { label: "60 minutes", value: "60" },
            ]}
          />
          <Select
            label="How many hours can you study in a day"
            name="dailyHours"
            value={state.dailyHours}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                dailyHours: event.target.value,
              }))
            }
            options={[
              { label: "Select hours", value: "" },
              { label: "Less than 1 hour", value: "<1" },
              { label: "1 &ndash; 2 hours", value: "1-2" },
              { label: "2 &ndash; 4 hours", value: "2-4" },
              { label: "More than 4 hours", value: "4+" },
            ]}
          />
        </QuestionCard>

        <QuestionCard
          title="Day or night reader"
          description="Let us know when you feel most focused so we can time your goals."
        >
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium transition ${
              state.readerType === "day"
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-white text-muted-foreground hover:bg-muted"
            }`}
            onClick={() =>
              setState((prev) => ({ ...prev, readerType: "day" }))
            }
          >
            I am a day reader
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium transition ${
              state.readerType === "night"
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-white text-muted-foreground hover:bg-muted"
            }`}
            onClick={() =>
              setState((prev) => ({ ...prev, readerType: "night" }))
            }
          >
            I am a night reader
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium transition ${
              state.readerType === "both"
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-white text-muted-foreground hover:bg-muted"
            }`}
            onClick={() =>
              setState((prev) => ({ ...prev, readerType: "both" }))
            }
          >
            It depends on my schedule
          </button>
        </QuestionCard>
      </div>

      <footer className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          These answers are used to mock how we will personalise pacing,
          content type, and reminders for you.
        </p>
        <Button type="submit" loading={saving}>
          Finish setup and enter dashboard
        </Button>
      </footer>
    </form>
  );
}

