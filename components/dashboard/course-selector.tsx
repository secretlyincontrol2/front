"use client";

import * as React from "react";
import { Select } from "@/components/ui/select";

const departments = [
  { label: "Select department", value: "" },
  { label: "Computer Science", value: "cs" },
  { label: "Software Engineering", value: "se" },
  { label: "Information Technology", value: "it" },
  { label: "Accounting", value: "acc" },
  { label: "Nursing Science", value: "nur" },
];

const coursesByDepartment: Record<string, { label: string; value: string }[]> =
  {
    cs: [
      { label: "CSC 101 &ndash; Introduction to Computing", value: "csc101" },
      { label: "CSC 205 &ndash; Data Structures", value: "csc205" },
      { label: "CSC 207 &ndash; Computer Architecture", value: "csc207" },
    ],
    se: [
      { label: "SENG 201 &ndash; Software Modelling", value: "seng201" },
      { label: "SENG 203 &ndash; Web Engineering", value: "seng203" },
    ],
    it: [
      { label: "IT 101 &ndash; Digital Literacy", value: "it101" },
      { label: "IT 203 &ndash; Networking Fundamentals", value: "it203" },
    ],
    acc: [
      { label: "ACC 101 &ndash; Principles of Accounting", value: "acc101" },
      { label: "ACC 203 &ndash; Cost Accounting", value: "acc203" },
    ],
    nur: [
      { label: "NUR 101 &ndash; Fundamentals of Nursing", value: "nur101" },
      { label: "NUR 205 &ndash; Anatomy and Physiology", value: "nur205" },
    ],
  };

export function CourseSelector() {
  const [department, setDepartment] = React.useState("");
  const [course, setCourse] = React.useState("");

  const courseOptions =
    coursesByDepartment[department] || [
      { label: "Select a course", value: "" },
    ];

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          Choose your department and course
        </h2>
        <p className="text-xs text-muted-foreground">
          This selection is mocked for now. When the backend is ready, it will
          load your department and registered courses automatically.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Department"
          name="department"
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value);
            setCourse("");
          }}
          options={departments}
        />
        <Select
          label="Course"
          name="course"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          options={
            department
              ? [
                  { label: "Select a course", value: "" },
                  ...(coursesByDepartment[department] || []),
                ]
              : [{ label: "Select department first", value: "" }]
          }
        />
      </div>

      {department && course && (
        <p className="text-xs font-medium text-primary">
          You have selected{" "}
          <span className="underline decoration-secondary">
            {
              (coursesByDepartment[department] || []).find(
                (c) => c.value === course,
              )?.label
            }
          </span>{" "}
          for this session.
        </p>
      )}
    </section>
  );
}

