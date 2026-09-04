export type PiiCategory =
  | "name"
  | "email"
  | "phone"
  | "address"
  | "dob"
  | "passport"
  | "national_id"
  | "bank_account"
  | "card"
  | "ip_address"
  | "api_key";

export interface CategoryDefinition {
  id: PiiCategory;
  label: string;
  description: string;
  defaultOn: boolean;
}

export const PII_CATEGORIES: CategoryDefinition[] = [
  { id: "name", label: "Names", description: "Full names of people", defaultOn: true },
  { id: "email", label: "Email addresses", description: "Email addresses", defaultOn: true },
  { id: "phone", label: "Phone numbers", description: "Landline & mobile numbers", defaultOn: true },
  { id: "address", label: "Physical addresses", description: "Street addresses", defaultOn: true },
  { id: "dob", label: "Dates of birth", description: "Birth dates", defaultOn: true },
  { id: "passport", label: "Passport numbers", description: "Passport identifiers", defaultOn: true },
  { id: "national_id", label: "National ID numbers", description: "SSN, national ID, etc.", defaultOn: true },
  { id: "bank_account", label: "Bank account numbers", description: "IBAN / account numbers", defaultOn: true },
  { id: "card", label: "Credit / debit card numbers", description: "Payment card numbers", defaultOn: true },
  { id: "ip_address", label: "IP addresses", description: "IPv4 / IPv6 addresses", defaultOn: false },
  { id: "api_key", label: "API keys / secrets", description: "Tokens, secrets, credentials", defaultOn: false },
];

export interface DetectedEntity {
  id: string;
  category: PiiCategory;
  value: string;
  start: number;
  end: number;
  confidence: number;
  accepted: boolean;
  manual?: boolean;
}

const CATEGORY_PATTERNS: { category: PiiCategory; regex: RegExp; confidence: number }[] = [
  { category: "email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, confidence: 0.99 },
  {
    category: "card",
    regex: /\b(?:\d[ -]?){13,16}\b/g,
    confidence: 0.9,
  },
  {
    category: "ip_address",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\b/g,
    confidence: 0.95,
  },
  {
    category: "api_key",
    regex: /\b(?:sk|pk|api|key|token)[-_][A-Za-z0-9]{12,}\b/gi,
    confidence: 0.85,
  },
  {
    category: "passport",
    regex: /\b[A-PR-WY][0-9]{7}\b|\bPassport\s*#?:?\s*[A-Z0-9]{6,9}\b/gi,
    confidence: 0.8,
  },
  {
    category: "national_id",
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    confidence: 0.92,
  },
  {
    category: "bank_account",
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b|\bAcc(?:ount)?#?:?\s*\d{8,17}\b/gi,
    confidence: 0.75,
  },
  {
    category: "phone",
    regex: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    confidence: 0.82,
  },
  {
    category: "dob",
    regex: /\b(?:0[1-9]|1[0-2])[/-](?:0[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b/g,
    confidence: 0.7,
  },
  {
    category: "address",
    regex: /\b\d{1,5}\s+[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*){0,3}\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/g,
    confidence: 0.68,
  },
  {
    category: "name",
    regex: /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g,
    confidence: 0.55,
  },
];

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `entity-${idCounter}-${Date.now().toString(36)}`;
}

export function detectEntities(text: string, enabledCategories: Set<PiiCategory>): DetectedEntity[] {
  const found: DetectedEntity[] = [];
  const claimedRanges: [number, number][] = [];

  const overlaps = (start: number, end: number) =>
    claimedRanges.some(([s, e]) => start < e && end > s);

  for (const { category, regex, confidence } of CATEGORY_PATTERNS) {
    if (!enabledCategories.has(category)) continue;
    const re = new RegExp(regex.source, regex.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (overlaps(start, end)) continue;
      claimedRanges.push([start, end]);
      found.push({
        id: nextId(),
        category,
        value: match[0],
        start,
        end,
        confidence,
        accepted: true,
      });
      if (match[0].length === 0) re.lastIndex += 1;
    }
  }

  return found.sort((a, b) => a.start - b.start);
}

export function redactedPreview(text: string, entities: DetectedEntity[]): string {
  const accepted = entities.filter((e) => e.accepted).sort((a, b) => a.start - b.start);
  let result = "";
  let cursor = 0;
  for (const entity of accepted) {
    if (entity.manual) continue;
    result += text.slice(cursor, entity.start);
    result += "█".repeat(Math.max(entity.value.length, 3));
    cursor = entity.end;
  }
  result += text.slice(cursor);

  for (const entity of accepted.filter((e) => e.manual)) {
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
