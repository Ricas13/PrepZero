import type { Metadata } from "next";
import "./globals.css";
import "./portal.css";

export const metadata: Metadata = {
  title: "PrepZero — Buy it. Cook it. Divide it. Done.",
  description:
    "Hit your macros with less waste, less cost and less time in the kitchen. PrepZero builds efficient meal plans around real supermarket pack sizes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
