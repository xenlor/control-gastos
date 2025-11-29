'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Edit2, DollarSign, FileText, Users } from 'lucide-react'
import { updateGastoCompartido } from '@/app/actions/gastos-compartidos'
import { Miembro } from '@prisma/client'

type EditGastoCompartidoModalProps = {
    gasto: any // Using any for simplicity as the type is complex with relations
    miembros: Miembro[]
}

export function EditGastoCompartidoModal({ gasto, miembros }: EditGastoCompartidoModalProps) {
    const [open, setOpen] = useState(false)
    const [selectedMiembros, setSelectedMiembros] = useState<number[]>(
        gasto.miembros.map((m: any) => {
            // Try to match by name since IDs might be different (snapshots)
            // Or better, just select all initially?
            // The issue is that gasto.miembros are MiembroGastoCompartido (snapshots), not Miembro.
            // We want to map them back to current Miembros if possible.
            const originalMiembro = miembros.find(om => om.nombre === m.nombre)
            return originalMiembro ? originalMiembro.id : null
        }).filter((id: number | null) => id !== null) as number[]
    )

    const handleMiembroToggle = (id: number) => {
        setSelectedMiembros(prev =>
            prev.includes(id)
                ? prev.filter(mId => mId !== id)
                : [...prev, id]
        )
    }

    async function handleUpdate(formData: FormData) {
        // Append selected members to formData
        formData.append('miembrosIds', JSON.stringify(selectedMiembros))

        const result = await updateGastoCompartido(gasto.id, formData)
        if (result.success) {
            setOpen(false)
        } else {
            alert('Error al actualizar el gasto')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-2 rounded-lg text-foreground bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-white/10">
                    <Edit2 className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Gasto Compartido</DialogTitle>
                </DialogHeader>
                <form action={handleUpdate} className="space-y-4 mt-4">
                    <Input
                        id="descripcion"
                        name="descripcion"
                        label="Descripción"
                        defaultValue={gasto.descripcion}
                        icon={<FileText className="w-5 h-5" />}
                        required
                    />
                    <Input
                        id="montoTotal"
                        name="montoTotal"
                        type="number"
                        label="Monto Total (€)"
                        defaultValue={gasto.montoTotal}
                        step="0.01"
                        icon={<DollarSign className="w-5 h-5" />}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted ml-1 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Participantes
                        </label>
                        <div className="grid grid-cols-1 gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                            {miembros.map((miembro) => (
                                <div key={miembro.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`miembro-${miembro.id}`}
                                        checked={selectedMiembros.includes(miembro.id)}
                                        onChange={() => handleMiembroToggle(miembro.id)}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={`miembro-${miembro.id}`} className="text-sm text-foreground cursor-pointer select-none">
                                        {miembro.nombre}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted">
                            Selecciona quiénes participan en este gasto para recalcular el reparto.
                        </p>
                    </div>

                    <SubmitButton>
                        Guardar Cambios
                    </SubmitButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
