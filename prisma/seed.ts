import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding default categories...')

    // 1. Find the Admin user (we created it in migration)
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@admin.com' }
    })

    if (!admin) {
        console.error('❌ Admin user not found. Please run migration first.')
        return
    }

    const categories = [
        { nombre: 'Alimentación', color: '#ef4444', icono: 'Utensils' },
        { nombre: 'Transporte', color: '#f97316', icono: 'Car' },
        { nombre: 'Vivienda', color: '#eab308', icono: 'Home' },
        { nombre: 'Servicios', color: '#84cc16', icono: 'Zap' },
        { nombre: 'Ocio', color: '#06b6d4', icono: 'Gamepad2' },
        { nombre: 'Salud', color: '#3b82f6', icono: 'Heart' },
        { nombre: 'Ropa', color: '#8b5cf6', icono: 'Shirt' },
        { nombre: 'Educación', color: '#d946ef', icono: 'GraduationCap' },
        { nombre: 'Otros', color: '#64748b', icono: 'MoreHorizontal' },
    ]

    for (const cat of categories) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: {},
            create: {
                nombre: cat.nombre,
                color: cat.color,
                icono: cat.icono,
                userId: admin.id
            }
        })
    }

    console.log('✅ Default categories seeded successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
