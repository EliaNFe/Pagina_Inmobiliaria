import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inmobiliaria Liliana Cirigliano",
  description: "Tu próximo hogar está acá. Terrenos, casas y departamentos en Necochea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${lora.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pb-24 md:pb-0" style={{ fontFamily: "var(--font-body)" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
