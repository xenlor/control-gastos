'use client'

import { Menu, X } from 'lucide-react'

interface MobileMenuButtonProps {
    isOpen: boolean
    onClick: () => void
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors md:hidden"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
            {isOpen ? (
                <X className="w-6 h-6 text-foreground transition-transform duration-300" />
            ) : (
                <Menu className="w-6 h-6 text-foreground transition-transform duration-300" />
            )}
        </button>
    )
}
