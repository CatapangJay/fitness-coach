"use client";

import React from "react";
import { searchTerms, type FitnessTerm } from "@/lib/education/terms";
import TermTooltip from "@/components/education/TermTooltip";
import { useLocale } from "@/contexts/LocaleContext";

export default function Glossary() {
  const { t } = useLocale();
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => searchTerms(query), [query]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{t('glossary.title')}</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          {t('glossary.subtitle')}
        </p>
      </header>

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('glossary.search.placeholder')}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <ul className="space-y-4">
        {results.map((termItem) => (
          <li key={termItem.key} className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-medium">{termItem.term}</h2>
              <span className="inline-flex gap-2">
                {termItem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{termItem.short}</p>
            {termItem.examples && termItem.examples.length > 0 && (
              <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="mb-1 font-medium">{t('glossary.examples')}</div>
                <ul className="list-disc space-y-1 pl-5">
                  {termItem.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-3 text-sm">
              <TermTooltip termKey={termItem.key}>
                <button className="rounded-md border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                  {t('glossary.quick_tip')}
                </button>
              </TermTooltip>
            </div>
          </li>
        ))}
        {results.length === 0 && (
          <li className="text-sm text-neutral-600 dark:text-neutral-300">{t('glossary.no_results')}</li>
        )}
      </ul>
    </section>
  );
}
