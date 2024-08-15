import type { ReactNode } from "react";
import { StoreProvider } from "../StoreProvider";
import { Toaster } from "../components/atoms/Toast/toaster";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google"
// These styles apply to every route in the application
import './globals.css';

interface Props {
  readonly children: ReactNode;
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
