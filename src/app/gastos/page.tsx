import { getGastos, addGasto, deleteGasto, getCategorias, addCategoria } from '../actions/gastos'
import { Trash2, TrendingDown, Plus, Calendar, DollarSign, FileText, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Input } from '@/components/ui/Input'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { NewCategoryForm } from '@/components/NewCategoryForm'
import { MonthSelector } from '@/components/ui/MonthSelector'
import { getAvailableMonths } from '../actions/general'
import { CategoryFilter } from '@/components/CategoryFilter'

export default async function GastosPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams
    const month = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month as string) : new Date().getMonth()
    const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year as string) : new Date().getFullYear()

    // Parse category IDs from URL
    const categoryIds = resolvedSearchParams.categories
        ? (resolvedSearchParams.categories as string).split(',').map(Number)
        : []

    const [gastos, categorias, availableMonths] = await Promise.all([
        getGastos(month, year, categoryIds),
        getCategorias(),
        getAvailableMonths()
    ])

    const total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

    async function handleAddGasto(formData: FormData) {
        'use server'
        await addGasto(formData)
    }

    async function handleDeleteGasto(id: number) {
        'use server'
        await deleteGasto(id)
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Gastos</h1>
                    <p className="text-muted text-lg">Controla tus gastos y categorízalos.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <MonthSelector availableDates={availableMonths} />
                    <CategoryFilter categorias={categorias} />
                    <div className="glass-panel px-6 py-3 rounded-xl flex items-center gap-4 border-danger/20 bg-danger/5 flex-1 md:flex-none justify-between md:justify-start">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-danger/20 text-danger">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-danger/80 font-medium">Total Mensual</p>
                                <p className="text-2xl font-bold text-danger">€{total.toFixed(2)}</p>
                            </div>
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
                            Nuevo Gasto
                        </h2>

                        <form action={handleAddGasto} className="space-y-5">
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
                                <label htmlFor="descripcion" className="text-sm font-medium text-muted ml-1">
                                    Descripción
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="descripcion"
                                        name="descripcion"
                                        required
                                        className="input-modern !pl-12"
                                        placeholder="Ej: Supermercado, Netflix..."
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="categoriaId" className="text-sm font-medium text-muted ml-1">
                                    Categoría
                                </label>
                                <div className="relative">
                                    <select
                                        id="categoriaId"
                                        name="categoriaId"
                                        required
                                        className="input-modern !pl-12 appearance-none"
                                        defaultValue=""
                                    >
                                        <option value="" disabled className="bg-card text-foreground">Seleccionar categoría</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-card text-foreground">
                                                {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fecha" className="text-sm font-medium text-muted ml-1">
                                    Fecha
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="fecha"
                                        name="fecha"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="input-modern !pl-12"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                                <Plus className="w-5 h-5" />
                                Añadir Gasto
                            </button>
                        </form>
                    </div>

                    <NewCategoryForm />
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
                        <h2 className="text-xl font-bold text-foreground mb-6">Historial de Gastos</h2>

                        {gastos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
                                    <TrendingDown className="w-10 h-10 text-muted/50" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">Sin gastos registrados</h3>
                                <p className="text-muted max-w-xs">
                                    Tus gastos aparecerán aquí. Comienza añadiendo uno desde el formulario.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {gastos.map((gasto) => (
                                    <div
                                        key={gasto.id}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/10 shadow-sm shrink-0"
                                                style={{ backgroundColor: `${gasto.categoria.color}20`, color: gasto.categoria.color, borderColor: `${gasto.categoria.color}40` }}
                                            >
                                                <Tag className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-lg">{gasto.descripcion}</p>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted">
                                                    <span
                                                        className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/5 border border-white/10"
                                                        style={{ color: gasto.categoria.color }}
                                                    >
                                                        {gasto.categoria.nombre}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(gasto.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-[4rem] sm:pl-0">
                                            <p className="text-xl font-bold text-danger tracking-tight">
                                                -€{gasto.monto.toFixed(2)}
                                            </p>
                                            <form action={handleDeleteGasto.bind(null, gasto.id)}>
                                                <button
                                                    type="submit"
                                                    className="p-2.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200 opacity-100 sm:opacity-0 group-hover:opacity-100"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
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
