"use client";

import { CheckCircle2, ChevronDown, Eye, EyeOff, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

interface ApiKeyPanelProps {
  apiKey: string;
  onSave: (key: string) => void;
}
export default function ApiKeyPanel({ apiKey, onSave }: ApiKeyPanelProps) {
  const [draft, setDraft] = useState(apiKey);
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(!apiKey);

  useEffect(() => {
    setDraft(apiKey);
    if (apiKey) {
      setExpanded(false);
    }
  }, [apiKey]);

  const save = () => {
    onSave(draft.trim());
    setExpanded(false);
  };

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-500">
            <KeyRound size={17} />
          </span>
          <span>
            <span className="block font-bold">Connect Gemini</span>
            <span className="block text-xs text-slate-500">
              Required to compare and tailor
            </span>
          </span>
          {apiKey && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={13} />
              Key saved
            </span>
          )}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="border-t px-4 py-5 sm:px-5">
          <p className="text-sm leading-6 text-slate-600">
            Create a free API key in{" "}
            <a
              className="font-semibold text-brand-500 underline"
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener"
            >
              Google AI Studio
            </a>
            . It is stored only in this browser and sent directly to Google for
            your request.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="relative min-w-60 flex-1">
              <input
                className="w-full rounded-xl border bg-slate-50 py-2.5 pl-3 pr-12 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                type={show ? "text" : "password"}
                placeholder="Enter your Gemini API key"
                value={draft}
                aria-label="Google Gemini API key"
                onChange={(event) => setDraft(event.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? "Hide API key" : "Show API key"}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <button
              type="button"
              disabled={!draft.trim()}
              onClick={save}
              className="rounded-xl bg-brand-500 px-4 py-2.5 font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save key
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
