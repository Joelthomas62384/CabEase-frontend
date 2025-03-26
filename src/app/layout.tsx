import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/Redux/provider";
import ReactQueryProvider from "@/ReactQuery/provider";
import LoginCheck from "../Providers/login-check";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import LocationProvider from "@/Providers/location-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CabEase",
  description: "CabEase is a cab booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#2c3e5023]`}
      >
        <ReduxProvider>


        <ReactQueryProvider>
        <Navbar />
        <LoginCheck>

        <LocationProvider>

        {children}
        </LocationProvider>
        <Toaster />
        </LoginCheck>
        </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
