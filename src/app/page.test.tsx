import { render, screen } from '@testing-library/react'
import DashboardPage from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock server actions
vi.mock('./actions/ingresos', () => ({
    getIngresos: vi.fn().mockResolvedValue([
        { id: 1, monto: 1000, descripcion: 'Salary', fecha: new Date('2023-10-01') },
        { id: 2, monto: 500, descripcion: 'Freelance', fecha: new Date('2023-10-05') },
    ]),
}))

vi.mock('./actions/gastos', () => ({
    getGastos: vi.fn().mockResolvedValue([
        {
            id: 1,
            monto: 200,
            descripcion: 'Groceries',
            fecha: new Date('2023-10-02'),
            categoria: { nombre: 'Food', color: '#000' }
        },
    ]),
}))

describe('DashboardPage', () => {
    it('calculates and displays totals correctly', async () => {
        const page = await DashboardPage()
        render(page)

        // Total Income: 1000 + 500 = 1500
        expect(screen.getByText('€1500.00')).toBeInTheDocument()

        // Total Expenses: 200
        expect(screen.getByText('€200.00')).toBeInTheDocument()

        // Balance: 1500 - 200 = 1300
        expect(screen.getByText('€1300.00')).toBeInTheDocument()

        // Savings: 1500 * 0.10 = 150
        expect(screen.getByText('€150.00')).toBeInTheDocument()
    })

    it('renders recent transactions', async () => {
        const page = await DashboardPage()
        render(page)

        expect(screen.getByText('Salary')).toBeInTheDocument()
        expect(screen.getByText('Freelance')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
    })
})
