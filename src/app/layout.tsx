import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What Does Your Name Sound Like?",
  description: "Type any name and hear its unique melody. Every name has a sound — discover yours.",
  openGraph: {
    title: "What Does Your Name Sound Like?",
    description: "Type any name and hear its unique melody. Every name has a sound — discover yours.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Does Your Name Sound Like?",
    description: "Type any name and hear its unique melody. Every name has a sound — discover yours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
