"use client";

import React from "react";
import { findTermByKey } from "@/lib/education/terms";

export type TermTooltipProps = {
  termKey: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
};

// Lightweight tooltip without extra deps. Accessible for hover and focus.
export default function TermTooltip({
  termKey,
  children,
  side = "top",
  align = "center",
  className,
}: TermTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const term = findTermByKey(termKey);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const positionClasses = getPositionClasses(side, align);

  return (
    <div
      className={`relative inline-block ${className ?? ""}`}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-describedby={open ? `tooltip-${termKey}` : undefined}
    >
      {children}
      {open && term && (
        <div
          id={`tooltip-${termKey}`}
          role="tooltip"
          className={`pointer-events-none absolute z-50 w-72 rounded-md border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-900 ${positionClasses}`}
        >
          <div className="font-medium">{term.term}</div>
          <div className="mt-1 text-neutral-600 dark:text-neutral-300">{term.short}</div>
          {term.examples && term.examples.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-600 dark:text-neutral-300">
              {term.examples.slice(0, 2).map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function getPositionClasses(side: string, align: string) {
  const base = "";
  const map: Record<string, string> = {
    "top-center": "left-1/2 -translate-x-1/2 bottom-full mb-2",
    "top-start": "left-0 bottom-full mb-2",
    "top-end": "right-0 bottom-full mb-2",
    "bottom-center": "left-1/2 -translate-x-1/2 top-full mt-2",
    "bottom-start": "left-0 top-full mt-2",
    "bottom-end": "right-0 top-full mt-2",
    "left-center": "right-full mr-2 top-1/2 -translate-y-1/2",
    "left-start": "right-full mr-2 top-0",
    "left-end": "right-full mr-2 bottom-0",
    "right-center": "left-full ml-2 top-1/2 -translate-y-1/2",
    "right-start": "left-full ml-2 top-0",
    "right-end": "left-full ml-2 bottom-0",
  };
  return `${base} ${map[`${side}-${align}`] ?? map["top-center"]}`;
}
