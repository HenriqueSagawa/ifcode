import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";

// Define a fonte Geist Sans como uma fonte local.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Define a fonte Geist Mono como uma fonte local.
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define os metadados da aplicação.
export const metadata: Metadata = {
  title: "IF Code",
  description: "",
};

/**
 * Componente que define o layout raiz da aplicação.
 * @param {Readonly<{ children: React.ReactNode; }>} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo a ser renderizado dentro do layout.
 * @returns {JSX.Element} O layout da aplicação.
 */
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
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
