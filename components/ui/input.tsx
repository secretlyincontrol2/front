"use client";

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className = "", ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground/80"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`h-11 w-full rounded-lg border border-border bg-white px-3 text-sm shadow-sm outline-none ring-0 transition focus:border-primary focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/80 ${error ? "border-red-500 focus:ring-red-500/40" : ""} ${className}`}
          {...props}
        />
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

Input.displayName = "Input";

