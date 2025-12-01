import { render, screen } from '@testing-library/react'
import Navigation from './Navigation'
import { describe, it, expect, vi } from 'vitest'

// Mock usePathname
vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}))

// Mock auth actions
vi.mock('@/app/actions/auth', () => ({
    logout: vi.fn(),
}))

describe('Navigation', () => {
    it('renders the logo', () => {
        render(<Navigation />)
        expect(screen.getByText('Control Gastos')).toBeInTheDocument()
        expect(screen.getByText('Finanzas Personales')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
        render(<Navigation />)
        // Use getAllByText because links exist in both desktop and mobile navs
        expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Ingresos')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Gastos')[0]).toBeInTheDocument()
    })

    it('renders the logout button', () => {
        render(<Navigation />)
        expect(screen.getAllByTitle('Cerrar Sesión')[0]).toBeInTheDocument()
    })
})
