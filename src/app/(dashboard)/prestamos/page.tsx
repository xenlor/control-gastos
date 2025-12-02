import { getPrestamos, addPrestamo, togglePrestamoPagado, deletePrestamo } from '@/app/actions/prestamos'
import { Plus, Calendar, DollarSign, User, Bell, CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function PrestamosPage() {
    const prestamos = await getPrestamos()

    const totalPrestado = prestamos.reduce((sum, p) => sum + p.monto, 0)
    const totalPendiente = prestamos
        .filter(p => !p.pagado)
        .reduce((sum, p) => sum + p.monto, 0)

    async function handleAddPrestamo(formData: FormData) {
        'use server'
        await addPrestamo(formData)
    }

    async function handleToggle(id: number, currentStatus: boolean) {
        'use server'
        await togglePrestamoPagado(id, !currentStatus)
    }

    async function handleDeletePrestamo(id: number) {
        'use server'
        await deletePrestamo(id)
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Préstamos</h1>
                    <p className="text-muted text-lg">Controla el dinero que has prestado y sus cobros.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-3 rounded-xl flex items-center gap-4 border-warning/20 bg-warning/5 w-full md:w-auto">
                        <div className="p-2 rounded-lg bg-warning/20 text-warning">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-warning/80 font-medium">Pendiente de Cobro</p>
                            <p className="text-2xl font-bold text-warning">€{totalPendiente.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl sticky top-28">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <Plus className="w-5 h-5" />
                            </div>
                            Nuevo Préstamo
                        </h2>

                        <form action={handleAddPrestamo} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="persona" className="text-sm font-medium text-muted ml-1">
                                    Persona
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="persona"
                                        name="persona"
                                        required
                                        className="input-modern !pl-12"
                                        placeholder="Nombre de la persona"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <User className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="monto" className="text-sm font-medium text-muted ml-1">
                                    Monto (€)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="monto"
                                        name="monto"
                                        step="0.01"
                                        required
                                        className="input-modern !pl-12"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fechaPrestamo" className="text-sm font-medium text-muted ml-1">
                                    Fecha del Préstamo
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="fechaPrestamo"
                                        name="fechaPrestamo"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="input-modern !pl-12"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fechaRecordatorio" className="text-sm font-medium text-muted ml-1">
                                    Fecha de Cobro (Recordatorio)
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="fechaRecordatorio"
                                        name="fechaRecordatorio"
                                        required
                                        className="input-modern !pl-12"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                                <Plus className="w-5 h-5" />
                                Registrar Préstamo
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
                        <h2 className="text-xl font-bold text-foreground mb-6">Historial de Préstamos</h2>

                        {prestamos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
                                    <User className="w-10 h-10 text-muted/50" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Sin préstamos activos</h3>
                                <p className="text-muted max-w-xs">
                                    Registra aquí el dinero que prestes para llevar un control y no olvidar cobrarlo.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {prestamos.map((prestamo) => (
                                    <div
                                        key={prestamo.id}
                                        className={`group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg gap-4 ${prestamo.pagado
                                            ? 'bg-success/5 border-success/20 hover:bg-success/10'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-warning/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${prestamo.pagado ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                                                }`}>
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-lg">{prestamo.persona}</p>
                                                <div className="flex flex-col gap-1 text-sm text-muted">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        Prestado: {format(new Date(prestamo.fechaPrestamo), "d MMM yyyy", { locale: es })}
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${!prestamo.pagado && 'text-warning'}`}>
                                                        <Bell className="w-3 h-3" />
                                                        Cobrar: {format(new Date(prestamo.fechaRecordatorio), "d MMM yyyy", { locale: es })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-[4rem] md:pl-0">
                                            <p className="text-xl font-bold text-foreground tracking-tight">
                                                €{prestamo.monto.toFixed(2)}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <form action={handleToggle.bind(null, prestamo.id, prestamo.pagado)}>
                                                    <button
                                                        type="submit"
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${prestamo.pagado
                                                            ? 'bg-success/20 text-success hover:bg-success/30'
                                                            : 'bg-white/10 text-muted hover:bg-success/20 hover:text-success'
                                                            }`}
                                                    >
                                                        {prestamo.pagado ? (
                                                            <>
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                Pagado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="w-4 h-4 rounded-full border-2 border-current" />
                                                                Marcar Pagado
                                                            </>
                                                        )}
                                                    </button>
                                                </form>

                                                <form action={handleDeletePrestamo.bind(null, prestamo.id)}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
