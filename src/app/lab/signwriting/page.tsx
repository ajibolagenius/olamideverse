import type { Metadata } from "next";
import Link from "next/link";
import SignwritingProof from "@/components/lab/SignwritingProof";

export const metadata: Metadata = {
  title: "Lagos Signwriting & Editorial Red-Penning · Lab · OlamideVerse",
  description:
    "Prototype 05 exploring hand-painted Lagos street signboards, editor manuscript red-penning, and wax stamp seals.",
};

export default function SignwritingLabPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b-2 border-ink pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft">
          <span className="bg-danfo px-2 py-0.5 font-bold text-ink border border-ink">
            PROTOTYPE 05
          </span>
          <span>STREET TYPOGRAPHY & PROOF EDITING</span>
        </div>
        <h1 className="mt-3 font-display text-display-lg uppercase tracking-tight leading-none text-ink">
          Lagos Signwriting & Editorial Proof
        </h1>
        <p className="mt-2 max-w-2xl text-base text-ink-soft">
          Exploring hand-painted Lagos commercial signage (Danfo signboards, Bariga street banners)
          alongside authentic editor manuscript proof-reading flourishes like red-pen circled years,
          marginalia callouts, and archival rubber stamps.
        </p>
      </div>

      <SignwritingProof />

      {/* Footer Nav */}
      <div className="mt-16 border-t-2 border-ink pt-6 flex items-center justify-between">
        <Link
          href="/lab"
          className="border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm hover:shadow-paste transition-all"
        >
          ← Back to Lab Index
        </Link>
        <span className="font-mono text-xs uppercase text-ink-muted">
          Prototype 05: Signwriting & Proof
        </span>
      </div>
    </div>
  );
}
