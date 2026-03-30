import type { ApiResponse, WrappedResponse } from "@/types/wrapped";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function analyzeStatement(
  statementText: string
): Promise<WrappedResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statement_text: statementText }),
  });

  const json: ApiResponse = await res.json();

  if (!res.ok || json.error) {
    throw new Error(json.error ?? `Request failed with status ${res.status}`);
  }

  if (!json.data) {
    throw new Error("Empty response from server");
  }

  return json.data;
}
