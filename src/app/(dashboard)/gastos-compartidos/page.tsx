import { getMiembros, addMiembro, deleteMiembro, getGastosCompartidos, addGastoCompartido, deleteGastoCompartido } from '@/app/actions/gastos-compartidos'
import { Plus, Users, DollarSign, Trash2, PieChart, UserPlus } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MonthSelector } from '@/components/ui/MonthSelector'
import { getAvailableMonths } from '@/app/actions/general'
import { EditGastoCompartidoModal } from '@/components/EditGastoCompartidoModal'

export default async function GastosCompartidosPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams
    const month = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month as string) : new Date().getMonth()
    const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year as string) : new Date().getFullYear()

    const [miembros, gastos, availableMonths] = await Promise.all([
        getMiembros(),
        getGastosCompartidos(month, year),
        getAvailableMonths()
    ])

    async function handleAddMiembro(formData: FormData) {
        'use server'
        await addMiembro(formData)
    }

    async function handleAddGasto(formData: FormData) {
        'use server'
        await addGastoCompartido(formData)
    }

    async function handleDeleteMiembroWrapper(id: number) {
        'use server'
        await deleteMiembro(id)
    }

    async function handleDeleteGastoCompartidoWrapper(id: number) {
        'use server'
        await deleteGastoCompartido(id)
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Gastos Compartidos</h1>
                    <p className="text-muted text-lg">Divide los gastos del hogar proporcionalmente a los ingresos.</p>
                </div>
                <div className="flex items-center gap-4">
                    <MonthSelector availableDates={availableMonths} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Members Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <Users className="w-5 h-5" />
                            </div>
                            Miembros del Hogar
                        </h2>

                        <form action={handleAddMiembro} className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <label htmlFor="nombre" className="text-sm font-medium text-muted ml-1">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    className="input-modern w-full"
                                    placeholder="Ej: Yo, Pareja..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="ingresoMensual" className="text-sm font-medium text-muted ml-1">Ingreso Mensual (€)</label>
                                <input
                                    type="number"
                                    name="ingresoMensual"
                                    required
                                    step="0.01"
                                    className="input-modern w-full"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="esUsuario" id="esUsuario" className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary" />
                                <label htmlFor="esUsuario" className="text-sm text-muted">Soy yo (Usuario Principal)</label>
                            </div>
                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Agregar Miembro
                            </button>
                        </form>

                        <div className="space-y-3">
                            {miembros.map((miembro) => (
                                <div key={miembro.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div>
                                        <p className="font-medium text-foreground flex items-center gap-2">
                                            {miembro.nombre}
                                            {miembro.esUsuario && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Tú</span>}
                                        </p>
                                        <p className="text-sm text-muted">€{miembro.ingresoMensual.toFixed(2)}</p>
                                    </div>
                                    <form action={handleDeleteMiembroWrapper.bind(null, miembro.id)}>
                                        <button type="submit" className="text-muted hover:text-danger p-2 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            ))}
                            {miembros.length === 0 && (
                                <p className="text-center text-muted text-sm py-4">No hay miembros registrados.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expenses Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Add Expense Form */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                                <Plus className="w-5 h-5" />
                            </div>
                            Nuevo Gasto Compartido
                        </h2>
                        <form action={handleAddGasto} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-2 w-full">
                                <label htmlFor="descripcion" className="text-sm font-medium text-muted ml-1">Descripción</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    required
                                    className="input-modern w-full"
                                    placeholder="Ej: Alquiler, Luz..."
                                />
                            </div>
                            <div className="w-full md:w-48 space-y-2">
                                <label htmlFor="montoTotal" className="text-sm font-medium text-muted ml-1">Monto Total (€)</label>
                                <input
                                    type="number"
                                    name="montoTotal"
                                    required
                                    step="0.01"
                                    className="input-modern w-full"
                                    placeholder="0.00"
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 h-[42px]">
                                <Plus className="w-5 h-5" />
                                Registrar
                            </button>
                        </form>
                    </div>

                    {/* Expenses List */}
                    <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
                        <h2 className="text-xl font-bold text-foreground mb-6">Historial de Gastos</h2>

                        {gastos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[200px] text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <PieChart className="w-8 h-8 text-muted/50" />
                                </div>
                                <p className="text-muted">No hay gastos compartidos registrados.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {gastos.map((gasto) => (
                                    <div key={gasto.id} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">{gasto.descripcion}</h3>
                                                <p className="text-sm text-muted">
                                                    {format(new Date(gasto.fecha), "d MMM yyyy", { locale: es })}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                                <p className="text-xl font-bold text-foreground">€{gasto.montoTotal.toFixed(2)}</p>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <EditGastoCompartidoModal gasto={gasto} miembros={miembros} />
                                                    <form action={handleDeleteGastoCompartidoWrapper.bind(null, gasto.id)}>
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

                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted uppercase tracking-wider">Reparto Proporcional</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {gasto.miembros.map((miembro) => {
                                                    const totalIngresos = gasto.miembros.reduce((sum, m) => sum + m.ingresoMensual, 0)
                                                    const porcentaje = (miembro.ingresoMensual / totalIngresos) * 100
                                                    const monto = (gasto.montoTotal * porcentaje) / 100

                                                    return (
                                                        <div key={miembro.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${miembro.esUsuario ? 'bg-primary' : 'bg-secondary'}`} />
                                                                <span className="text-sm text-foreground/90">{miembro.nombre}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-bold text-foreground">€{monto.toFixed(2)}</span>
                                                                <span className="text-xs text-muted ml-2">({porcentaje.toFixed(0)}%)</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
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
