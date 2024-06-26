import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "primereact/resources/themes/lara-light-purple/theme.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Acadêmico 📘",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className.toString()} w-screen bg-zinc-300`}>{children}</body>
    </html>
  );
}
