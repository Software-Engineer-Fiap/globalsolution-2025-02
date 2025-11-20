import type React from "react"
import type { Metadata } from "next"

import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

import { AuthProvider } from "@/lib/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Synapse - Collective Intelligence Platform",
    description: "Share problems, find solutions. Turn individual questions into collective knowledge.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`font-sans antialiased`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
