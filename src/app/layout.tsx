import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

// Using Outfit font for a more modern, tech/SaaS look
const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Control de Gastos - Gestión Financiera Personal',
    description: 'Aplicación para gestionar ingresos, gastos, préstamos y finanzas compartidas',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es">
            <body className={outfit.className}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
