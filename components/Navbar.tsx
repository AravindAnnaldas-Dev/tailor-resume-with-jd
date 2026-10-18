"use client";

import { ArrowUpRight, FileText, RotateCcw, Sparkles } from "lucide-react";

interface NavbarProps {
  showReset: boolean;
  onReset: () => void;
}

export default function Navbar({ showReset, onReset }: NavbarProps) {
  return (
    <nav
      className="relative isolate overflow-hidden border-b border-slate-800 bg-[#0b0f17]"
      aria-label="Main navigation"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,#4a5366_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -left-20 top-[-110px] h-56 w-80 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-28 h-56 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-[88px] max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#workspace"
          className="group flex items-center gap-3"
          aria-label="Resume Tailor home"
        >
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 via-brand-500 to-indigo-700 text-white shadow-lg shadow-brand-500/25 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <FileText size={21} strokeWidth={2.3} />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-[#0b0f17] bg-amber-300 text-slate-900">
              <Sparkles size={9} strokeWidth={3} />
            </span>
          </span>
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-[-0.05em] text-white">
              Resume<span className="text-violet-300">Tailor</span>
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Precision application studio
            </span>
          </span>
        </a>

        {showReset ? (
          <button
            type="button"
            onClick={onReset}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm font-bold text-slate-200 transition hover:border-violet-400/70 hover:bg-violet-500/10 hover:text-white"
          >
            <RotateCcw
              size={15}
              className="transition group-hover:-rotate-45"
            />
            <span className="hidden sm:inline">Start fresh</span>
            <ArrowUpRight size={14} className="text-violet-300" />
          </button>
        ) : (
          <span className="hidden text-right text-xs leading-5 text-slate-500 sm:block">
            <span className="block text-violet-300">Your experience,</span>
            sharpened for every role.
          </span>
        )}
      </div>
    </nav>
  );
}
