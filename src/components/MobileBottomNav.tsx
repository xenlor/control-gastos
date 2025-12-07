'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, TrendingUp, TrendingDown, PiggyBank, LineChart, LayoutDashboard } from 'lucide-react'

interface MobileBottomNavProps {
    onMenuClick: () => void
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
    const pathname = usePathname()

    const navItems = [
        {
            label: 'Menú',
            icon: Menu,
            onClick: onMenuClick,
            isActive: false
        },
        {
            href: '/',
            label: 'Dashboard',
            icon: LayoutDashboard,
            isActive: pathname === '/'
        },
        {
            href: '/ingresos',
            label: 'Ingresos',
            icon: TrendingUp,
            isActive: pathname === '/ingresos'
        },
        {
            href: '/gastos',
            label: 'Gastos',
            icon: TrendingDown,
            isActive: pathname === '/gastos'
        },
        {
            href: '/ahorros',
            label: 'Ahorros',
            icon: PiggyBank,
            isActive: pathname === '/ahorros'
        },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isMenu = !item.href

                    if (isMenu) {
                        return (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-all w-full"
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Menú</span>
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all w-full ${item.isActive
                                ? 'text-primary bg-primary/10'
                                : 'text-muted hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${item.isActive ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
