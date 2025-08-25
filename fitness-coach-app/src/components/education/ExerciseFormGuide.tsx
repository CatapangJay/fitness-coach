"use client";

import React from "react";

export type ExerciseFormGuideProps = {
  exerciseName: string;
  steps: string[];
  commonMistakes?: string[];
  safetyTips?: string[];
  beginnerModifications?: string[];
  media?: {
    imageUrl?: string; // could be upgraded to next/image later
    videoUrl?: string;
    caption?: string;
  };
  className?: string;
};

export default function ExerciseFormGuide({
  exerciseName,
  steps,
  commonMistakes,
  safetyTips,
  beginnerModifications,
  media,
  className,
}: ExerciseFormGuideProps) {
  return (
    <section className={"rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 " + (className ?? "")}>
      <header className="mb-3">
        <h2 className="text-xl font-semibold">{exerciseName}</h2>
        {media?.caption && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{media.caption}</p>
        )}
      </header>

      {media?.imageUrl && (
        // Note: replace with next/image if/when you have a static asset.
        <img
          src={media.imageUrl}
          alt={exerciseName}
          className="mb-4 w-full rounded-md border border-neutral-200 dark:border-neutral-800"
        />
      )}

      {media?.videoUrl && (
        <div className="mb-4">
          <video className="w-full rounded-md" src={media.videoUrl} controls />
        </div>
      )}

      <div className="space-y-4">
        <Block title="Step-by-step form" list={steps} />
        {commonMistakes && commonMistakes.length > 0 && (
          <Block title="Common mistakes" list={commonMistakes} variant="warning" />
        )}
        {safetyTips && safetyTips.length > 0 && (
          <Block title="Safety tips" list={safetyTips} variant="info" />
        )}
        {beginnerModifications && beginnerModifications.length > 0 && (
          <Block title="Beginner-friendly modifications" list={beginnerModifications} />
        )}
      </div>
    </section>
  );
}

function Block({
  title,
  list,
  variant,
}: {
  title: string;
  list: string[];
  variant?: "warning" | "info" | "default";
}) {
  const colors =
    variant === "warning"
      ? "border-amber-300 bg-amber-50 dark:border-amber-700/50 dark:bg-amber-900/20"
      : variant === "info"
      ? "border-sky-300 bg-sky-50 dark:border-sky-700/50 dark:bg-sky-900/20"
      : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900";
  return (
    <div className={`rounded-md border p-3 ${colors}`}>
      <div className="mb-1 font-medium">{title}</div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800 dark:text-neutral-200">
        {list.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
