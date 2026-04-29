"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-slate-300 disabled:text-slate-500 dark:bg-cyan-300/90 dark:text-slate-950 dark:hover:bg-cyan-200 dark:disabled:bg-white/35 dark:disabled:text-white/60",
  outline:
    "border border-sky-300 bg-white/65 text-slate-800 hover:bg-white dark:border-white/45 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/20 dark:text-white dark:hover:bg-white/30",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 dark:focus-visible:ring-cyan-200/80",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
