import Script from "next/script";
import { normalizeAnalyticsId } from "@/lib/security/analytics-id";

/**
 * Injects GA4 / GTM when a validated measurement ID is configured in CMS or env.
 * Supports G-… (GA4) and GTM-… container IDs only — rejects free-form values
 * so a compromised CMS field can't break out of the inline script.
 */
export default function Analytics({ id }: { id: string }) {
  const analyticsId = normalizeAnalyticsId(id);
  if (!analyticsId) return null;

  if (analyticsId.startsWith("GTM-")) {
    return (
      <>
        <Script id="ov-gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${analyticsId}');
        `}</Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${analyticsId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      </>
    );
  }

  // GA4 (G-…)
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="ov-ga" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${analyticsId}');
      `}</Script>
    </>
  );
}
