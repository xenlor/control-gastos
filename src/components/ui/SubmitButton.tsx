'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    loadingText?: string
}

export function SubmitButton({
    children,
    loadingText = 'Guardando...',
    className,
    disabled,
    ...props
}: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending || disabled}
            className={`btn-primary w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed ${className || ''}`}
            {...props}
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    )
}
