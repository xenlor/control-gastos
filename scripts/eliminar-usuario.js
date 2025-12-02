const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.log('\n=== 🗑️  ELIMINAR USUARIO ===\n');

    try {
        // 1. Fetch all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                role: true
            },
            orderBy: {
                username: "asc"
            }
        });

        if (users.length === 0) {
            console.log('❌ No hay usuarios en la base de datos.\n');
            process.exit(0);
        }

        // 2. Display users
        console.log('📋 Usuarios disponibles:\n');
        users.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.username} (${user.name}) - ${user.role}`);
        });

        // 3. Ask for user to delete
        rl.question('\n🔢 Ingresa el número del usuario a eliminar (0 para cancelar): ', async (input) => {
            const choice = parseInt(input);

            if (choice === 0) {
                console.log('\n✅ Operación cancelada.\n');
                rl.close();
                await prisma.$disconnect();
                process.exit(0);
            }

            if (isNaN(choice) || choice < 1 || choice > users.length) {
                console.log('\n❌ Opción inválida.\n');
                rl.close();
                await prisma.$disconnect();
                process.exit(1);
            }

            const selectedUser = users[choice - 1];

            // 4. Confirmation
            rl.question(`\n⚠️  ¿Estás seguro de eliminar a "${selectedUser.username}" (${selectedUser.name})? (s/n): `, async (confirmation) => {
                if (confirmation.toLowerCase() !== 's') {
                    console.log('\n✅ Operación cancelada.\n');
                    rl.close();
                    await prisma.$disconnect();
                    process.exit(0);
                }

                try {
                    // 5. Delete user (cascade will handle related records)
                    await prisma.user.delete({
                        where: { id: selectedUser.id }
                    });

                    console.log(`\n✅ Usuario "${selectedUser.username}" eliminado exitosamente.\n`);
                } catch (error) {
                    console.error('\n❌ Error al eliminar usuario:', error.message);
                } finally {
                    rl.close();
                    await prisma.$disconnect();
                }
            });
        });

    } catch (error) {
        console.error('\n❌ Error:', error);
        rl.close();
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
