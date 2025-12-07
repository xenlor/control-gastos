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
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/ingresos', label: 'Ingresos', icon: TrendingUp },
        { href: '/gastos', label: 'Gastos', icon: TrendingDown },
        { href: '/ahorros', label: 'Ahorros', icon: PiggyBank },
        { href: '/inversiones', label: 'Inversiones', icon: LineChart },
        { href: '/prestamos', label: 'Préstamos', icon: HandCoins },
        { href: '/plazos', label: 'Plazos', icon: CreditCard },
    ]

    const adminItems = [
        { href: '/admin/users', label: 'Administración', icon: Shield },
    ]

    const userItems = [
        { href: '/settings', label: 'Configuración', icon: Settings },
    ]

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Bottom Sheet Menu */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-3xl z-50 md:hidden transform transition-transform duration-300 ease-out max-h-[85vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Handle Bar */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-muted rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="px-6 pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">€</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Control Gastos</h2>
                                <p className="text-xs text-muted">{userName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation - Scrollable */}
                    <nav className="flex-1 overflow-y-auto py-4 px-6">
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-muted hover:bg-white/5 hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}

                            {/* Divider */}
                            <div className="border-t border-border my-3" />

                            {/* Admin Section */}
                            {userRole === 'ADMIN' && adminItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname.startsWith(item.href)

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-muted hover:bg-white/5 hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}

                            {/* User Settings */}
                            {userItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-muted hover:bg-white/5 hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Logout - Fixed at bottom */}
                    <div className="px-6 py-4 border-t border-border">
                        <form action="/api/auth/signout" method="POST">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all w-full"
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
