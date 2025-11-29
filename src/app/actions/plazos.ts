'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPlazos() {
    try {
        const plazos = await prisma.plazo.findMany({
            orderBy: {
                fechaInicio: 'desc',
            },
        })
        return plazos
    } catch (error) {
        console.error('Error fetching plazos:', error)
        return []
    }
}

export async function addPlazo(formData: FormData) {
    try {
        const descripcion = formData.get('descripcion') as string
        const montoTotal = parseFloat(formData.get('montoTotal') as string)
        const totalCuotas = parseInt(formData.get('totalCuotas') as string)
        const fechaInicio = new Date(formData.get('fechaInicio') as string)

        if (!descripcion || !montoTotal || !totalCuotas || !fechaInicio) {
            return { success: false, error: 'Todos los campos son requeridos' }
        }

        const montoCuota = montoTotal / totalCuotas

        await prisma.plazo.create({
            data: {
                descripcion,
                montoTotal,
                totalCuotas,
                montoCuota,
                fechaInicio,
                cuotasPagadas: 0,
            },
        })

        revalidatePath('/plazos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error adding plazo:', error)
        return { success: false, error: 'Error al crear el plazo' }
    }
}

export async function payCuota(id: number) {
    try {
        const plazo = await prisma.plazo.findUnique({ where: { id } })

        if (!plazo) return { success: false, error: 'Plazo no encontrado' }
        if (plazo.cuotasPagadas >= plazo.totalCuotas) return { success: false, error: 'Plazo ya pagado' }

        await prisma.plazo.update({
            where: { id },
            data: {
                cuotasPagadas: { increment: 1 },
            },
        })

        revalidatePath('/plazos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error paying cuota:', error)
        return { success: false, error: 'Error al pagar cuota' }
    }
}

export async function deletePlazo(id: number) {
    try {
        await prisma.plazo.delete({
            where: { id },
        })

        revalidatePath('/plazos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting plazo:', error)
        return { success: false, error: 'Error al eliminar el plazo' }
    }
}
