"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Medal, Trophy, User, X, GraduationCap, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLeaderboard } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface Leader {
  id: string;
  name: string;
  department: string;
  points: number;
  hoursToday: string;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = React.useState<Leader[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedLeader, setSelectedLeader] = React.useState<Leader | null>(null);

  React.useEffect(() => {
    const currentUser = getUser();

    getLeaderboard(10)
      .then((data: LeaderboardEntry[]) => {
        const mapped = data.map((entry) => {
          const hours = Math.floor(entry.studyHoursTotal);
          const mins = Math.round((entry.studyHoursTotal - hours) * 60);
          return {
            id: entry._id,
            name: `${entry.firstname} ${entry.lastname.charAt(0)}.`,
            department: entry.department || "Not specified",
            points: entry.points,
            hoursToday: hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`,
            isCurrentUser: currentUser?._id === entry._id,
          };
        });
        setLeaders(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard.");
        setLoading(false);
      });
  }, []);

  const getMedal = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-slate-400" />;
      case 2:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            BUPT-AI Leadership Board
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track how you and other students are progressing. Top students are ranked based on points earned from study and practice.
          </p>
        </section>

        {loading ? (
          <section className="flex items-center justify-center rounded-2xl border border-border bg-white/80 p-12 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
            </div>
          </section>
        ) : error ? (
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white/80 p-8 shadow-sm text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Could not load leaderboard</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {error}. Make sure the backend services are running and the database is accessible.
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try again
            </Button>
          </section>
        ) : leaders.length === 0 ? (
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white/80 p-12 shadow-sm text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft/60">
              <Trophy className="h-8 w-8 text-primary/40" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">No students on the leaderboard yet</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                The leaderboard will populate as students complete sessions and earn points.
              </p>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-border bg-white/80 shadow-sm backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-xs sm:text-sm">
                <thead className="bg-muted/80 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 sm:px-6">Position</th>
                    <th className="px-4 py-3 sm:px-6">Name</th>
                    <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Department</th>
                    <th className="px-4 py-3 sm:px-6">Points</th>
                    <th className="px-4 py-3 sm:px-6 text-right">Study time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {leaders.map((leader, index) => {
                    const medal = getMedal(index);
                    return (
                      <tr
                        key={leader.id}
                        onClick={() => setSelectedLeader(leader)}
                        className={`group cursor-pointer transition-colors duration-150 ${leader.isCurrentUser ? "bg-primary-soft/50 hover:bg-primary-soft/70" : "bg-white/50 hover:bg-slate-50"
                          }`}
                      >
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span className={`${index < 3 ? 'font-bold text-slate-900' : 'text-muted-foreground'}`}>
                              {index + 1}
                            </span>
                            {medal}
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${leader.isCurrentUser ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                              <User className="h-4 w-4" />
                            </div>
                            <span className={`font-semibold ${leader.isCurrentUser ? 'text-primary' : 'text-slate-900'}`}>
                              {leader.isCurrentUser ? `${leader.name} (You)` : leader.name}
                            </span>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6 italic">
                          {leader.department}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                            {leader.points}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground sm:px-6">
                          {leader.hoursToday}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border/60 bg-muted/70 px-4 py-3 text-[11px] text-muted-foreground sm:px-6 italic text-center">
              Click on any student to view their profile preview.
            </div>
          </section>
        )}
      </div>

      {selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white p-0 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-24 bg-gradient-to-r from-primary/80 to-secondary/80"></div>

            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4 flex justify-center">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 shadow-lg flex items-center justify-center overflow-hidden">
                  <User className="h-12 w-12 text-slate-400" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">{selectedLeader.name}</h2>
                <p className="text-sm font-medium text-primary flex items-center justify-center gap-1 mt-1">
                  <GraduationCap className="h-4 w-4" />
                  {selectedLeader.department}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-slate-50/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1 mb-1">
                    <Award className="h-3 w-3" />
                    Points
                  </p>
                  <p className="text-lg font-bold text-slate-900">{selectedLeader.points}</p>
                </div>
                <div className="rounded-2xl border border-border bg-slate-50/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-3 w-3" />
                    Study time
                  </p>
                  <p className="text-lg font-bold text-slate-900">{selectedLeader.hoursToday}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button className="w-full rounded-xl" onClick={() => setSelectedLeader(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
