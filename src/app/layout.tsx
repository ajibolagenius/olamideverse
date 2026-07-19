import type { Metadata, Viewport } from "next";
import "./globals.css";
import MotionRoot from "@/components/MotionRoot";
import PWARegister from "@/components/PWARegister";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const DEFAULT_TITLE = "OlamideVerse — the living archive of Olamide's legacy";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#181410",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        {children}
        <MotionRoot />
        <PWARegister />
      </body>
    </html>
  );
}
