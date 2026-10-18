"use client";

import { Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import type { ReactNode } from "react";

interface TextInputPanelProps {
  title: string;
  helperText: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  acceptedFileTypes?: string;
}

export default function TextInputPanel({
  title,
  helperText,
  icon,
  value,
  onChange,
  placeholder,
  acceptedFileTypes = ".tex",
}: TextInputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = acceptedFileTypes
    .split(",")
    .map((ext) => ext.trim().toLowerCase())
    .filter(Boolean);

  const readFile = (file: File | undefined) => {
    if (!file) return;
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));
    if (!isAllowed) {
      alert(`Please upload a ${acceptedFileTypes} file only.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => onChange((event.target?.result as string) ?? "");
    reader.readAsText(file);
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <section className="flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-500">
            {icon}
          </span>
          <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-xs text-slate-500">{helperText}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-500 hover:text-brand-700"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} />
          Upload
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept={acceptedFileTypes}
          onChange={(event) => readFile(event.target.files?.[0])}
        />
      </div>
      <textarea
        rows={12}
        aria-label={title}
        className="mt-4 min-h-64 w-full flex-1 resize-y rounded-xl border bg-slate-50 p-3 text-xs leading-5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full border px-2.5 py-1 text-xs text-slate-600">
          {words.toLocaleString()} words
        </span>
        <button
          type="button"
          disabled={!value}
          onClick={() => onChange("")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={15} />
          Clear
        </button>
      </div>
    </section>
  );
}
