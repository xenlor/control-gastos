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
            select: { id: true, email: true, name: true },
            orderBy: { email: 'asc' }
        });

        if (users.length === 0) {
            console.log('❌ No hay usuarios registrados en la base de datos.');
            return;
        }

        // 2. Display users
        console.log('Seleccione el usuario a eliminar:');
        users.forEach((user, index) => {
            console.log(`   [${index + 1}] ${user.email} (${user.name || 'Sin nombre'})`);
        });
        console.log('   [0] Cancelar\n');

        // 3. Ask for selection
        rl.question('Opción: ', async (answer) => {
            const selection = parseInt(answer);

            if (isNaN(selection) || selection < 0 || selection > users.length) {
                console.log('\n❌ Opción inválida.');
                rl.close();
                return;
            }

            if (selection === 0) {
                console.log('\nOperación cancelada.');
                rl.close();
                return;
            }

            const selectedUser = users[selection - 1];

            // 4. Confirm deletion
            console.log(`\n⚠️  ADVERTENCIA: Se eliminará al usuario ${selectedUser.email} y TODOS sus datos.`);
            rl.question('¿Está seguro? (escriba "si" para confirmar): ', async (confirm) => {
                if (confirm.toLowerCase() === 'si') {
                    try {
                        console.log('\nEliminando...');
                        await prisma.user.delete({
                            where: { id: selectedUser.id }
                        });
                        console.log('✅ Usuario eliminado exitosamente.');
                    } catch (error) {
                        console.error('\n❌ Error al eliminar:', error.message);
                    }
                } else {
                    console.log('\nOperación cancelada.');
                }
                rl.close();
                await prisma.$disconnect();
            });
        });

    } catch (error) {
        console.error('\n❌ Error:', error);
        rl.close();
        await prisma.$disconnect();
    }
}

main();
