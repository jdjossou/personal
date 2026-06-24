import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Nunito } from "next/font/google";
import "./globals.css";
import { P3RBackground } from "@/components/P3RBackground/P3RBackground";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

// Rounded sans for the Experience job-description bullets (softer letterforms).
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juniel Djossou",
  description: "Juniel Djossou — portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <P3RBackground />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
