import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Sun, Moon, Heart } from "lucide-react"
import { parseContent } from "../lib/utils"
import { supabase } from "../lib/supabase"
import { useAuth } from "../lib/auth-context"
import { useNavigate } from "react-router-dom"
import { useToast } from "./ui/use-toast"
import { cn } from "../lib/utils"

type MealCardProps = {
    id: string
    date: string
    meal_type: string
    content: string | string[]
    calories: string
    showDate?: boolean
    initiallyLiked?: boolean
}

export function MealCard({ id, date, meal_type, content, calories, showDate = false, initiallyLiked = false }: MealCardProps) {
    const [isLiked, setIsLiked] = useState(initiallyLiked)
    const { user } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Check if liked on mount if not provided (though handling this in parent is better for list performance, 
    // doing a lazy check for individual cards is okay if list isn't huge, but better to pass it in.
    // For now, we'll rely on initiallyLiked being passed correctly or check strictly if needed.
    // To keep it simple and performant, we assume 'initiallyLiked' is passed from parent which fetches 'favorites' join.
    // If not, we might have a small sync issue, but let's implement the toggle logic first.

    // Actually, to make it truly dynamic "Anlık Kontrol", we might want to check DB if we don't know.
    // But checking 30 cards = 30 requests. Bad. 
    // Best practice: Parent fetches all favorites IDs and passes `isLiked={favoritesSet.has(id)}`.
    // I will modify parents to do this.

    const toggleLike = async () => {
        if (!user) {
            toast("Favoriye eklemek için lütfen giriş yapın.", "error")
            navigate("/auth")
            return
        }

        if (loading) return
        setLoading(true)

        // Optimistic UI Update
        const previousState = isLiked
        setIsLiked(!isLiked)

        try {
            if (previousState) {
                // Unlike
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('menu_id', id)

                if (error) throw error
                toast("Favorilerden çıkarıldı.", "info")
            } else {
                // Like
                const { error } = await supabase
                    .from('favorites')
                    .insert([
                        {
                            user_id: user.id,
                            menu_id: id,
                            food_name: typeof content === 'string' ? content : JSON.stringify(content)
                        }
                    ])

                if (error) throw error
                toast("Favorilere eklendi!", "success")
            }
        } catch (err) {
            console.error("Error toggling favorite:", err)
            // Revert on error
            setIsLiked(previousState)
            toast("Bir hata oluştu.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={`transition-all hover:shadow-md border-l-4 ${meal_type === 'Kahvaltı' ? 'border-l-orange-500' : 'border-l-blue-600'} group relative`}>
            <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        {showDate && (
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                {new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {meal_type === 'Kahvaltı' ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    <Sun className="w-3.5 h-3.5" /> Kahvaltı
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    <Moon className="w-3.5 h-3.5" /> Akşam Yemeği
                                </div>
                            )}
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {calories}
                            </span>
                        </div>

                        <p className="text-base md:text-lg font-medium leading-loose text-foreground/90">
                            {parseContent(content)}
                        </p>
                    </div>

                    <button
                        onClick={toggleLike}
                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none"
                    >
                        <Heart
                            className={cn(
                                "w-6 h-6 transition-colors",
                                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground group-hover:text-red-400"
                            )}
                        />
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
