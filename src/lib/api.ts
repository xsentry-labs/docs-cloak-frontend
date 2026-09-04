import { DetectedEntity, PiiCategory } from "@/lib/pii";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface RedactApiEntity {
  id: string;
  category: string;
  value: string;
  start: number;
  end: number;
  confidence: number;
  source: string;
  accepted: boolean;
}

interface RedactApiResponse {
  status: "completed" | "failed";
  entities_found: number;
  entities_redacted: number;
  entities: RedactApiEntity[];
  document_url: string;
  original_document_url: string | null;
  expires_at: string;
  processing_ms: number;
  error?: string;
}

export interface RedactResult {
  entities: DetectedEntity[];
  documentUrl: string;
  originalDocumentUrl: string | null;
  expiresAt: string;
}

export interface RedactOptions {
  categories: PiiCategory[];
  /** IDs (from a previous redact call) to exclude from redaction — i.e. entities the user rejected. */
  excludeEntityIds?: string[];
  /** Exact text spans the user added manually that aren't in the detected entity list. */
  manualRedactionTexts?: string[];
  style?: "block" | "label";
  /** When set, also returns a password-protected/encrypted copy of the original file. */
  originalPassword?: string;
}

export async function redactDocument(file: File, options: RedactOptions): Promise<RedactResult> {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("categories", JSON.stringify(options.categories));

  if (options.excludeEntityIds?.length || options.manualRedactionTexts?.length || options.style) {
    formData.append(
      "redactionConfig",
      JSON.stringify({
        style: options.style ?? "block",
        excludeEntityIds: options.excludeEntityIds ?? [],
        manualRedactions: (options.manualRedactionTexts ?? []).map((text) => ({ text })),
      })
    );
  }

  if (options.originalPassword) {
    formData.append("originalPassword", options.originalPassword);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/v1/redact`, { method: "POST", body: formData });
  } catch {
    throw new Error(
      `Could not reach the redaction API at ${API_BASE_URL}. Is it running and reachable?`
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? body?.detail ?? `Redaction request failed (${res.status})`);
  }

  const data: RedactApiResponse = await res.json();
  if (data.status === "failed") {
    throw new Error(data.error ?? "Redaction failed.");
  }

  return {
    entities: data.entities.map((e) => ({
      id: e.id,
      category: e.category as PiiCategory,
      value: e.value,
      start: e.start,
      end: e.end,
      confidence: e.confidence,
      source: e.source,
      accepted: e.accepted,
    })),
    documentUrl: data.document_url,
    originalDocumentUrl: data.original_document_url,
    expiresAt: data.expires_at,
  };
}
