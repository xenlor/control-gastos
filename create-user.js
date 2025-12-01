const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10)
    try {
        const user = await prisma.user.upsert({
            where: { email: 'admin@admin.com' },
            update: {},
            create: {
                email: 'admin@admin.com',
                name: 'Admin',
                password: hashedPassword,
            },
        })
        console.log('User created:', user)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
