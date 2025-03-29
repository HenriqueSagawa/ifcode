"use client"

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@heroui/toast";


export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <SessionProvider>
                    <ToastProvider />
                    {children}
            </SessionProvider>
        </ThemeProvider>
    )
}