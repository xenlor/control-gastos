import { render, screen } from '@testing-library/react'
import IngresosPage from './page'
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

vi.mock('@/app/actions/ingresos', () => ({
    getIngresos: vi.fn().mockResolvedValue([
        {
            id: 1,
            monto: 2500.0,
            descripcion: 'Nómina',
            fecha: new Date('2023-10-01'),
        },
        {
            id: 2,
            monto: 500.0,
            descripcion: 'Freelance',
            fecha: new Date('2023-10-15'),
        },
    ]),
    addIngreso: vi.fn(),
    deleteIngreso: vi.fn(),
}))

describe('IngresosPage', () => {
    it('renders the header and total summary', async () => {
        const page = await IngresosPage({ searchParams: Promise.resolve({}) })
        render(page)
        expect(screen.getByText('Ingresos')).toBeInTheDocument()
        expect(screen.getByText('Total Mensual')).toBeInTheDocument()

        // Total: 2500 + 500 = 3000
        expect(screen.getByText('€3000.00')).toBeInTheDocument()
    })

    it('renders the form elements', async () => {
        const page = await IngresosPage({ searchParams: Promise.resolve({}) })
        render(page)
        expect(screen.getByLabelText('Monto (€)')).toBeInTheDocument()
        expect(screen.getByLabelText('Descripción')).toBeInTheDocument()
        expect(screen.getByLabelText('Fecha')).toBeInTheDocument()
        expect(screen.getByText('Añadir Ingreso')).toBeInTheDocument()
    })

    it('renders the income list', async () => {
        const page = await IngresosPage({ searchParams: Promise.resolve({}) })
        render(page)

        expect(screen.getByText('Nómina')).toBeInTheDocument()
        expect(screen.getByText('+€2500.00')).toBeInTheDocument()

        expect(screen.getByText('Freelance')).toBeInTheDocument()
        expect(screen.getByText('+€500.00')).toBeInTheDocument()
    })
})
