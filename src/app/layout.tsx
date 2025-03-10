import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import favicon from "../../public/img/logo ifcode.png";
import { Providers } from "./provider";
import { useEffect } from "react";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IF Code",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={favicon.src} color="#fff" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col py-4 mx-auto overflow-x-hidden`}>



        <Providers>


          <Navbar />


          <div className="grow">
            {children}
          </div>

          <Footer />
        </Providers>

      </body>
    </html>
  );
}
