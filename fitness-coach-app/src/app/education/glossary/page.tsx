import Glossary from "@/components/education/Glossary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Glossary",
  description:
    "Simple, Filipino-context explanations of fitness terms like TDEE, RPE, and hypertrophy.",
};

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <Glossary />
    </main>
  );
}
