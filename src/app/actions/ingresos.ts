'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getIngresos(month?: number, year?: number) {
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

        const ingresos = await prisma.ingreso.findMany({
            where,
            orderBy: { fecha: 'desc' },
        })
        return ingresos
    } catch (error) {
        console.error('Error fetching ingresos:', error)
        return []
    }
}

export async function addIngreso(formData: FormData) {
    try {
        const monto = parseFloat(formData.get('monto') as string)
        const descripcion = formData.get('descripcion') as string
        const fecha = formData.get('fecha') as string

        if (!monto || !descripcion) {
            throw new Error('Monto y descripción son requeridos')
        }

        await prisma.ingreso.create({
            data: {
                monto,
                descripcion,
                fecha: fecha ? new Date(fecha) : new Date(),
            },
        })

        revalidatePath('/ingresos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error adding ingreso:', error)
        return { success: false, error: 'Error al agregar ingreso' }
    }
}

export async function deleteIngreso(id: number) {
    try {
        await prisma.ingreso.delete({
            where: { id },
        })

        revalidatePath('/ingresos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting ingreso:', error)
        return { success: false, error: 'Error al eliminar ingreso' }
    }
}

export async function getTotalIngresos() {
    try {
        const currentMonth = new Date()
        currentMonth.setDate(1)
        currentMonth.setHours(0, 0, 0, 0)

        const ingresos = await prisma.ingreso.findMany({
            where: {
                fecha: {
                    gte: currentMonth,
                },
            },
        })

        const total = ingresos.reduce((sum, ing) => sum + ing.monto, 0)
        return total
    } catch (error) {
        console.error('Error calculating total ingresos:', error)
        return 0
    }
}
