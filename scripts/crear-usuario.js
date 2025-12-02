const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Usuario Test';

    if (!email || !password) {
        console.log('❌ Uso: node scripts/crear-usuario.js <email> <password> [nombre]');
        process.exit(1);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
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
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.name}`);
        console.log(`   Password: ${password} (Guardada como hash)`);
        console.log(`   Configuración: Creada por defecto (20%)`);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('\n❌ Error: Ya existe un usuario con ese email.');
        } else {
            console.error('\n❌ Error al crear usuario:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
