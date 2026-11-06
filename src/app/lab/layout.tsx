import type { Metadata } from "next";
import Link from "next/link";
import DisclaimerStrip from "@/components/chrome/DisclaimerStrip";
import { getDisclaimer } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Lab Experiments · OlamideVerse",
  description: "Presentational experiment space for OlamideVerse visual concepts and prototypes.",
};

export default async function LabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const disclaimer = await getDisclaimer();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <DisclaimerStrip text={disclaimer.text} highlight={disclaimer.highlight} />
      <header className="border-b-2 border-ink bg-paper px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/lab"
              className="font-display text-lg uppercase tracking-wide transition-colors hover:text-oxide sm:text-xl"
            >
              OlamideVerse <span className="text-danfo">{"//"}</span> Lab
            </Link>
            <span className="border border-ink bg-danfo px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-ink">
              Experimental
            </span>
          </div>
          <Link
            href="/"
            className="group flex items-center gap-1.5 border border-ink bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-paste-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>←</span>
            <span>Return to Archive</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-ink bg-ink px-4 py-6 text-center text-xs tracking-wider uppercase text-ink-muted sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p>
            OlamideVerse Presentation Lab · Isolated Prototype Space · Pure Client/Server
            Presentation
          </p>
        </div>
      </footer>
    </div>
  );
}
