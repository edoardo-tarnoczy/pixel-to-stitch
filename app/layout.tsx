import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel to Stitch - Crochet Pattern Generator",
  description: "Convert any image into a crochet pixel grid pattern",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
