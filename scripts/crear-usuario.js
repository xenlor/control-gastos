const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function main() {
    console.log('--- Creador de Usuarios ---')

    try {
        const name = await question('Nombre: ')
        const email = await question('Email: ')
        const password = await question('Contraseña: ')

        if (!name || !email || !password) {
            console.error('Error: Todos los campos son obligatorios.')
            process.exit(1)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        console.log(`\n✅ Usuario creado exitosamente:`)
        console.log(`Nombre: ${user.name}`)
        console.log(`Email: ${user.email}`)
        console.log(`ID: ${user.id}`)

    } catch (e) {
        if (e.code === 'P2002') {
            console.error('\n❌ Error: Ya existe un usuario con ese email.')
        } else {
            console.error('\n❌ Error desconocido:', e)
        }
    } finally {
        await prisma.$disconnect()
        rl.close()
    }
}

main()
