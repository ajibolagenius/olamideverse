import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "OlamideVerse | Celebrating Olamide's Musical Legacy",
    description: "An immersive platform showcasing Olamide's complete discography with interactive experiences, stories, and media.",
    keywords: ["Olamide", "Nigerian music", "YBNL", "hip-hop", "afrobeats"],
    authors: [{ name: "OlamideVerse Team" }],
    openGraph: {
        title: "OlamideVerse | Celebrating Olamide's Musical Legacy",
        description: "An immersive platform showcasing Olamide's complete discography with interactive experiences, stories, and media.",
        url: "https://olamideverse.com",
        siteName: "OlamideVerse",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "OlamideVerse | Celebrating Olamide's Musical Legacy",
        description: "An immersive platform showcasing Olamide's complete discography with interactive experiences, stories, and media.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
            >
                {children}
            </body>
        </html>
    );
}
