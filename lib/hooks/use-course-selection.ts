"use client";

import * as React from "react";

export interface CourseSelection {
  department: string;
  course: string;
  courseLabel?: string;
}

export function useCourseSelection() {
  const [selection, setSelection] = React.useState<CourseSelection>({
    department: "",
    course: "",
    courseLabel: "",
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("bupt_course_selection");
    if (saved) {
      try {
        setSelection(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse course selection", e);
      }
    }
  }, []);

  const updateSelection = (newSelection: Partial<CourseSelection>) => {
    setSelection((prev) => {
      const updated = { ...prev, ...newSelection };
      localStorage.setItem("bupt_course_selection", JSON.stringify(updated));
      return updated;
    });
  };

  const clearSelection = () => {
    const empty = { department: "", course: "", courseLabel: "" };
    setSelection(empty);
    localStorage.removeItem("bupt_course_selection");
  };

  return {
    selection,
    updateSelection,
    clearSelection,
    hasSelection: !!selection.department && !!selection.course,
  };
}
