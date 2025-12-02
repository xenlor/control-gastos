'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export type AvailableDate = {
    month: number
    year: number
    label: string
}

export async function getAvailableMonths(): Promise<AvailableDate[]> {
    try {
        const user = await getCurrentUser()
        // Fetch all dates from expenses, incomes, savings, and investments
        const [gastos, ingresos, ahorros, inversiones] = await Promise.all([
            prisma.gasto.findMany({
                where: { userId: user.id },
                select: { fecha: true },
                orderBy: { fecha: 'desc' }
            }),
            prisma.ingreso.findMany({
                where: { userId: user.id },
                select: { fecha: true },
                orderBy: { fecha: 'desc' }
            }),
            prisma.ahorro.findMany({
                where: { userId: user.id },
                select: { fecha: true },
                orderBy: { fecha: 'desc' }
            }),
            prisma.inversion.findMany({
                where: { userId: user.id },
                select: { fecha: true },
                orderBy: { fecha: 'desc' }
            })
        ])

        // Combine all dates
        const allDates = [
            ...gastos.map(g => g.fecha),
            ...ingresos.map(i => i.fecha),
            ...ahorros.map(a => a.fecha),
            ...inversiones.map(inv => inv.fecha),
            new Date() // Always include current date
        ]

        // Create a Set of unique "Year-Month" strings to filter duplicates
        const uniqueMonths = new Set<string>()
        const availableDates: AvailableDate[] = []

        allDates.forEach(date => {
            const d = new Date(date)
            const key = `${d.getFullYear()}-${d.getMonth()}`

            if (!uniqueMonths.has(key)) {
                uniqueMonths.add(key)
                availableDates.push({
                    month: d.getMonth(),
                    year: d.getFullYear(),
                    label: key // Temporary label, not used for display
                })
            }
        })

        // Sort descending (newest first)
        return availableDates.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year
            return b.month - a.month
        })

    } catch (error) {
        console.error('Error fetching available months:', error)
        // Return at least current month on error
        const now = new Date()
        return [{
            month: now.getMonth(),
            year: now.getFullYear(),
            label: 'Current'
        }]
    }
}
