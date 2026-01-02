import type { Metadata } from "next";
import { Poppins, Inter, Space_Mono, Lora } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ReadinessAI",
  description: "Prepare for the future of work with AI-powered career readiness assessments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${spaceMono.variable} ${lora.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
