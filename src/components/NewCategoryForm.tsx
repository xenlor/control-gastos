'use client'

import { useState } from 'react'
import { Plus, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { addCategoria } from '@/app/actions/gastos'

export function NewCategoryForm() {
    const [isOpen, setIsOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        const result = await addCategoria(formData)
        if (result.success) {
            setIsOpen(false)
        } else {
            alert('Error al crear categoría')
        }
    }

    return (
        <div className="glass-panel p-6 rounded-2xl mt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group"
            >
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary/20 text-secondary group-hover:bg-secondary/30 transition-colors">
                        <Tag className="w-5 h-5" />
                    </div>
                    Nueva Categoría
                </h2>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted" />
                )}
            </button>

            {isOpen && (
                <form action={handleSubmit} className="space-y-5 mt-6 animate-in slide-in-from-top-2 duration-200">
                    <Input
                        id="nombre"
                        name="nombre"
                        label="Nombre de Categoría"
                        placeholder="Ej: Mascotas, Viajes..."
                        icon={<Tag className="w-5 h-5" />}
                        required
                    />

                    <div className="space-y-2">
                        <label htmlFor="color" className="text-sm font-medium text-muted ml-1">
                            Color
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'].map((color) => (
                                <div key={color} className="relative">
                                    <input
                                        type="radio"
                                        name="color"
                                        id={`color-${color}`}
                                        value={color}
                                        className="peer sr-only"
                                        defaultChecked={color === '#6366f1'}
                                    />
                                    <label
                                        htmlFor={`color-${color}`}
                                        className="block w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-offset-background peer-checked:ring-white"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <SubmitButton>
                        Crear Categoría
                    </SubmitButton>
                </form>
            )}
        </div>
    )
}
