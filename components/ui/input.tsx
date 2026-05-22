import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ id, label, error, className, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-semibold text-current">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        className={cn(
          "h-12 w-full rounded-2xl border border-brand-line bg-white px-4 text-sm text-brand-graphite shadow-sm outline-none transition duration-200 placeholder:text-brand-muted/70 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-brand-muted",
          error && "border-brand-red focus:border-brand-red focus:ring-brand-red/15",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} className="text-sm text-brand-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
