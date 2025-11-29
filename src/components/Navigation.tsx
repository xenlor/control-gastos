'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    TrendingUp,
    TrendingDown,
    UserRound,
    CreditCard,
    Users,
    Wallet,
    PiggyBank,
    HandCoins
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/ingresos', icon: TrendingUp, label: 'Ingresos' },
    { href: '/gastos', icon: TrendingDown, label: 'Gastos' },
    { href: '/ahorros', icon: PiggyBank, label: 'Ahorros' },
    { href: '/prestamos', icon: HandCoins, label: 'Préstamos' },
    { href: '/plazos', icon: CreditCard, label: 'Plazos' },
    { href: '/gastos-compartidos', icon: Users, label: 'Compartidos' },
]

export default function Navigation() {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-white/5"></div>
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col shrink-0">
                                <span className="font-bold text-lg tracking-tight text-foreground whitespace-nowrap">Control Gastos</span>
                                <span className="text-[10px] text-muted font-medium uppercase tracking-wider whitespace-nowrap">Finanzas Personales</span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="flex-1 flex items-center min-w-0 mx-4">
                            <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin w-full px-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group font-medium shrink-0 whitespace-nowrap
                                                ${isActive
                                                    ? 'text-primary bg-primary/10'
                                                    : 'text-muted hover:text-foreground hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span className="text-sm tracking-wide">{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
                <div className="bg-card/90 backdrop-blur-xl border-t border-white/10 pb-4 pt-2 px-1">
                    <div className="flex justify-between items-end">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 flex-1 min-w-0
                                        ${isActive
                                            ? 'text-primary'
                                            : 'text-muted hover:text-foreground'
                                        }
                                    `}
                                >
                                    <div className={`
                                        p-1.5 rounded-xl transition-all duration-300
                                        ${isActive ? 'bg-primary/10' : 'bg-transparent'}
                                    `}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-medium truncate w-full text-center tracking-tight leading-none">{item.label}</span>
                                </Link>
                            )
                        })}
                        <div className="flex flex-col items-center justify-end p-1 flex-1 min-w-0">
                            <ThemeToggle className="p-1.5 w-8 h-8 flex items-center justify-center" />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
