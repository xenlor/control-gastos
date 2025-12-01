import { render, screen } from '@testing-library/react'
import GastosCompartidosPage from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock server actions
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn().mockReturnValue(null),
        toString: vi.fn().mockReturnValue(''),
    }),
    usePathname: () => '/',
}))

vi.mock('@/app/actions/gastos-compartidos', () => ({
    getMiembros: vi.fn().mockResolvedValue([
        { id: 1, nombre: 'Yo', ingresoMensual: 2000, esUsuario: true },
        { id: 2, nombre: 'Pareja', ingresoMensual: 1000, esUsuario: false },
    ]),
    getGastosCompartidos: vi.fn().mockResolvedValue([
        {
            id: 1,
            descripcion: 'Alquiler',
            montoTotal: 900.0,
            fecha: new Date('2023-10-01'),
            miembros: [
                { id: 1, nombre: 'Yo', ingresoMensual: 2000, esUsuario: true },
                { id: 2, nombre: 'Pareja', ingresoMensual: 1000, esUsuario: false },
            ],
        },
    ]),
    addMiembro: vi.fn(),
    addGastoCompartido: vi.fn(),
    deleteMiembro: vi.fn(),
}))

describe('GastosCompartidosPage', () => {
    it('renders the header and members', async () => {
        const page = await GastosCompartidosPage({ searchParams: Promise.resolve({}) })
        render(page)
        expect(screen.getByText('Gastos Compartidos')).toBeInTheDocument()
        expect(screen.getByText('Miembros del Hogar')).toBeInTheDocument()

        // Check members
        // Use getAllByText in case "Yo" appears in the expense list too (it does)
        expect(screen.getAllByText(/Yo/)[0]).toBeInTheDocument()
        expect(screen.getAllByText('€2000.00')[0]).toBeInTheDocument()
        expect(screen.getAllByText(/Pareja/)[0]).toBeInTheDocument()
        expect(screen.getAllByText('€1000.00')[0]).toBeInTheDocument()
    })

    it('renders shared expenses with correct split', async () => {
        const page = await GastosCompartidosPage({ searchParams: Promise.resolve({}) })
        render(page)

        expect(screen.getByText('Alquiler')).toBeInTheDocument()
        expect(screen.getByText('€900.00')).toBeInTheDocument()

        // Total Income: 3000
        // Yo: 2000/3000 = 66.6% -> €600
        // Pareja: 1000/3000 = 33.3% -> €300

        expect(screen.getByText('€600.00')).toBeInTheDocument()
        expect(screen.getByText('(67%)')).toBeInTheDocument() // 66.66 rounded to 67

        expect(screen.getByText('€300.00')).toBeInTheDocument()
        expect(screen.getByText('(33%)')).toBeInTheDocument()
    })
})
