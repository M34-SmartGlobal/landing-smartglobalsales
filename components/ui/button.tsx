import * as React from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red text-white shadow-glow hover:bg-brand-red-dark focus-visible:ring-brand-red",
  secondary:
    "border border-brand-line bg-white text-brand-graphite shadow-sm hover:border-brand-red hover:text-brand-red focus-visible:ring-brand-red",
  ghost:
    "text-brand-graphite hover:bg-brand-red-soft hover:text-brand-red focus-visible:ring-brand-red",
  danger:
    "bg-brand-black text-white hover:bg-brand-red-dark focus-visible:ring-brand-red",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
