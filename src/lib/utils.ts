import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Helper to safely parse content into a displayable string
export const parseContent = (content: any): string => {
    if (!content) return ""

    // If it's already an array, join it
    if (Array.isArray(content)) {
        return content.join(", ")
    }

    // If it's a string, acts different based on if it looks like JSON or plain text
    if (typeof content === 'string') {
        try {
            // Try parsing if it looks like a JSON array
            if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
                const parsed = JSON.parse(content)
                if (Array.isArray(parsed)) {
                    return parsed.join(", ")
                }
            }
        } catch (e) {
            // Ignore parse error, treat as plain string
        }
        return content
    }

    return String(content)
}
