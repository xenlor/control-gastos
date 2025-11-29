'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAhorros(month?: number, year?: number) {
    try {
        const where: any = {}

        if (month !== undefined && year !== undefined) {
            const startDate = new Date(year, month, 1)
            const endDate = new Date(year, month + 1, 0, 23, 59, 59)

            where.fecha = {
                gte: startDate,
                lte: endDate
            }
        }

        const ahorros = await prisma.ahorro.findMany({
            where,
            orderBy: { fecha: 'desc' },
        })
        return ahorros
    } catch (error) {
        console.error('Error fetching ahorros:', error)
        return []
    }
}

export async function addAhorro(formData: FormData) {
    try {
        const descripcion = formData.get('descripcion') as string
        const monto = parseFloat(formData.get('monto') as string)
        const fechaStr = formData.get('fecha') as string
        const fecha = fechaStr ? new Date(fechaStr) : new Date()

        if (!descripcion || isNaN(monto)) {
            return { success: false, error: 'Descripción y monto son requeridos' }
        }

        await prisma.ahorro.create({
            data: {
                descripcion,
                monto,
                fecha,
            },
        })

        revalidatePath('/ahorros')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error adding ahorro:', error)
        return { success: false, error: 'Error al añadir ahorro' }
    }
}

export async function deleteAhorro(id: number) {
    try {
        await prisma.ahorro.delete({
            where: { id },
        })

        revalidatePath('/ahorros')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting ahorro:', error)
        return { success: false, error: 'Error al eliminar ahorro' }
    }
}

export async function getSavingsAnalysis(month: number, year: number) {
    try {
        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0, 23, 59, 59)

        const [ingresos, ahorros] = await Promise.all([
            prisma.ingreso.aggregate({
                where: {
                    fecha: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: { monto: true }
            }),
            prisma.ahorro.aggregate({
                where: {
                    fecha: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: { monto: true }
            })
        ])

        const totalIngresos = ingresos._sum.monto || 0
        const totalAhorrado = ahorros._sum.monto || 0
        const targetAhorro = totalIngresos * 0.20 // 20% target

        return {
            totalIngresos,
            totalAhorrado,
            targetAhorro,
            percentageSaved: totalIngresos > 0 ? (totalAhorrado / totalIngresos) * 100 : 0
        }
    } catch (error) {
        console.error('Error getting savings analysis:', error)
        return {
            totalIngresos: 0,
            totalAhorrado: 0,
            targetAhorro: 0,
            percentageSaved: 0
        }
    }
}
