'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

type Categoria = {
    id: number
    nombre: string
    color: string
    icono: string | null
}

export function CategoryFilter({ categorias }: { categorias: Categoria[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Get selected categories from URL
    const selectedIds = searchParams.get('categories')
        ? searchParams.get('categories')!.split(',').map(Number)
        : []

    const toggleCategory = (id: number) => {
        const newSelected = selectedIds.includes(id)
            ? selectedIds.filter(catId => catId !== id)
            : [...selectedIds, id]

        updateUrl(newSelected)
    }

    const clearFilter = () => {
        updateUrl([])
        setIsOpen(false)
    }

    const updateUrl = (ids: number[]) => {
        const params = new URLSearchParams(searchParams.toString())
        if (ids.length > 0) {
            params.set('categories', ids.join(','))
        } else {
            params.delete('categories')
        }
        router.push(`?${params.toString()}`)
    }

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${selectedIds.length > 0
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-white/5 border-white/10 text-muted hover:bg-white/10'
                    }`}
            >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {selectedIds.length === 0
                        ? 'Filtrar por categoría'
                        : `${selectedIds.length} seleccionada${selectedIds.length !== 1 ? 's' : ''}`}
                </span>
                {selectedIds.length > 0 && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            clearFilter()
                        }}
                        className="ml-1 p-0.5 rounded-full hover:bg-primary/20"
                    >
                        <X className="w-3 h-3" />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                        {categorias.map((cat) => {
                            const isSelected = selectedIds.includes(cat.id)
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isSelected
                                        ? 'bg-white/10 text-foreground'
                                        : 'text-muted hover:bg-white/5 hover:text-foreground'
                                        }`}
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full border ${isSelected ? 'border-transparent' : 'border-current opacity-50'}`}
                                        style={{ backgroundColor: isSelected ? cat.color : 'transparent' }}
                                    />
                                    <span className="flex-1 text-left truncate">{cat.nombre}</span>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </button>
                            )
                        })}
                    </div>
                    {selectedIds.length > 0 && (
                        <div className="p-2 border-t border-white/10 bg-white/5">
                            <button
                                onClick={clearFilter}
                                className="w-full py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
