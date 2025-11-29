import { render, screen, within } from '@testing-library/react'
import PlazosPage from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock server actions
vi.mock('../actions/plazos', () => ({
    getPlazos: vi.fn().mockResolvedValue([
        {
            id: 1,
            descripcion: 'iPhone 15',
            montoTotal: 1200.0,
            totalCuotas: 12,
            montoCuota: 100.0,
            cuotasPagadas: 2,
            fechaInicio: new Date('2023-10-01'),
        },
        {
            id: 2,
            descripcion: 'TV Samsung',
            montoTotal: 600.0,
            totalCuotas: 6,
            montoCuota: 100.0,
            cuotasPagadas: 6, // Paid
            fechaInicio: new Date('2023-09-01'),
        },
    ]),
    addPlazo: vi.fn(),
    payCuota: vi.fn(),
    deletePlazo: vi.fn(),
}))

describe('PlazosPage', () => {
    it('renders the header and summary', async () => {
        const page = await PlazosPage()
        render(page)
        expect(screen.getByText('Compras a Plazos')).toBeInTheDocument()
        expect(screen.getByText('Deuda Restante')).toBeInTheDocument()

        // Total Debt: (1200 - 200) + (600 - 600) = 1000
        expect(screen.getByText('€1000.00')).toBeInTheDocument()
    })

    it('renders the form elements', async () => {
        const page = await PlazosPage()
        render(page)
        expect(screen.getByPlaceholderText('Ej: iPhone 15, TV...')).toBeInTheDocument()
        expect(screen.getByText('Registrar Compra')).toBeInTheDocument()
    })

    it('renders the installments list with progress', async () => {
        const page = await PlazosPage()
        render(page)

        // Find the iPhone card by finding the text and going up to the container
        // Alternatively, we can assume order or use test-ids. 
        // Let's use the text to find the container.
        const iphoneText = screen.getByText('iPhone 15')
        const iphoneCard = iphoneText.closest('.group') as HTMLElement

        expect(within(iphoneCard).getByText('Cuota 2 de 12')).toBeInTheDocument()
        expect(within(iphoneCard).getByText('17% pagado')).toBeInTheDocument()
        expect(within(iphoneCard).getByText('Pagar Cuota')).toBeInTheDocument()

        // Find the TV card
        const tvText = screen.getByText('TV Samsung')
        const tvCard = tvText.closest('.group') as HTMLElement

        expect(within(tvCard).getByText('Cuota 6 de 6')).toBeInTheDocument()
        expect(within(tvCard).getByText('100% pagado')).toBeInTheDocument()
        expect(within(tvCard).queryByText('Pagar Cuota')).not.toBeInTheDocument()
    })
})
