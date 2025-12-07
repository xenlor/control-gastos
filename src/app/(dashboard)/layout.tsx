import Navigation from '@/components/Navigation'
import { MobileHeader } from '@/components/MobileHeader'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const user = await getCurrentUser()

    return (
        <>
            {/* Desktop Navigation - hidden on mobile */}
            <div className="hidden md:block">
                <Navigation userRole={user.role} />
            </div>

            {/* Mobile Header - only shows on mobile */}
            <MobileHeader userName={user.name || user.username} userRole={user.role} />

            <main className="min-h-screen pt-8 px-4 pb-32 md:pt-32 md:pb-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </>
    )
}
