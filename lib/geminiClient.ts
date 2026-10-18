import type { GeminiResponse, SkillComparisonResult } from "@/types";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

/**
 * Low-level call to the Gemini API. Runs entirely client-side using the
 * user's own API key — nothing passes through any server of ours.
 */
export async function callGemini(
  prompt: string,
  apiKey: string,
  maxOutputTokens = 1500,
): Promise<GeminiResponse> {
  if (!apiKey) {
    throw new Error(
      "No API key entered. Paste your free Google Gemini API key in the setup panel and save it.",
    );
  }

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens },
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || "The Gemini API returned an error.");
  }

  const candidate = (data.candidates || [])[0];
  const text: string = candidate
    ? (candidate.content?.parts || [])
        .map((p: { text?: string }) => p.text || "")
        .join("\n")
    : "";
  const truncated = candidate?.finishReason === "MAX_TOKENS";

  return { text, truncated };
}

function stripFences(text: string, lang: string): string {
  const fence = new RegExp(`^\`\`\`${lang}\\n?|^\`\`\`\\n?|\`\`\`$`, "g");
  return text.replace(fence, "").trim();
}

export async function compareSkills(
  resume: string,
  jobDescription: string,
  apiKey: string,
): Promise<SkillComparisonResult> {
  const prompt = `Compare this resume against the job description. Respond ONLY as JSON, no markdown fences, in this exact shape: {"matched":["skill1","skill2"],"missing":["skill3","skill4"]}. "matched" = relevant skills from the job description already present in the resume. "missing" = skills the job description wants that are not present in the resume.

RESUME (LaTeX):
${resume}

JOB DESCRIPTION:
${jobDescription}`;

  const { text } = await callGemini(prompt, apiKey, 1024);
  const cleaned = stripFences(text, "json");

  try {
    const parsed = JSON.parse(cleaned);
    return {
      matched: Array.isArray(parsed.matched) ? parsed.matched : [],
      missing: Array.isArray(parsed.missing) ? parsed.missing : [],
    };
  } catch {
    throw new Error("Couldn't parse the skills comparison. Try again.");
  }
}

export async function tailorResume(
  resume: string,
  jobDescription: string,
  selectedSkills: string[],
  apiKey: string,
): Promise<{ latex: string; truncated: boolean }> {
  const skillsList = selectedSkills.length
    ? selectedSkills.join(", ")
    : "(none selected — use your judgment based on the job description)";

  const prompt = `You are editing an EXISTING LaTeX resume. This is a structure-preservation task, not a rewrite-from-scratch task.

STRICT RULES:
1. Copy the \\documentclass line, ALL \\usepackage lines, ALL custom \\newcommand/\\renewcommand definitions, and the \\begin{document}...\\end{document} wrapper EXACTLY as given, character for character. Do not add, remove, or rename any package, command, or custom macro.
2. Keep every section heading, every \\begin{...}/\\end{...} environment, and the overall order of sections EXACTLY as in the original.
3. Within each entry (job, project, education line), you may rewrite bullet text to be stronger and more impactful, and tailor it to the job description below. Do not invent employers, dates, titles, or degrees that are not in the original.
4. Wrap matched/relevant keywords in \\textbf{...} using whatever bold command the original resume already uses for emphasis (match its existing style/macro if it has one).
5. Weave in these skills naturally where truthful and relevant: ${skillsList}.
6. Output the COMPLETE document from \\documentclass to \\end{document}. Never truncate, never summarize with "...", never omit a section.
7. Respond with ONLY raw LaTeX source. No markdown code fences, no explanation before or after.

ORIGINAL RESUME (LaTeX):
${resume}

JOB DESCRIPTION:
${jobDescription}`;

  const { text, truncated } = await callGemini(prompt, apiKey, 8000);
  const latex = stripFences(text, "latex");
  return { latex, truncated };
}
