const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');

const sqlitePath = path.join(__dirname, '../dev.db');
const sqlite = new Database(sqlitePath);
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando migración de SQLite a PostgreSQL...');
    console.log(`📂 Leyendo desde: ${sqlitePath}`);

    try {
        // 0. Crear Usuario Admin por defecto
        console.log('👤 Creando/Verificando usuario Admin...');
        const hashedPassword = await bcrypt.hash('123456', 10);
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@admin.com' },
            update: {},
            create: {
                name: 'Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
            }
        });
        const userId = adminUser.id;
        console.log(`✅ Datos se asignarán al usuario: ${adminUser.email} (${userId})`);

        // 1. Migrar Categorias
        const categorias = sqlite.prepare('SELECT * FROM Categoria').all();
        console.log(`🏷️ Migrando ${categorias.length} categorías...`);
        for (const cat of categorias) {
            await prisma.categoria.upsert({
                where: { id: cat.id },
                update: {},
                create: {
                    id: cat.id,
                    nombre: cat.nombre,
                    color: cat.color,
                    icono: cat.icono,
                    // createdAt: new Date(cat.createdAt), // Legacy might not have dates
                    userId: userId
                }
            });
        }

        // 2. Migrar Ingresos
        const ingresos = sqlite.prepare('SELECT * FROM Ingreso').all();
        console.log(`💰 Migrando ${ingresos.length} ingresos...`);
        for (const ing of ingresos) {
            await prisma.ingreso.create({
                data: {
                    id: ing.id,
                    monto: ing.monto,
                    descripcion: ing.descripcion,
                    fecha: ing.fecha ? new Date(ing.fecha) : new Date(),
                    userId: userId,
                }
            });
        }

        // 3. Migrar Gastos
        const gastos = sqlite.prepare('SELECT * FROM Gasto').all();
        console.log(`💸 Migrando ${gastos.length} gastos...`);
        for (const gasto of gastos) {
            await prisma.gasto.create({
                data: {
                    id: gasto.id,
                    monto: gasto.monto,
                    descripcion: gasto.descripcion,
                    categoriaId: gasto.categoriaId,
                    fecha: gasto.fecha ? new Date(gasto.fecha) : new Date(),
                    esCompartido: Boolean(gasto.esCompartido),
                    gastoCompartidoId: gasto.gastoCompartidoId,
                    userId: userId,
                }
            });
        }

        // 4. Migrar Prestamos
        const prestamos = sqlite.prepare('SELECT * FROM Prestamo').all();
        console.log(`🤝 Migrando ${prestamos.length} préstamos...`);
        for (const p of prestamos) {
            await prisma.prestamo.create({
                data: {
                    id: p.id,
                    persona: p.persona,
                    monto: p.monto,
                    fechaPrestamo: p.fechaPrestamo ? new Date(p.fechaPrestamo) : new Date(),
                    fechaRecordatorio: p.fechaRecordatorio ? new Date(p.fechaRecordatorio) : new Date(),
                    pagado: Boolean(p.pagado),
                    userId: userId,
                }
            });
        }

        // 5. Migrar Plazos (CompraPlazos -> Plazo)
        const plazos = sqlite.prepare('SELECT * FROM CompraPlazos').all();
        console.log(`📅 Migrando ${plazos.length} plazos (CompraPlazos)...`);
        for (const p of plazos) {
            await prisma.plazo.create({
                data: {
                    id: p.id,
                    descripcion: p.descripcion,
                    montoTotal: p.montoTotal,
                    totalCuotas: p.totalCuotas,
                    cuotasPagadas: p.cuotasPagadas,
                    montoCuota: p.montoCuota,
                    fechaInicio: p.fechaInicio ? new Date(p.fechaInicio) : new Date(),
                    estado: p.estado || 'ACTIVO',
                    userId: userId,
                }
            });
        }

        // 6. Migrar Gastos Compartidos
        const gastosCompartidos = sqlite.prepare('SELECT * FROM GastoCompartido').all();
        console.log(`👥 Migrando ${gastosCompartidos.length} grupos de gastos compartidos...`);
        for (const gc of gastosCompartidos) {
            await prisma.gastoCompartido.create({
                data: {
                    id: gc.id,
                    descripcion: gc.descripcion,
                    montoTotal: gc.montoTotal,
                    fecha: gc.fecha ? new Date(gc.fecha) : new Date(),
                    userId: userId,
                }
            });
        }

        // 7. Migrar Miembros de Gastos Compartidos (ParticipacionGasto -> MiembroGastoCompartido)
        const miembrosGC = sqlite.prepare('SELECT * FROM ParticipacionGasto').all();
        console.log(`👤 Migrando ${miembrosGC.length} miembros de gastos compartidos (ParticipacionGasto)...`);
        for (const m of miembrosGC) {
            await prisma.miembroGastoCompartido.create({
                data: {
                    id: m.id,
                    nombre: m.nombre,
                    ingresoMensual: m.ingresoMensual || 0,
                    esUsuario: Boolean(m.esUsuario),
                    gastoCompartidoId: m.gastoCompartidoId,
                }
            });
        }

        // 8. Migrar Miembros Familia (MiembroFamilia -> Miembro)
        // Check if Miembro table exists in Prisma schema.
        // Yes: model Miembro { id, nombre, ingresoMensual, esUsuario ... }
        const miembrosFamilia = sqlite.prepare('SELECT * FROM MiembroFamilia').all();
        console.log(`👨‍👩‍👧 Migrando ${miembrosFamilia.length} miembros de familia...`);
        for (const m of miembrosFamilia) {
            await prisma.miembro.create({
                data: {
                    id: m.id,
                    nombre: m.nombre,
                    ingresoMensual: m.ingresoMensual || 0,
                    esUsuario: Boolean(m.esUsuario),
                }
            });
        }

        // 9. Migrar Configuración (ConfiguracionAhorro -> Configuracion)
        const configs = sqlite.prepare('SELECT * FROM ConfiguracionAhorro').all();
        console.log(`⚙️ Migrando ${configs.length} configuraciones...`);
        for (const c of configs) {
            await prisma.configuracion.create({
                data: {
                    id: c.id,
                    porcentajeAhorro: c.porcentajeAhorro,
                }
            });
        }

        console.log('\n✅ Migración completada exitosamente.');

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error);
    } finally {
        await prisma.$disconnect();
        sqlite.close();
    }
}

main();
