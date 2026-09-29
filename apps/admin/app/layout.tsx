import type { Metadata } from "next";

import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "Show Case Back Office",
  description: "Back office sign in",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
