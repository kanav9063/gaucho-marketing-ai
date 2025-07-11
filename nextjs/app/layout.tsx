import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Gaucho AI Marketing - UCSB's AI-Powered Marketing Platform",
  description:
    "Transform your marketing with AI-powered content generation. Built for Gauchos by Gauchos at UC Santa Barbara.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} font-sans`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
