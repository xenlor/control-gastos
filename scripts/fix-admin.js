const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2] || 'admin@admin.com'
    console.log(`🔍 Checking role for: ${email}`)

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('❌ User not found!')
        return
    }

    console.log(`👤 User found: ${user.name}`)
    console.log(`🔑 Current Role: ${user.role}`)

    if (user.role !== 'ADMIN') {
        console.log('⚠️ Role is NOT Admin. Updating...')
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        })
        console.log('✅ Role updated to ADMIN successfully!')
    } else {
        console.log('✅ User is already ADMIN.')
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
