"use client";

import * as React from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, hint, error, id, className = "", options, placeholder, ...props },
    ref,
  ) => {
    const selectId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground/80"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`h-11 w-full rounded-lg border border-border bg-white px-3 text-sm shadow-xs outline-none ring-0 transition focus:border-primary focus:ring-2 focus:ring-ring/50 ${error ? "border-red-500 focus:ring-red-500/40" : ""} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(hint || error) && (
          <p
            className={`text-xs ${error ? "text-red-600" : "text-muted-foreground"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

