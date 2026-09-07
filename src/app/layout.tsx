import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkorKita — Penghitung Skor Pertandingan",
  description: "Aplikasi penghitung skor pertandingan modern, cepat, dan responsif dengan pengumuman suara otomatis dalam bahasa Indonesia dan Inggris.",
  keywords: ["penghitung skor", "score tracker", "skorkita", "aplikasi skor", "pertandingan", "futsa, badminton, basket"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body suppressHydrationWarning>{children}</body></html>;
}
