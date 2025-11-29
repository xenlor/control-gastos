import { render, screen } from '@testing-library/react'
import Navigation from './Navigation'
import { describe, it, expect, vi } from 'vitest'

// Mock usePathname
vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}))

describe('Navigation', () => {
    it('renders the logo', () => {
        render(<Navigation />)
        expect(screen.getByText('Finanzas')).toBeInTheDocument()
        expect(screen.getByText('Personal')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
        render(<Navigation />)
        // Use getAllByText because links exist in both desktop and mobile navs
        expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Ingresos')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Gastos')[0]).toBeInTheDocument()
    })
})
