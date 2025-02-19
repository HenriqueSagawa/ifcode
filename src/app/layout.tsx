import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";


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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* <head>
            <link rel="icon" href={favicon.src} color="#fff" />
          </head> */}
          <Navbar />

          {children}

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
