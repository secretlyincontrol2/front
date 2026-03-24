import * as React from "react";
import { useCourseSelection } from "@/lib/hooks/use-course-selection";
import { getCourses, type Department, type Course } from "@/lib/api";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";

export function CourseSelector() {
  const { selection, updateSelection } = useCourseSelection();
  const [data, setData] = React.useState<{ departments: Department[] }>({ departments: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();
        setData(res);
      } catch (error) {
        console.error("Failed to load courses", error);
        toast.error("Connectivity Error", { description: "Failed to fetch course list from backend." });
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const currentDept = data.departments.find(d => d.value === selection.department);
  const availableCourses = currentDept?.courses || [];

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          Choose your department and course
        </h2>
        <p className="text-xs text-muted-foreground">
          Select your department and registered course to begin your study or practice session.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Department"
          name="department"
          value={selection.department}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            updateSelection({ department: event.target.value, course: "", courseLabel: "" });
          }}
          disabled={loading}
          options={[
            { label: loading ? "Loading..." : "Select department", value: "" },
            ...data.departments.map(d => ({ label: d.label, value: d.value }))
          ]}
        />
        <Select
          label="Course"
          name="course"
          value={selection.course}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const courseVal = event.target.value;
            const label = availableCourses.find((c: Course) => c.value === courseVal)?.label || "";
            updateSelection({ course: courseVal, courseLabel: label });
          }}
          disabled={loading || !selection.department}
          options={[
            { label: selection.department ? "Select a course" : "Select department first", value: "" },
            ...availableCourses.map((c: Course) => ({ label: c.label, value: c.value }))
          ]}
        />
      </div>

      {selection.department && selection.course && (
        <p className="text-xs font-medium text-primary">
          You have selected{" "}
          <span className="underline decoration-secondary">
            {selection.courseLabel}
          </span>{" "}
          for this session.
        </p>
      )}
    </section>
  );
}

