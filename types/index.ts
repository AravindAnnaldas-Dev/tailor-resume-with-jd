export interface SkillComparisonResult {
  matched: string[];
  missing: string[];
}

export interface TailorResult {
  latex: string;
  truncated: boolean;
  complete: boolean;
}

export type AppStage =
  | "input"
  | "comparing"
  | "compared"
  | "tailoring"
  | "done";

export interface GeminiResponse {
  text: string;
  truncated: boolean;
}
