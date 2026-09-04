import type { Metadata } from "next";
import RedactorApp from "@/components/app/RedactorApp";

export const metadata: Metadata = {
  title: "Redact a document — PII Redactor",
  description: "Upload, review and export a redacted version of your document.",
};

export default function AppPage() {
  return <RedactorApp />;
}
