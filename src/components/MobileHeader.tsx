'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wallet, Shield, Settings, LogOut } from 'lucide-react'
import { MobileMenuButton } from './MobileMenuButton'
import { MobileMenu } from './MobileMenu'

interface MobileHeaderProps {
    userName: string
    userRole: string
}

export function MobileHeader({ userName, userRole }: MobileHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Mobile Header - only shows on mobile */}
            <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-b border-border">
                <div className="flex items-center justify-between px-4 h-16">
                    {/* Hamburger Button */}
                    <MobileMenuButton
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-foreground">Control Gastos</span>
                    </Link>

                    {/* User Actions - Icons Only */}
                    <div className="flex items-center gap-1">
                        {userRole === 'ADMIN' && (
                            <Link
                                href="/admin/users"
                                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Administración"
                            >
                                <Shield className="w-5 h-5" />
                            </Link>
                        )}
                        <Link
                            href="/settings"
                            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                            title="Configuración"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        <form action="/api/auth/signout" method="POST" className="inline">
                            <button
                                type="submit"
                                className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                                title="Cerrar Sesión"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                userName={userName}
                userRole={userRole}
            />

            {/* Spacer for fixed header on mobile */}
            <div className="h-16 md:hidden" />
        </>
    )
}
