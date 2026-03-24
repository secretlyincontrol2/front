import { AppShell } from "@/components/layout/app-shell";
import { CourseSelector } from "@/components/dashboard/course-selector";
import { SessionOptions } from "@/components/dashboard/session-options";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Your personalised tutoring dashboard
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
                label="Today&apos;s focused study time"
                value="0 hr 0 min"
                helper="Study time is calculated from your reading and practice sessions."
              />
              <StatCard
                label="Practice points earned today"
                value="120 pts"
                helper="Points increase with correct answers and completed topics."
                accent="secondary"
              />
            </div>
            <StatCard
              label="Weekly goal"
              value="Sync your first course to begin"
              helper="Goals track your study streaks and achievements."
            />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

