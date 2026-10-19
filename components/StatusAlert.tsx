"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

interface StatusAlertProps {
  message: string;
  severity: "info" | "error" | "success" | "warning";
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}

const styles = {
  info: "border-brand-500/25 bg-brand-50 text-brand-700",
  error: "border-red-300 bg-red-50 text-red-800",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
};

const icons = {
  info: Info,
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
};

export default function StatusAlert({
  message,
  severity,
  onDismiss,
  action,
}: StatusAlertProps) {
  if (!message) return null;
  const Icon = icons[severity];

  return (
    <div
      role={severity === "error" ? "alert" : "status"}
      aria-live={severity === "error" ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles[severity]}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 leading-6">{message}</p>
      {action && (
        <button type="button" onClick={action.onClick} className="shrink-0 font-bold underline underline-offset-2 hover:opacity-75">
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss message" className="-mr-1 shrink-0 rounded p-1 hover:bg-black/5">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
