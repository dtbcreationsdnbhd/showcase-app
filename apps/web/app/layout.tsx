import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import SiteCursor from "@/components/landing/SiteCursor";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-barlow-semi-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crafting Vision, Empowering Creation",
  description:
    "Empower your business with next-gen AI-powered tools, video creation, and design assets. From creative content to automated workflows, we craft your vision for commercial success.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
    >
      <body className={`${plusJakarta.className} min-h-full flex flex-col`}>
        <ThemeRegistry>{children}</ThemeRegistry>
        <SiteCursor />
      </body>
    </html>
  );
}
