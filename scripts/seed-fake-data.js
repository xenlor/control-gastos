const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const username = 'esteban'

    console.log(`🌱 Generando datos falsos para: ${username}`)

    // 1. Get User
    const user = await prisma.user.findUnique({
        where: { username },
        include: { categorias: true }
    })

    if (!user) {
        console.error('❌ Usuario no encontrado. Crea primero el usuario.')
        return
    }

    console.log(`👤 Usuario encontrado: ${user.name} (${user.id})`)

    // 2. Clean existing data for this user
    console.log('🧹 Limpiando datos existentes...')
    await prisma.gasto.deleteMany({ where: { userId: user.id } })
    await prisma.ingreso.deleteMany({ where: { userId: user.id } })
    await prisma.inversion.deleteMany({ where: { userId: user.id } })
    await prisma.gastoCompartido.deleteMany({ where: { userId: user.id } })
    await prisma.ahorro.deleteMany({ where: { userId: user.id } })
    await prisma.prestamo.deleteMany({ where: { userId: user.id } })

    // Helper for relative dates
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() // 0-indexed

    // Return a date for the current month at specific day
    const dateThisMonth = (day) => new Date(currentYear, currentMonth, day)
    // Return a date for previous month
    const datePrevMonth = (day) => new Date(currentYear, currentMonth - 1, day)

    // 3. Fake Categories (Ensure they exist if not standard)
    let cats = user.categorias

    if (cats.length === 0) {
        console.log('⚠️ No hay categorías. Creando categorías por defecto...')
        const defaults = [
            { nombre: 'Vivienda', color: '#ef4444', icono: 'home' },
            { nombre: 'Alimentación', color: '#f97316', icono: 'shopping-cart' },
            { nombre: 'Transporte', color: '#eab308', icono: 'car' },
            { nombre: 'Ocio', color: '#84cc16', icono: 'film' },
            { nombre: 'Servicios', color: '#06b6d4', icono: 'wifi' },
            { nombre: 'Educación', color: '#6366f1', icono: 'book' },
            { nombre: 'Ropa', color: '#d946ef', icono: 'shirt' },
            { nombre: 'Salud', color: '#ec4899', icono: 'heart' },
            { nombre: 'Otros', color: '#64748b', icono: 'more-horizontal' },
        ]

        // Create them sequentially to avoid race conditions or just use Promise.all
        // Using sequential for simplicity in script
        for (const c of defaults) {
            await prisma.categoria.create({
                data: { ...c, userId: user.id }
            })
        }

        // Fetch them back
        const updatedUser = await prisma.user.findUnique({
            where: { username },
            include: { categorias: true }
        })
        cats = updatedUser.categorias
    }

    const getCatId = (name) => {
        const c = cats.find(c => c.nombre.includes(name))
        return c ? c.id : cats[0].id // Fallback
    }

    // 4. Seed Income
    console.log('💰 Creando ingresos...')
    await prisma.ingreso.createMany({
        data: [
            { userId: user.id, monto: 2800, descripcion: 'Nómina Mes Actual', fecha: dateThisMonth(1) },
            { userId: user.id, monto: 350, descripcion: 'Venta bicicleta', fecha: dateThisMonth(10) },
            { userId: user.id, monto: 2800, descripcion: 'Nómina Mes Anterior', fecha: datePrevMonth(1) },
        ]
    })

    // 5. Seed Expenses (Current Month & Previous)
    console.log('💸 Creando gastos...')
    const gastos = [
        // Vivienda
        { desc: 'Alquiler Piso', monto: 850, cat: 'Vivienda', fecha: dateThisMonth(1) },
        { desc: 'Internet Fibra', monto: 35, cat: 'Servicios', fecha: dateThisMonth(2) },

        // Alimentación
        { desc: 'Compra Semanal Mercadona', monto: 88.20, cat: 'Alimentación', fecha: dateThisMonth(3) },
        { desc: 'Compra Carrefour', monto: 45.50, cat: 'Alimentación', fecha: dateThisMonth(10) },
        { desc: 'Cena Udon con Ana', monto: 42.00, cat: 'Ocio', fecha: dateThisMonth(12) },
        { desc: 'Desayuno Starbucks', monto: 6.50, cat: 'Alimentación', fecha: dateThisMonth(14) },

        // Transporte
        { desc: 'Gasolina Repsol', monto: 55.00, cat: 'Transporte', fecha: dateThisMonth(5) },
        { desc: 'Uber al Centro', monto: 12.50, cat: 'Transporte', fecha: dateThisMonth(15) },
        { desc: 'Abono Transporte', monto: 40.00, cat: 'Transporte', fecha: dateThisMonth(1) },

        // Ocio & Suscripciones
        { desc: 'Netflix 4K', monto: 17.99, cat: 'Ocio', fecha: dateThisMonth(20) },
        { desc: 'Spotify Duo', monto: 12.99, cat: 'Ocio', fecha: dateThisMonth(21) },
        { desc: 'Entradas Cine Dune 2', monto: 18.00, cat: 'Ocio', fecha: dateThisMonth(18) },
        { desc: 'Cervezas Afterwork', monto: 25.00, cat: 'Ocio', fecha: dateThisMonth(25) },

        // Otros
        { desc: 'Regalo Cumpleaños Mamá', monto: 120.00, cat: 'Otros', fecha: dateThisMonth(8) },
        { desc: 'Farmacia', monto: 15.40, cat: 'Salud', fecha: dateThisMonth(11) },
    ]

    for (const g of gastos) {
        await prisma.gasto.create({
            data: {
                userId: user.id,
                descripcion: g.desc,
                monto: g.monto,
                categoriaId: getCatId(g.cat),
                fecha: g.fecha
            }
        })
    }

    // 6. Seed Investments (Spread over recent months)
    console.log('📈 Creando inversiones...')
    await prisma.inversion.createMany({
        data: [
            { userId: user.id, tipo: 'ETF', nombre: 'Vanguard S&P 500 (VUSA)', monto: 2500, fecha: datePrevMonth(15), notas: 'Estrategia DCA mensual' },
            { userId: user.id, tipo: 'ETF', nombre: 'iShares MSCI World', monto: 1800, fecha: dateThisMonth(5), notas: 'Diversificación global' },
            { userId: user.id, tipo: 'Cripto', nombre: 'Bitcoin (BTC)', monto: 1200, fecha: dateThisMonth(12), notas: 'Hold a largo plazo' },
            { userId: user.id, tipo: 'Cripto', nombre: 'Ethereum (ETH)', monto: 800, fecha: dateThisMonth(14), notas: 'Staking' },
            { userId: user.id, tipo: 'Accion', nombre: 'NVIDIA Corp', monto: 1500, fecha: dateThisMonth(2), notas: 'Sector IA' },
            { userId: user.id, tipo: 'Accion', nombre: 'Microsoft', monto: 1000, fecha: datePrevMonth(20), notas: 'Dividendo trimestral' },
            { userId: user.id, tipo: 'Fondo', nombre: 'Indexa Capital', monto: 5000, fecha: datePrevMonth(1), notas: 'Fondo indexado roboadvisor' },
        ]
    })

    // 7. Seed Loans (Préstamos)
    console.log('🤝 Creando préstamos...')
    // Préstamo que ME deben (Salida de dinero = Gasto)
    const prestamoSalida = await prisma.gasto.create({
        data: {
            userId: user.id,
            descripcion: 'Préstamo a Carlos (Coche)',
            monto: 500,
            categoriaId: getCatId('Otros'),
            fecha: dateThisMonth(5)
        }
    })

    await prisma.prestamo.create({
        data: {
            userId: user.id,
            persona: 'Carlos',
            monto: 500,
            fechaPrestamo: dateThisMonth(5),
            pagado: false,
            gastoId: prestamoSalida.id,
            fechaRecordatorio: dateThisMonth(25)
        }
    })

    // Préstamo que YA me pagaron (Entrada de dinero = Ingreso)
    const ingresoPago = await prisma.ingreso.create({
        data: {
            userId: user.id,
            descripcion: 'Devolución Préstamo Laura',
            monto: 200,
            fecha: dateThisMonth(10)
        }
    })

    await prisma.prestamo.create({
        data: {
            userId: user.id,
            persona: 'Laura',
            monto: 200,
            fechaPrestamo: datePrevMonth(15),
            pagado: true,
            ingresoId: ingresoPago.id
        }
    })

    // 8. Seed Shared Expenses (Trip) w/ more details
    console.log('👥 Creando gastos compartidos...')
    const viaje = await prisma.gastoCompartido.create({
        data: {
            userId: user.id,
            descripcion: 'Viaje a Italia',
            montoTotal: 1200,
            fecha: dateThisMonth(15),
            miembros: {
                create: [
                    { nombre: 'Esteban (Yo)', ingresoMensual: 2800, esUsuario: true },
                    { nombre: 'Ana', ingresoMensual: 2200, esUsuario: false },
                    { nombre: 'Carlos', ingresoMensual: 1900, esUsuario: false }
                ]
            }
        },
        include: { miembros: true }
    })

    // Add individual expenses linked to shared group
    await prisma.gasto.create({
        data: {
            userId: user.id,
            descripcion: 'Vuelos Italia (Adelanto)',
            monto: 450,
            categoriaId: getCatId('Transporte'),
            fecha: dateThisMonth(14),
            gastoCompartidoId: viaje.id,
            esCompartido: true
        }
    })

    console.log('✅ Datos falsos generados exitosamente.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
