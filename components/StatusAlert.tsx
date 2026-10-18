"use client";

interface StatusAlertProps {
  message: string;
  severity: "info" | "error" | "success" | "warning";
}

const styles = {
  info: "border-brand-500/25 bg-brand-50 text-brand-700",
  error: "border-red-300 bg-red-50 text-red-800",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
};

export default function StatusAlert({ message, severity }: StatusAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${styles[severity]}`}
    >
      {message}
    </div>
  );
}
