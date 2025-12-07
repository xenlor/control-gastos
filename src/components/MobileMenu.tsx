'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    LineChart,
    HandCoins,
    CreditCard,
    Users,
    Shield,
    Settings,
    LogOut
} from 'lucide-react'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    userName: string
    userRole: string
}

export function MobileMenu({ isOpen, onClose, userName, userRole }: MobileMenuProps) {
    const pathname = usePathname()

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
            return () => {
                document.removeEventListener('keydown', handleEscape)
                document.body.style.overflow = 'unset'
            }
        }
    }, [isOpen, onClose])

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { href: '/ingresos', label: 'Ingresos', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { href: '/gastos', label: 'Gastos', icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { href: '/ahorros', label: 'Ahorros', icon: PiggyBank, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { href: '/inversiones', label: 'Inversiones', icon: LineChart, color: 'text-violet-400', bg: 'bg-violet-400/10' },
        { href: '/prestamos', label: 'Préstamos', icon: HandCoins, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { href: '/plazos', label: 'Plazos', icon: CreditCard, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    ]

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Side Menu */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-background border-r border-border z-50 md:hidden transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="text-white font-bold text-xl">€</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Control Gastos</h2>
                                <p className="text-sm text-muted">Finanzas Personales</p>
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {userName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-xs text-muted truncate capitalize">{userRole?.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation - Vertical List */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {navItems.filter(item => !['/', '/ingresos', '/gastos', '/ahorros', '/inversiones'].includes(item.href)).map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-4 p-4 rounded-xl transition-all border ${isActive
                                            ? 'bg-primary/10 border-primary/20 text-primary'
                                            : 'bg-card border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border space-y-3">
                        {userRole === 'ADMIN' && (
                            <Link
                                href="/admin/users"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-all"
                            >
                                <Shield className="w-5 h-5 text-primary" />
                                <span className="font-medium">Administración</span>
                            </Link>
                        )}

                        <form action="/api/auth/signout" method="POST">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all border border-transparent hover:border-danger/20"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Cerrar Sesión</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
