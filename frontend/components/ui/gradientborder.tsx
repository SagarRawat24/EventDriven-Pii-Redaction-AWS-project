"use client";

import { cn } from "@/lib/utils";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function GradientBorder({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}: GradientBorderProps) {
  return (
    <span
      style={
        {
          "--bg-size": `${speed * 300}%`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        `
        relative inline-flex rounded-2xl p-[0.75px]
        animate-gradient
        bg-gradient-to-r
        from-[var(--color-from)]
        via-[var(--color-to)]
        to-[var(--color-from)]
        bg-[length:var(--bg-size)_100%]
        `,
        className
      )}
    >
      <span className="rounded-2xl bg-background px-8 py-2  ">
        {children}
      </span>
    </span>
  );
}
