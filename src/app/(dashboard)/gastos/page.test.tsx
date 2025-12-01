import { render, screen } from '@testing-library/react'
import GastosPage from './page'
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

vi.mock('@/app/actions/gastos', () => ({
    getGastos: vi.fn().mockResolvedValue([
        {
            id: 1,
            monto: 50.0,
            descripcion: 'Test Expense',
            fecha: new Date(),
            categoria: { nombre: 'Test Category', color: '#000000' },
        },
    ]),
    getCategorias: vi.fn().mockResolvedValue([
        { id: 1, nombre: 'Test Category', color: '#000000' },
    ]),
    addGasto: vi.fn(),
    deleteGasto: vi.fn(),
}))

describe('GastosPage', () => {
    it('renders the header and summary', async () => {
        const page = await GastosPage({ searchParams: Promise.resolve({}) })
        render(page)
        expect(screen.getByText('Gastos')).toBeInTheDocument()
        expect(screen.getByText('Total Mensual')).toBeInTheDocument()
        expect(screen.getByText('€50.00')).toBeInTheDocument()
    })

    it('renders the form elements', async () => {
        const page = await GastosPage({ searchParams: Promise.resolve({}) })
        render(page)
        expect(screen.getByLabelText(/Monto/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument()
        expect(screen.getByText('Añadir Gasto')).toBeInTheDocument()
    })

    it('renders the expense list', async () => {
        const page = await GastosPage({ searchParams: Promise.resolve({}) })
        render(page)

        // Check if mock data is rendered
        expect(screen.getByText('Test Expense')).toBeInTheDocument()

        // "Test Category" appears in the select option AND the list item
        // We check if at least one instance is visible/present in the list
        const categories = screen.getAllByText('Test Category')
        expect(categories.length).toBeGreaterThanOrEqual(1)
    })
})
