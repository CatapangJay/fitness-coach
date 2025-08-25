export type FitnessTerm = {
  key: string;
  term: string;
  short: string;
  details: string;
  examples?: string[];
  tags?: string[];
};

export const FITNESS_TERMS: FitnessTerm[] = [
  {
    key: "tdee",
    term: "TDEE (Total Daily Energy Expenditure)",
    short:
      "Kabuuang calories na ginagamit mo sa isang araw, kasama ang galaw at metabolismo.",
    details:
      "Ito ang total na energy na kailangan ng katawan mo kada araw para mapanatili ang timbang mo. Binubuo ito ng BMR (pahinga), NEAT (mga galaw sa araw-araw), EAT (exercise), at TEF (energy ng pagtunaw ng pagkain).",
    examples: [
      "Kung ang TDEE mo ay 2200 kcal, sa deficit (−300) ay ~1900 kcal kada araw.",
      "Kung gusto mong mag-maintain, targetin ang TDEE mo mismo."
    ],
    tags: ["nutrition", "calories"],
  },
  {
    key: "bmr",
    term: "BMR (Basal Metabolic Rate)",
    short: "Calories na ginagamit ng katawan kahit pahinga ka lang.",
    details:
      "Ito ang energy na kailangan ng katawan para gumana ang mga vital functions (paghinga, tibok ng puso, atbp.) kahit wala kang ginagawa.",
    examples: [
      "Kung BMR mo ay 1500 kcal, hindi pa kasama dito ang galaw sa maghapon.",
    ],
    tags: ["nutrition", "calories"],
  },
  {
    key: "progressive_overload",
    term: "Progressive Overload",
    short:
      "Unti-unting pagtaas ng hirap sa training para tuloy-tuloy ang pag-improve.",
    details:
      "Pwedeng dagdagan ang bigat, reps, sets, o bawasan ang pahinga para hamunin ang katawan at makakita ng progress sa lakas at muscles.",
    examples: [
      "Hal. linggo-linggong dagdag ng 2.5 kg sa squat kung maayos pa rin ang porma.",
    ],
    tags: ["training"],
  },
  {
    key: "hypertrophy",
    term: "Hypertrophy",
    short: "Paglaki ng muscle fibers dahil sa resistance training at tamang pagkain.",
    details:
      "Karaniwang ginagawa sa 6–15 reps, moderate na bigat, at sapat na volume. Importante ang protein at tamang pahinga.",
    tags: ["training", "muscle"],
  },
  {
    key: "rpe",
    term: "RPE (Rate of Perceived Exertion)",
    short:
      "Sukatan kung gaano kahirap ang set (1–10), 10 = max effort.",
    details:
      "Kung RPE 8, may ~2 reps pa dapat natitira. Nakakatulong ito para kontrolin ang intensity ng workout kahit walang spotter o exact %1RM.",
    examples: ["Bench press na tumigil sa RPE 7–8 para sa quality reps."],
    tags: ["training", "intensity"],
  },
];

export function findTermByKey(key: string): FitnessTerm | undefined {
  return FITNESS_TERMS.find((t) => t.key === key);
}

export function searchTerms(query: string): FitnessTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return FITNESS_TERMS;
  return FITNESS_TERMS.filter((t) =>
    [t.term, t.short, t.details, ...(t.tags ?? []), ...(t.examples ?? [])]
      .join("\n")
      .toLowerCase()
      .includes(q)
  );
}
