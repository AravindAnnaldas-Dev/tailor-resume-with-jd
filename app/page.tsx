"use client";

import {
  BriefcaseBusiness,
  FileText,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import ApiKeyPanel from "@/components/ApiKeyPanel";
import Navbar from "@/components/Navbar";
import SkillsComparisonPanel from "@/components/SkillsComparisonPanel";
import StatusAlert from "@/components/StatusAlert";
import TailoredOutputPanel from "@/components/TailoredOutputPanel";
import TextInputPanel from "@/components/TextInputPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { compareSkills, tailorResume } from "@/lib/geminiClient";
import type { AppStage, SkillComparisonResult } from "@/types";

const button =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function Home() {
  const { value: apiKey, setValue: setApiKey } =
    useLocalStorage("resumeTailorApiKey");
  const { value: resume, setValue: setResume } =
    useLocalStorage("resumeTailorResume");
  const { value: jobDescription, setValue: setJobDescription } =
    useLocalStorage("resumeTailorJobDescription");
  const [stage, setStage] = useState<AppStage>("input");
  const [comparison, setComparison] = useState<SkillComparisonResult | null>(
    null,
  );
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState("");
  const comparing = stage === "comparing";
  const tailoring = stage === "tailoring";
  const canCompare =
    Boolean(resume.trim() && jobDescription.trim()) && !tailoring;
  const toggleSkill = (skill: string) =>
    setSelectedSkills((previous) => {
      const next = new Set(previous);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  const compare = async () => {
    setError("");
    setTailoredLatex("");
    setStage("comparing");
    try {
      const result = await compareSkills(resume, jobDescription, apiKey);
      setComparison(result);
      setSelectedSkills(new Set(result.matched));
      setStage("compared");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Couldn't compare skills. Try again.",
      );
      setStage("input");
    }
  };
  const tailor = async () => {
    setError("");
    setStage("tailoring");
    try {
      const result = await tailorResume(
        resume,
        jobDescription,
        Array.from(selectedSkills),
        apiKey,
      );
      setTailoredLatex(result.latex);
      setTruncated(result.truncated);
      setStage("done");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Couldn't generate the tailored resume. Try again.",
      );
      setStage("compared");
    }
  };
  const status = useMemo(
    () =>
      stage === "comparing"
        ? "Finding the strongest overlap between your resume and this role…"
        : stage === "tailoring"
          ? "Building a tailored, structure-preserving LaTeX resume…"
          : "",
    [stage],
  );
  const reset = () => {
    setComparison(null);
    setSelectedSkills(new Set());
    setTailoredLatex("");
    setTruncated(false);
    setError("");
    setStage("input");
  };

  return (
    <main className="min-h-screen">
      <Navbar
        showReset={Boolean(comparison || tailoredLatex)}
        onReset={reset}
      />
      <div
        id="workspace"
        className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6 sm:py-14"
      >
        <header>
          <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold tracking-[.12em] text-brand-500">
            <Zap size={15} />
            AI-ASSISTED APPLICATION WORKSPACE
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Make every application feel intentional.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Match your existing LaTeX resume to a role, choose the skills worth
            emphasizing, then generate a tailored version ready for Overleaf.
          </p>
        </header>
        <ApiKeyPanel apiKey={apiKey} onSave={setApiKey} />
        <StatusAlert message={error} severity="error" />
        <StatusAlert message={status} severity="info" />
        <section>
          <h2 className="text-lg font-semibold">1. Add your source material</h2>
          <p className="mb-5 mt-1 text-sm text-slate-600">
            Your drafts stay in this browser. Only the comparison request is
            sent directly to Google using your key.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInputPanel
              title="Your base resume"
              helperText="LaTeX source"
              icon={<FileText size={17} />}
              value={resume}
              onChange={setResume}
              placeholder="Paste your LaTeX resume source here, or upload a .tex file…"
              acceptedFileTypes=".tex"
            />
            <TextInputPanel
              title="Target job description"
              helperText="Role requirements"
              icon={<BriefcaseBusiness size={17} />}
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the job description here, or upload a text file…"
              acceptedFileTypes=".txt"
            />
          </div>
        </section>
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-50 p-4">
          <p className="text-sm text-slate-600">
            {canCompare
              ? "Ready when you are — we’ll identify relevant experience and skill gaps."
              : "Add both your resume and the job description to continue."}
          </p>
          <button
            type="button"
            className={button}
            disabled={!canCompare || comparing}
            onClick={compare}
          >
            <Sparkles size={18} />
            {comparing ? "Comparing skills…" : "Compare skills"}
          </button>
        </section>
        {comparison && (
          <>
            <hr />
            <section>
              <h2 className="text-lg font-semibold">2. Choose your emphasis</h2>
              <p className="mb-5 mt-1 text-sm text-slate-600">
                Keep skills that you can genuinely support. Your selection
                guides the wording, not the facts.
              </p>
              <SkillsComparisonPanel
                result={comparison}
                selected={selectedSkills}
                onToggle={toggleSkill}
              />
            </section>
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-accent-50 p-4">
              <p className="text-sm text-slate-600">
                {selectedSkills.size} skill
                {selectedSkills.size === 1 ? "" : "s"} selected for emphasis
              </p>
              <button
                type="button"
                className={`${button} bg-accent-500 hover:bg-accent-700`}
                disabled={tailoring}
                onClick={tailor}
              >
                <WandSparkles size={18} />
                {tailoring
                  ? "Tailoring your resume…"
                  : "Generate tailored resume"}
              </button>
            </section>
          </>
        )}
        {tailoredLatex && (
          <TailoredOutputPanel latex={tailoredLatex} truncated={truncated} />
        )}
      </div>
    </main>
  );
}
