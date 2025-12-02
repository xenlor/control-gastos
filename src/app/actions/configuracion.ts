'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getConfiguracion() {
    const user = await getCurrentUser()

    let config = await prisma.configuracion.findUnique({
        where: { userId: user.id }
    })

    if (!config) {
        // Create default config if it doesn't exist
        config = await prisma.configuracion.create({
            data: {
                userId: user.id,
                porcentajeAhorro: 20.0
            }
        })
    }

    return config
}

export async function updateConfiguracion(formData: FormData) {
    const user = await getCurrentUser()
    const porcentajeAhorro = parseFloat(formData.get('porcentajeAhorro') as string)

    if (isNaN(porcentajeAhorro) || porcentajeAhorro < 0 || porcentajeAhorro > 100) {
        return { success: false, error: 'Porcentaje inválido' }
    }

    try {
        await prisma.configuracion.upsert({
            where: { userId: user.id },
            update: { porcentajeAhorro },
            create: {
                userId: user.id,
                porcentajeAhorro
            }
        })

        revalidatePath('/')
        revalidatePath('/ahorros')
        return { success: true }
    } catch (error) {
        console.error('Error updating configuracion:', error)
        return { success: false, error: 'Error al actualizar configuración' }
    }
}
