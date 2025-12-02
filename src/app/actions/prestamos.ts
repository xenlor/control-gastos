'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

export async function getPrestamos() {
    try {
        const user = await getCurrentUser()
        const prestamos = await prisma.prestamo.findMany({
            where: { userId: user.id },
            orderBy: {
                fechaPrestamo: 'desc',
            },
        })
        return prestamos
    } catch (error) {
        console.error('Error fetching prestamos:', error)
        return []
    }
}

export async function addPrestamo(formData: FormData) {
    try {
        const user = await getCurrentUser()
        const persona = formData.get('persona') as string
        const monto = parseFloat(formData.get('monto') as string)
        const fechaPrestamo = new Date(formData.get('fechaPrestamo') as string)
        const fechaRecordatorio = new Date(formData.get('fechaRecordatorio') as string)

        if (!persona || !monto || !fechaPrestamo || !fechaRecordatorio) {
            return { success: false, error: 'Todos los campos son requeridos' }
        }

        await prisma.prestamo.create({
            data: {
                persona,
                monto,
                fechaPrestamo,
                fechaRecordatorio,
                pagado: false,
                userId: user.id,
            },
        })

        revalidatePath('/prestamos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error adding prestamo:', error)
        return { success: false, error: 'Error al crear el préstamo' }
    }
}

export async function togglePrestamoPagado(id: number, pagado: boolean) {
    try {
        await prisma.prestamo.update({
            where: { id },
            data: { pagado },
        })

        revalidatePath('/prestamos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error toggling prestamo status:', error)
        return { success: false, error: 'Error al actualizar el estado' }
    }
}

export async function deletePrestamo(id: number) {
    try {
        await prisma.prestamo.delete({
            where: { id },
        })

        revalidatePath('/prestamos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting prestamo:', error)
        return { success: false, error: 'Error al eliminar el préstamo' }
    }
}
