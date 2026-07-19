import type { Metadata } from "next";
import "./globals.css";
import DisclaimerStrip from "@/components/chrome/DisclaimerStrip";
import SiteFooter from "@/components/chrome/SiteFooter";
import SiteHeader from "@/components/chrome/SiteHeader";
import MotionRoot from "@/components/MotionRoot";
import { FanProvider } from "@/lib/fanzone/useFan";

export const metadata: Metadata = {
  title: {
    default: "OlamideVerse — the living archive of Olamide's legacy",
    template: "%s · OlamideVerse",
  },
  description:
    "A fan-made cultural archive telling the story of how a kid from Bariga built Nigerian street-hop into an empire — era by era, album by album. Not affiliated with Olamide or YBNL Nation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <FanProvider>
          <DisclaimerStrip />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </FanProvider>
        <MotionRoot />
      </body>
    </html>
  );
}
