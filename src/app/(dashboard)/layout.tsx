import Navigation from '@/components/Navigation'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-8 px-4 pb-32 md:pt-32 md:pb-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </>
    )
}
