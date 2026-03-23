"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";

interface Leader {
  id: number;
  name: string;
  department: string;
  points: number;
  hoursToday: string;
}

const mockLeaders: Leader[] = [
  {
    id: 1,
    name: "Ola T.",
    department: "Computer Science",
    points: 420,
    hoursToday: "2 hr 10 min",
  },
  {
    id: 2,
    name: "Chidera M.",
    department: "Software Engineering",
    points: 380,
    hoursToday: "1 hr 55 min",
  },
  {
    id: 3,
    name: "You",
    department: "Computer Science",
    points: 320,
    hoursToday: "1 hr 45 min",
  },
  {
    id: 4,
    name: "Favour A.",
    department: "Nursing Science",
    points: 290,
    hoursToday: "1 hr 20 min",
  },
];

export default function LeaderboardPage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Leadership board
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track how you and other students are progressing. Points are earned
            from attempted practice questions, completed topics, and time spent
            in focused study sessions.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-white/80 shadow-sm">
          <table className="min-w-full border-collapse text-left text-xs sm:text-sm">
            <thead className="bg-muted/80 text-[11px] font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-2 sm:px-6">Position</th>
                <th className="px-4 py-2 sm:px-6">Name</th>
                <th className="hidden px-4 py-2 sm:table-cell sm:px-6">
                  Department
                </th>
                <th className="px-4 py-2 sm:px-6">Points</th>
                <th className="px-4 py-2 sm:px-6">Today&apos;s hours</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaders.map((leader, index) => {
                const isYou = leader.name === "You";
                return (
                  <tr
                    key={leader.id}
                    className={`border-t border-border/60 ${
                      isYou ? "bg-primary-soft/40" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2 text-[11px] font-medium text-muted-foreground sm:px-6">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-xs font-semibold text-slate-900 sm:px-6">
                      {leader.name}
                    </td>
                    <td className="hidden px-4 py-2 text-[11px] text-muted-foreground sm:table-cell sm:px-6">
                      {leader.department}
                    </td>
                    <td className="px-4 py-2 text-xs font-semibold text-slate-900 sm:px-6">
                      {leader.points}
                    </td>
                    <td className="px-4 py-2 text-[11px] text-muted-foreground sm:px-6">
                      {leader.hoursToday}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-border/60 bg-muted/70 px-4 py-2 text-[11px] text-muted-foreground sm:px-6">
            This board uses mocked data. The real system will rank students
            daily, weekly, and by department using backend analytics.
          </div>
        </section>
      </div>
    </AppShell>
  );
}

