'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGastos(month?: number, year?: number, categoryIds?: number[]) {
    const where: any = {}

    if (month !== undefined && year !== undefined) {
        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0, 23, 59, 59)

        where.fecha = {
            gte: startDate,
            lte: endDate
        }
    }

    if (categoryIds && categoryIds.length > 0) {
        where.categoriaId = {
            in: categoryIds
        }
    }

    return await prisma.gasto.findMany({
        where,
        orderBy: {
            fecha: 'desc',
        },
        include: {
            categoria: true,
        },
    })
}

export async function getCategorias() {
    return await prisma.categoria.findMany({
        orderBy: {
            nombre: 'asc',
        },
    })
}

export async function addGasto(formData: FormData) {
    const monto = parseFloat(formData.get('monto') as string)
    const descripcion = formData.get('descripcion') as string
    const categoriaId = parseInt(formData.get('categoriaId') as string)
    const fecha = new Date(formData.get('fecha') as string)

    if (!monto || !descripcion || !categoriaId || !fecha) {
        return { success: false, error: 'Faltan campos requeridos' }
    }

    try {
        await prisma.gasto.create({
            data: {
                monto,
                descripcion,
                categoriaId,
                fecha,
            },
        })
        revalidatePath('/gastos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error creating gasto:', error)
        return { success: false, error: 'Error al crear el gasto' }
    }
}

export async function deleteGasto(id: number) {
    try {
        // Check if this gasto is linked to a shared expense
        const gasto = await prisma.gasto.findUnique({
            where: { id },
            select: { gastoCompartidoId: true }
        })

        if (gasto?.gastoCompartidoId) {
            // If linked, delete the shared expense (which will cascade delete this gasto)
            await prisma.gastoCompartido.delete({
                where: { id: gasto.gastoCompartidoId }
            })
        } else {
            // If not linked, just delete the gasto
            await prisma.gasto.delete({
                where: { id },
            })
        }

        revalidatePath('/gastos')
        revalidatePath('/gastos-compartidos')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting gasto:', error)
        return { success: false, error: 'Error al eliminar el gasto' }
    }
}

export async function addCategoria(formData: FormData) {
    const nombre = formData.get('nombre') as string
    const color = formData.get('color') as string || '#6366f1'

    if (!nombre) {
        return { success: false, error: 'El nombre es requerido' }
    }

    try {
        await prisma.categoria.create({
            data: {
                nombre,
                color,
                icono: 'Tag'
            },
        })
        revalidatePath('/gastos')
        return { success: true }
    } catch (error) {
        console.error('Error creating categoria:', error)
        return { success: false, error: 'Error al crear la categoría' }
    }
}
