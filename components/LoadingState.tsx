"use client";

import { LoaderCircle, Sparkles } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export default function LoadingState({
  title,
  description,
}: LoadingStateProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-brand-50 p-5 shadow-sm sm:p-6"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />
      <div className="relative flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
          <LoaderCircle className="animate-spin" size={21} />
        </span>
        <div>
          <p className="flex items-center gap-2 font-bold text-slate-900">
            {title}
            <Sparkles size={15} className="text-brand-500" />
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-4 h-1.5 w-52 overflow-hidden rounded-full bg-brand-500/15">
            <div className="h-full w-2/3 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-brand-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
