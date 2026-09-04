import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SAMPLE_TEXT = `CANDIDATE PROFILE

Name: John Smith
Email: john.smith@example.com
Phone: (415) 555-0182
Address: 221 Baker Street
Date of Birth: 03/14/1990
Passport: AB1234567
National ID: 123-45-6789
Bank Account: GB29NWBK60161331926819
Card on file: 4111 1111 1111 1111
`;

const NO_PII_TEXT = "Just some plain notes with nothing sensitive in them at all.";

function writeTempFile(name: string, content: string | Buffer): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "docs-cloak-e2e-"));
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, content);
  return filePath;
}

export function sampleDocumentPath(): string {
  return writeTempFile("candidate.txt", SAMPLE_TEXT);
}

export function noPiiDocumentPath(): string {
  return writeTempFile("notes.txt", NO_PII_TEXT);
}

export function emptyFilePath(): string {
  return writeTempFile("empty.txt", "");
}

export function unsupportedFilePath(): string {
  return writeTempFile("script.exe", Buffer.from([0x4d, 0x5a, 0x00, 0x01]));
}

/** One byte over the suite's NEXT_PUBLIC_MAX_UPLOAD_BYTES (see playwright.config.ts). */
export function oversizedFilePath(maxBytes = 2000): string {
  return writeTempFile("huge.txt", "x".repeat(maxBytes + 1));
}
