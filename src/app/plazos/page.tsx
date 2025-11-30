import { getPlazos, addPlazo, payCuota, deletePlazo, revertCuota } from '../actions/plazos'
import { Plus, Calendar, DollarSign, ShoppingBag, CreditCard, Trash2, CheckCircle2, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function PlazosPage() {
    const plazos = await getPlazos()

    const totalDeuda = plazos.reduce((sum, p) => sum + (p.montoTotal - (p.montoCuota * p.cuotasPagadas)), 0)

    async function handleAddPlazo(formData: FormData) {
        'use server'
        await addPlazo(formData)
    }

    async function handlePayCuota(id: number) {
        'use server'
        await payCuota(id)
    }

    async function handleDeletePlazo(id: number) {
        'use server'
        await deletePlazo(id)
    }

    async function handleRevertCuota(id: number) {
        'use server'
        await revertCuota(id)
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Compras a Plazos</h1>
                    <p className="text-muted text-lg">Gestiona tus compras a cuotas y visualiza tu progreso.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-3 rounded-xl flex items-center gap-4 border-primary/20 bg-primary/5 w-full md:w-auto">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-primary/80 font-medium">Deuda Restante</p>
                            <p className="text-2xl font-bold text-primary">€{totalDeuda.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl sticky top-28">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                                <Plus className="w-5 h-5" />
                            </div>
                            Nueva Compra
                        </h2>

                        <form action={handleAddPlazo} className="space-y-5">
                            <Input
                                id="descripcion"
                                name="descripcion"
                                label="Descripción"
                                placeholder="Ej: iPhone 15, TV..."
                                icon={<ShoppingBag className="w-5 h-5" />}
                                required
                            />

                            <Input
                                id="montoTotal"
                                name="montoTotal"
                                type="number"
                                label="Monto Total (€)"
                                placeholder="0.00"
                                step="0.01"
                                icon={<DollarSign className="w-5 h-5" />}
                                required
                            />

                            <Input
                                id="totalCuotas"
                                name="totalCuotas"
                                type="number"
                                label="Número de Cuotas"
                                placeholder="Ej: 12"
                                min="1"
                                icon={<Calendar className="w-5 h-5" />}
                                required
                            />

                            <Input
                                id="cuotasPagadas"
                                name="cuotasPagadas"
                                type="number"
                                label="Cuotas ya pagadas"
                                placeholder="Ej: 0"
                                min="0"
                                icon={<CheckCircle2 className="w-5 h-5" />}
                            />

                            <Input
                                id="fechaInicio"
                                name="fechaInicio"
                                type="date"
                                label="Fecha de Inicio"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                icon={<Calendar className="w-5 h-5" />}
                            />

                            <SubmitButton>
                                <Plus className="w-5 h-5" />
                                Registrar Compra
                            </SubmitButton>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
                        <h2 className="text-xl font-bold text-foreground mb-6">Mis Plazos</h2>

                        {plazos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
                                    <CreditCard className="w-10 h-10 text-muted/50" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Sin compras a plazos</h3>
                                <p className="text-muted max-w-xs">
                                    Registra tus compras a crédito para llevar un control de tus cuotas mensuales.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {plazos.map((plazo) => {
                                    const progress = (plazo.cuotasPagadas / plazo.totalCuotas) * 100
                                    const isPaid = plazo.cuotasPagadas >= plazo.totalCuotas

                                    return (
                                        <div
                                            key={plazo.id}
                                            className="group p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${isPaid ? 'bg-success/20 text-success' : 'bg-secondary/20 text-secondary'
                                                        }`}>
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground text-lg">{plazo.descripcion}</p>
                                                        <p className="text-sm text-muted">
                                                            Iniciado el {format(new Date(plazo.fechaInicio), "d MMM yyyy", { locale: es })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end pl-[4rem] sm:pl-0">
                                                    <p className="text-xl font-bold text-foreground tracking-tight">
                                                        €{plazo.montoTotal.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-muted">
                                                        €{plazo.montoCuota.toFixed(2)} / mes
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-foreground font-medium">
                                                        Cuota {plazo.cuotasPagadas} de {plazo.totalCuotas}
                                                    </span>
                                                    <span className="text-muted">
                                                        {progress.toFixed(0)}% pagado
                                                    </span>
                                                </div>
                                                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isPaid ? 'bg-success' : 'bg-secondary'
                                                            }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
                                                {plazo.cuotasPagadas > 0 && (
                                                    <form action={handleRevertCuota.bind(null, plazo.id)}>
                                                        <button
                                                            type="submit"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                                                            title="Revertir última cuota"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                            Revertir
                                                        </button>
                                                    </form>
                                                )}

                                                {!isPaid && (
                                                    <form action={handlePayCuota.bind(null, plazo.id)}>
                                                        <button
                                                            type="submit"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Pagar Cuota
                                                        </button>
                                                    </form>
                                                )}

                                                <form action={handleDeletePlazo.bind(null, plazo.id)}>
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
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
