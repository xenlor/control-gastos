const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const args = process.argv.slice(2)

    if (args.length < 1) {
        console.log('Uso: node scripts/eliminar-usuario.js <username>')
        return
    }

    const [username] = args

    try {
        const user = await prisma.user.delete({
            where: { username }
        })
        console.log(`✅ Usuario eliminado: ${user.username}`)
    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
