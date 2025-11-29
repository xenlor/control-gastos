'use client'

import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon?: React.ReactNode
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon, error, className, id, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label htmlFor={id} className="text-sm font-medium text-muted ml-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        className={`input-modern ${icon ? '!pl-12' : ''} ${className || ''} ${error ? 'border-danger focus:border-danger focus:box-shadow-danger' : ''}`}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                            {icon}
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-danger ml-1">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
