import DisclaimerStrip from "@/components/chrome/DisclaimerStrip";
import SiteFooter from "@/components/chrome/SiteFooter";
import SiteHeader from "@/components/chrome/SiteHeader";
import { FanProvider } from "@/lib/fanzone/useFan";
import { getDisclaimer, getFeatureFlags, getFooter } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [disclaimer, footer, flags] = await Promise.all([
    getDisclaimer(),
    getFooter(),
    getFeatureFlags(),
  ]);

  if (flags.maintenance) {
    return (
      <main className="flex flex-1 items-center justify-center bg-ink px-6 py-20 text-center text-paper">
        <div>
          <p className="font-display text-4xl uppercase text-danfo">Maintenance</p>
          <p className="mt-4 max-w-md text-ink-muted">
            OlamideVerse is briefly offline for archival updates. Check back soon.
          </p>
        </div>
      </main>
    );
  }

  const needsFanSession = flags.fanzone || flags.comments || flags.polls;
  const shell = (
    <>
      <a href="#main-content" className="ov-skip-link">
        Skip to content
      </a>
      <DisclaimerStrip text={disclaimer.text} highlight={disclaimer.highlight} />
      <SiteHeader showFanZone={flags.fanzone} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter blurb={footer.blurb} showFanZone={flags.fanzone} />
    </>
  );

  return needsFanSession ? <FanProvider>{shell}</FanProvider> : shell;
}
