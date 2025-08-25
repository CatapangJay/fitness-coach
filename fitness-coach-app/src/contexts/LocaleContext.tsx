"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LanguageCode = "en" | "fil";
export type UnitSystem = "metric" | "imperial";

export interface LocaleState {
  language: LanguageCode;
  unitSystem: UnitSystem;
  locale: string; // e.g., en-PH, fil-PH
  currency: string; // e.g., PHP
}

interface LocaleContextValue extends LocaleState {
  setLanguage: (lang: LanguageCode) => void;
  setUnitSystem: (unit: UnitSystem) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "fc.locale";

const defaultState: LocaleState = {
  language: "en",
  unitSystem: "metric",
  locale: "en-PH",
  currency: "PHP",
};

const dictionary: Record<LanguageCode, Record<string, string>> = {
  en: {
    "app.title": "Fitness Coach",
    "language.english": "English",
    "language.filipino": "Filipino",
    "units.metric": "Metric",
    "units.imperial": "Imperial",
    // Glossary
    "glossary.title": "Fitness Glossary",
    "glossary.subtitle": "Simple explanations with Filipino context. Hover or focus terms to see quick tips.",
    "glossary.search.placeholder": "Search terms (e.g., TDEE, RPE, hypertrophy)",
    "glossary.examples": "Examples",
    "glossary.quick_tip": "Quick tip",
    "glossary.no_results": "No results.",
    // Exercise
    "exercise.target_muscles": "Target Muscles:",
    "exercise.equipment_needed": "Equipment Needed:",
    "exercise.show_details": "Show Details",
    "exercise.hide_details": "Hide Details",
    "exercise.how_to_perform": "How to Perform:",
    "exercise.form_tips": "Form Tips:",
    "exercise.avoid_mistakes": "Avoid These Mistakes:",
    "exercise.benefits": "Benefits:",
    "exercise.safety_notes": "Safety Notes:",
    "exercise.modifications": "Modifications:",
    "exercise.beginner_options": "Beginner Options:",
    "exercise.advanced_options": "Advanced Options:",
  },
  fil: {
    "app.title": "Fitness Coach",
    "language.english": "Ingles",
    "language.filipino": "Filipino",
    "units.metric": "Metriko",
    "units.imperial": "Imperyal",
    // Glossary
    "glossary.title": "Talahulugan sa Fitness",
    "glossary.subtitle": "Simpleng paliwanag na may kontekstong Pilipino. I-hover o i-focus ang mga termino para sa mabilis na tip.",
    "glossary.search.placeholder": "Maghanap ng termino (hal., TDEE, RPE, hypertrophy)",
    "glossary.examples": "Mga Halimbawa",
    "glossary.quick_tip": "Mabilis na tip",
    "glossary.no_results": "Walang resulta.",
    // Exercise
    "exercise.target_muscles": "Target na Kalamnan:",
    "exercise.equipment_needed": "Kailangang Kagamitan:",
    "exercise.show_details": "Ipakita ang Detalye",
    "exercise.hide_details": "Itago ang Detalye",
    "exercise.how_to_perform": "Paraan ng Paggawa:",
    "exercise.form_tips": "Mga Tip sa Porma:",
    "exercise.avoid_mistakes": "Iwasang Mga Pagkakamali:",
    "exercise.benefits": "Mga Benepisyo:",
    "exercise.safety_notes": "Mga Paalala sa Kaligtasan:",
    "exercise.modifications": "Mga Pagbabago:",
    "exercise.beginner_options": "Para sa Baguhan:",
    "exercise.advanced_options": "Para sa Bihasa:",
  },
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<LocaleState>(defaultState);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LocaleState>;
        setState((prev) => ({
          ...prev,
          ...parsed,
          locale: parsed.language === "fil" ? "fil-PH" : "en-PH",
          currency: "PHP",
        }));
      }
    } catch {}
  }, []);

  // Persist and apply <html lang>
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ language: state.language, unitSystem: state.unitSystem })
        );
        // Update document language for a11y/SEO
        document.documentElement.lang = state.language === "fil" ? "fil" : "en";
      }
    } catch {}
  }, [state.language, state.unitSystem]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setState((prev) => ({ ...prev, language: lang, locale: lang === "fil" ? "fil-PH" : "en-PH" }));
  }, []);

  const setUnitSystem = useCallback((unit: UnitSystem) => {
    setState((prev) => ({ ...prev, unitSystem: unit }));
  }, []);

  const t = useCallback(
    (key: string) => {
      const langDict = dictionary[state.language] || dictionary.en;
      return langDict[key] ?? key;
    },
    [state.language]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ ...state, setLanguage, setUnitSystem, t }),
    [state, setLanguage, setUnitSystem, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
};
