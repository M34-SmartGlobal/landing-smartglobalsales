import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
};

export function Select({
  id,
  label,
  error,
  placeholder = "Selecciona una opción",
  options,
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-semibold text-current">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error && selectId ? `${selectId}-error` : undefined}
          className={cn(
            "h-12 w-full appearance-none rounded-2xl border border-brand-line bg-white px-4 pr-11 text-sm text-brand-graphite shadow-sm outline-none transition duration-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-brand-muted",
            error && "border-brand-red focus:border-brand-red focus:ring-brand-red/15",
            className,
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 size-2.5 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-brand-red" />
      </div>
      {error ? (
        <p id={selectId ? `${selectId}-error` : undefined} className="text-sm text-brand-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
