import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "./UserContext";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Athlas",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <Header />
            {children}
            <SpeedInsights />
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
