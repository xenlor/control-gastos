// Usage: node scripts/crear-usuario.js <username> <password> [nombre] [role]
// Example: node scripts/crear-usuario.js admin Pass123! "Admin User" ADMIN

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const username = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || username;
    const role = (process.argv[5] || 'USER').toUpperCase();

    if (!username || !password) {
        console.log('❌ Uso: node scripts/crear-usuario.js <username> <password> [nombre] [role]');
        console.log('Ejemplo: node scripts/crear-usuario.js admin Pass123! "Admin User" ADMIN');
        process.exit(1);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role,
                // Create default config for the user
                configuracion: {
                    create: {
                        porcentajeAhorro: 20.0
                    }
                }
            }
        });

        console.log('\n✅ Usuario creado exitosamente:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Nombre: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password: ${password} (Guardada como hash)`);
        console.log(`   Configuración: Creada por defecto (20%)`);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('\n❌ Error: Ya existe un usuario con ese username.');
        } else {
            console.error('\n❌ Error al crear usuario:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
