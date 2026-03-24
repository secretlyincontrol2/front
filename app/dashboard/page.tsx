"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CourseSelector } from "@/components/dashboard/course-selector";
import { SessionOptions } from "@/components/dashboard/session-options";
import { StatCard } from "@/components/dashboard/stat-card";
import { getUser } from "@/lib/auth";
import { getProgress } from "@/lib/api";

export default function DashboardPage() {
  const [userName, setUserName] = React.useState("");
  const [studyTime, setStudyTime] = React.useState("—");
  const [practicePoints, setPracticePoints] = React.useState("—");
  const [streak, setStreak] = React.useState(0);

  React.useEffect(() => {
    const user = getUser();
    if (user?.name) {
      setUserName(user.name.split(" ")[0]);
    }

    if (user?._id) {
      getProgress(user._id)
        .then((progress) => {
          const hours = Math.floor(progress.totalStudyMinutes / 60);
          const mins = Math.round(progress.totalStudyMinutes % 60);
          setStudyTime(hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`);
          setPracticePoints(`${progress.totalPracticePoints} pts`);
          setStreak(progress.streak);
        })
        .catch(() => {
          // Fallback if API fails
        });
    }
  }, []);

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {userName ? `Welcome, ${userName}! 👋` : "Your personalised tutoring dashboard"}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Pick your department and course, then choose between study and
            practice sessions. Your hours, points, and goals are tracked here so
            you can see daily progress at a glance.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-4">
            <CourseSelector />
            <SessionOptions />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Total study time"
                value={studyTime}
                helper="Tracked from your study and practice sessions."
              />
              <StatCard
                label="Total points earned"
                value={practicePoints}
                helper="Points increase with correct answers."
                accent="secondary"
              />
            </div>
            <StatCard
              label="Learning streak"
              value={streak > 0 ? `${streak} day${streak > 1 ? "s" : ""}` : "Start studying to build your streak!"}
              helper="Keep studying daily to maintain and grow your streak."
            />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
