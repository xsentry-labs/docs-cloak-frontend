// Category ids match the docs-cloak backend's PiiCategory enum exactly
// (see xsentry-labs/docs-cloak app/types.py) so they can be sent to the API as-is.
export type PiiCategory =
  | "NAME"
  | "EMAIL"
  | "PHONE"
  | "ADDRESS"
  | "DATE_OF_BIRTH"
  | "PASSPORT_NUMBER"
  | "NATIONAL_ID"
  | "BANK_ACCOUNT"
  | "CARD_NUMBER"
  | "IP_ADDRESS"
  | "API_KEY"
  | "CUSTOM";

export interface CategoryDefinition {
  id: PiiCategory;
  label: string;
  description: string;
  defaultOn: boolean;
}

export const PII_CATEGORIES: CategoryDefinition[] = [
  { id: "NAME", label: "Names", description: "Full names of people", defaultOn: true },
  { id: "EMAIL", label: "Email addresses", description: "Email addresses", defaultOn: true },
  { id: "PHONE", label: "Phone numbers", description: "Landline & mobile numbers", defaultOn: true },
  { id: "ADDRESS", label: "Physical addresses", description: "Street addresses", defaultOn: true },
  { id: "DATE_OF_BIRTH", label: "Dates of birth", description: "Birth dates", defaultOn: true },
  { id: "PASSPORT_NUMBER", label: "Passport numbers", description: "Passport identifiers", defaultOn: true },
  { id: "NATIONAL_ID", label: "National ID numbers", description: "SSN, national ID, etc.", defaultOn: true },
  { id: "BANK_ACCOUNT", label: "Bank account numbers", description: "IBAN / account numbers", defaultOn: true },
  { id: "CARD_NUMBER", label: "Credit / debit card numbers", description: "Payment card numbers", defaultOn: true },
  { id: "IP_ADDRESS", label: "IP addresses", description: "IPv4 / IPv6 addresses", defaultOn: false },
  { id: "API_KEY", label: "API keys / secrets", description: "Tokens, secrets, credentials", defaultOn: false },
];

export interface DetectedEntity {
  id: string;
  category: PiiCategory;
  value: string;
  start: number;
  end: number;
  confidence: number;
  /** How the backend found this entity, e.g. "rule:email" or "ner:name". Absent for manual additions. */
  source?: string;
  accepted: boolean;
  manual?: boolean;
}

/**
 * Renders a block-redacted preview of `text` given a set of entities with offsets into
 * that exact string. Only meaningful when the caller has the underlying plain text
 * (currently: TXT/CSV uploads read client-side) — the backend does not return extracted
 * text for PDF/DOCX/image inputs, so this preview is skipped for those file types.
 */
export function redactedPreview(text: string, entities: DetectedEntity[]): string {
  const accepted = entities.filter((e) => e.accepted && !e.manual).sort((a, b) => a.start - b.start);
  let result = "";
  let cursor = 0;
  for (const entity of accepted) {
    result += text.slice(cursor, entity.start);
    result += "█".repeat(Math.max(entity.value.length, 3));
    cursor = entity.end;
  }
  result += text.slice(cursor);

  for (const entity of entities.filter((e) => e.accepted && e.manual)) {
    result = result.split(entity.value).join("█".repeat(Math.max(entity.value.length, 3)));
  }

  return result;
}

export const CATEGORY_LABEL: Record<PiiCategory, string> = Object.fromEntries(
  PII_CATEGORIES.map((c) => [c.id, c.label])
) as Record<PiiCategory, string>;

export const SAMPLE_DOCUMENT = `CANDIDATE PROFILE

Name: John Smith
Email: john.smith@example.com
Phone: (415) 555-0182
Address: 221 Baker Street
Date of Birth: 03/14/1990
Passport: AB1234567
National ID: 123-45-6789
Bank Account: GB29NWBK60161331926819
Card on file: 4111 1111 1111 1111
Last login IP: 192.168.1.42
Internal API key: sk-live-9f8e7d6c5b4a3210

Notes:
Jane Doe referred this candidate on 05/22/1988 and can be reached at jane.doe@corp.com
or +1 650-555-0199. Emergency contact address: 500 Market Street.
`;
