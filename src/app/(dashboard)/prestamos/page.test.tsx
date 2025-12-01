import { render, screen } from '@testing-library/react'
import PrestamosPage from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock server actions
vi.mock('@/app/actions/prestamos', () => ({
    getPrestamos: vi.fn().mockResolvedValue([
        {
            id: 1,
            persona: 'Juan Perez',
            monto: 100.0,
            fechaPrestamo: new Date('2023-10-01'),
            fechaRecordatorio: new Date('2023-11-01'),
            pagado: false,
        },
        {
            id: 2,
            persona: 'Maria Lopez',
            monto: 50.0,
            fechaPrestamo: new Date('2023-09-15'),
            fechaRecordatorio: new Date('2023-10-15'),
            pagado: true,
        },
    ]),
    addPrestamo: vi.fn(),
    togglePrestamoPagado: vi.fn(),
    deletePrestamo: vi.fn(),
}))

describe('PrestamosPage', () => {
    it('renders the header and summary', async () => {
        const page = await PrestamosPage()
        render(page)
        expect(screen.getByText('Préstamos')).toBeInTheDocument()
        expect(screen.getByText('Pendiente de Cobro')).toBeInTheDocument()

        // Total pending: 100 (Juan). This might appear in the list too.
        const amounts = screen.getAllByText('€100.00')
        expect(amounts.length).toBeGreaterThan(0)
    })

    it('renders the form elements', async () => {
        const page = await PrestamosPage()
        render(page)
        expect(screen.getByPlaceholderText('Nombre de la persona')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
        expect(screen.getByText('Registrar Préstamo')).toBeInTheDocument()
    })

    it('renders the loans list with correct status', async () => {
        const page = await PrestamosPage()
        render(page)

        // Check Juan (Pending)
        expect(screen.getByText('Juan Perez')).toBeInTheDocument()
        // €100.00 is already checked in summary, but let's check it exists
        expect(screen.getAllByText('€100.00')[0]).toBeInTheDocument()
        expect(screen.getByText('Marcar Pagado')).toBeInTheDocument()

        // Check Maria (Paid)
        expect(screen.getByText('Maria Lopez')).toBeInTheDocument()
        expect(screen.getByText('€50.00')).toBeInTheDocument()
        expect(screen.getByText('Pagado')).toBeInTheDocument()
    })
})
