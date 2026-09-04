import { DetectedEntity, PiiCategory } from "@/lib/pii";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// How long to keep polling a job before giving up. Large PDFs/OCR jobs run on a
// background worker (see docs-cloak's app/jobs.py) rather than blocking the initial
// request, so the client polls for completion instead of waiting on one long response.
const POLL_INTERVAL_MS = 700;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

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

interface EnqueueResponse {
  status: "queued";
  job_id: string;
  status_url: string;
}

interface JobStatusResponse {
  status: "queued" | "processing" | "completed" | "failed";
  job_id: string;
  entities_found?: number;
  entities_redacted?: number;
  entities?: RedactApiEntity[];
  document_url?: string;
  original_document_url?: string | null;
  expires_at?: string;
  processing_ms?: number;
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
  /** Called whenever the job's status changes while polling (e.g. to update a spinner label). */
  onStatus?: (status: "queued" | "processing") => void;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  let enqueueRes: Response;
  try {
    enqueueRes = await fetch(`${API_BASE_URL}/v1/redact`, { method: "POST", body: formData });
  } catch {
    throw new Error(
      `Could not reach the redaction API at ${API_BASE_URL}. Is it running and reachable?`
    );
  }

  if (!enqueueRes.ok) {
    const body = await enqueueRes.json().catch(() => null);
    throw new Error(
      body?.error ?? body?.detail ?? `Redaction request failed (${enqueueRes.status})`
    );
  }

  const enqueued: EnqueueResponse = await enqueueRes.json();
  const statusUrl = enqueued.status_url ?? `${API_BASE_URL}/v1/redact/${enqueued.job_id}`;

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const statusRes = await fetch(statusUrl);
    const data: JobStatusResponse = await statusRes.json();

    if (data.status === "queued" || data.status === "processing") {
      options.onStatus?.(data.status);
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    if (data.status === "failed") {
      throw new Error(data.error ?? "Redaction failed.");
    }

    return {
      entities: (data.entities ?? []).map((e) => ({
        id: e.id,
        category: e.category as PiiCategory,
        value: e.value,
        start: e.start,
        end: e.end,
        confidence: e.confidence,
        source: e.source,
        accepted: e.accepted,
      })),
      documentUrl: data.document_url!,
      originalDocumentUrl: data.original_document_url ?? null,
      expiresAt: data.expires_at!,
    };
  }

  throw new Error("Redaction is taking longer than expected. Please try again shortly.");
}
