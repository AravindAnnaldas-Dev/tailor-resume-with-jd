"use client";

import { BadgeCheck, CirclePlus } from "lucide-react";
import type { SkillComparisonResult } from "@/types";

interface SkillsComparisonPanelProps {
  result: SkillComparisonResult;
  selected: Set<string>;
  onToggle: (skill: string) => void;
  disabled?: boolean;
}

export default function SkillsComparisonPanel({
  result,
  selected,
  onToggle,
  disabled = false,
}: SkillsComparisonPanelProps) {
  const skills = (items: string[], tone: "brand" | "accent") =>
    items.length ? (
      items.map((skill) => (
        <button
          type="button"
          key={skill}
          onClick={() => onToggle(skill)}
          disabled={disabled}
          aria-pressed={selected.has(skill)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${selected.has(skill) ? (tone === "brand" ? "border-brand-500 bg-brand-500 text-white" : "border-accent-500 bg-accent-500 text-white") : "bg-white text-slate-700 hover:border-slate-400"}`}
        >
          {skill}
        </button>
      ))
    ) : (
      <p className="text-sm text-slate-400">No direct matches found.</p>
    );

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <p className="mb-6 text-sm text-slate-600">
        Click a skill to include or exclude it from the tailoring brief. Filled
        chips are selected.
      </p>
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
            <BadgeCheck size={17} className="text-emerald-600" />
            Evidence already in your resume
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills(result.matched, "brand")}
          </div>
        </div>
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
            <CirclePlus size={17} className="text-accent-500" />
            Role signals to consider
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missing.length ? (
              skills(result.missing, "accent")
            ) : (
              <p className="text-sm text-slate-400">
                No obvious gaps found — great fit.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
