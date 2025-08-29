import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer";
import favicon from "../../public/img/logo ifcode.webp";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "IF Code - Comunidade de Programação e Desenvolvimento",
  description: "IF Code é uma comunidade dedicada ao aprendizado e compartilhamento de conhecimento em programação, desenvolvimento web, mobile e tecnologia. Junte-se a nós!",
  keywords: [
    "programação",
    "desenvolvimento",
    "tecnologia",
    "comunidade",
    "aprendizado",
    "código",
    "software",
    "web development",
    "mobile development",
    "IF Code"
  ],
  authors: [{ name: "IF Code Team" }],
  creator: "IF Code",
  publisher: "IF Code",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ifcode.com.br",
    title: "IF Code - Comunidade de Programação e Desenvolvimento",
    description: "IF Code é uma comunidade dedicada ao aprendizado e compartilhamento de conhecimento em programação, desenvolvimento web, mobile e tecnologia.",
    siteName: "IF Code",
    images: [
      {
        url: "/img/ifcodebanner.webp",
        width: 1200,
        height: 630,
        alt: "IF Code - Comunidade de Programação",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IF Code - Comunidade de Programação e Desenvolvimento",
    description: "IF Code é uma comunidade dedicada ao aprendizado e compartilhamento de conhecimento em programação, desenvolvimento web, mobile e tecnologia.",
    images: ["/img/ifcodebanner.webp"],
    creator: "@ifcode",
    site: "@ifcode",
  },
  alternates: {
    canonical: "https://ifcode.com.br",
  },
  category: "technology",
  classification: "programming community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href={favicon.src} color="#fff" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IF Code" />
        <link rel="apple-touch-icon" href="/img/logo ifcode.webp" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col py-4 mx-auto overflow-x-hidden`}>


        <Providers>

          <div className="grow">
            {children}
          </div>

          <Footer />
        </Providers>

      </body>
    </html>
  );
}
