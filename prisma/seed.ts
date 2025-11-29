import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Crear configuración inicial
    const config = await prisma.configuracion.upsert({
        where: { id: 1 },
        update: {},
        create: {
            porcentajeAhorro: 10.0, // 10% de ahorro por defecto
        },
    })
    console.log('✓ Configuración creada:', config)

    // Crear categorías por defecto
    const categorias = [
        { nombre: 'Suscripciones', color: '#8b5cf6', icono: 'CreditCard' },
        { nombre: 'Compras Online', color: '#ec4899', icono: 'ShoppingCart' },
        { nombre: 'Gastos de la Casa', color: '#10b981', icono: 'Home' },
        { nombre: 'Comida Rápida', color: '#f59e0b', icono: 'UtensilsCrossed' },
        { nombre: 'Transporte', color: '#3b82f6', icono: 'Car' },
        { nombre: 'Entretenimiento', color: '#f43f5e', icono: 'Gamepad2' },
        { nombre: 'Salud', color: '#06b6d4', icono: 'Heart' },
        { nombre: 'Educación', color: '#6366f1', icono: 'BookOpen' },
        { nombre: 'Otros', color: '#64748b', icono: 'MoreHorizontal' },
    ]

    for (const cat of categorias) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: {},
            create: cat,
        })
    }
    console.log(`✓ ${categorias.length} categorías creadas`)

    console.log('Seed completado exitosamente!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Error durante seed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
