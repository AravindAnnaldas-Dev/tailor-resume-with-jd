"use client";

import { Check, ClipboardCopy, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

interface TailoredOutputPanelProps {
  latex: string;
  truncated: boolean;
}

export default function TailoredOutputPanel({
  latex,
  truncated,
}: TailoredOutputPanelProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [notice, setNotice] = useState("");
  const incomplete = !latex.includes("\\end{document}");
  const selectAll = () => {
    const el = textAreaRef.current;
    if (!el) return;
    el.focus();
    el.select();
    el.setSelectionRange(0, latex.length);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setNotice("Copied to clipboard");
    } catch {
      selectAll();
      setNotice("Clipboard blocked — text selected, press Ctrl/Cmd+C to copy.");
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">3. Your tailored resume</h2>
          <p className="text-xs text-slate-500">
            Review the source before compiling it in Overleaf.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-brand-500 hover:bg-brand-50"
          >
            <ClipboardCopy size={16} />
            Copy source
          </button>
          <a
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            href="https://www.overleaf.com/project"
            target="_blank"
            rel="noopener"
          >
            Open Overleaf
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
      {(truncated || incomplete) && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This response may be incomplete{" "}
          {truncated
            ? "(cut off before finishing)"
            : "(no \\end{document} found)"}
          . Try tailoring again if the LaTex below looks cut off.
        </div>
      )}
      <textarea
        ref={textAreaRef}
        readOnly
        rows={18}
        value={latex}
        className="w-full resize-y rounded-xl border bg-slate-50 p-3 text-xs leading-5 outline-none"
      />
      <p className="mt-3 text-xs text-slate-500">
        Paste this into Overleaf, hit Recompile, then download the PDF.
      </p>
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          <Check size={16} />
          {notice}
        </div>
      )}
    </section>
  );
}
