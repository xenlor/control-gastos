const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const args = process.argv.slice(2)

    if (args.length < 3) {
        console.log('Uso: node scripts/crear-usuario.js <usuario> <password> <nombre> [role]')
        return
    }

    const [username, password, name, role = 'user'] = args

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role
            }
        })

        console.log(`✅ Usuario creado: ${user.username} (${user.role})`)
    } catch (error) {
        if (error.code === 'P2002') {
            console.error('❌ El usuario ya existe')
        } else {
            console.error('❌ Error:', error)
        }
    } finally {
        await prisma.$disconnect()
    }
}

main()
