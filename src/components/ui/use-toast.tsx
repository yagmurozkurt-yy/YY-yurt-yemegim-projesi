
import React, { createContext, useContext, useState, useCallback } from "react"
import { X } from "lucide-react"

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: number
    message: string
    type: ToastType
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }, [])

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`
                            min-w-[300px] p-4 rounded-lg shadow-lg border flex items-center justify-between animate-in slide-in-from-right-full duration-300
                            ${t.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                                t.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                    'bg-white border-gray-200 text-gray-800'}
                        `}
                    >
                        <span className="text-sm font-medium">{t.message}</span>
                        <button onClick={() => removeToast(t.id)} className="text-current opacity-70 hover:opacity-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
