import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../lib/auth-context"
import { MealCard } from "../components/meal-card"
import { Heart } from "lucide-react"

type Menu = {
    id: string
    date: string
    city: string
    meal_type: string
    content: string | string[]
    calories: string
}

export default function FavoritesPage() {
    const { user } = useAuth()
    const [favorites, setFavorites] = useState<Menu[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('favorites')
                .select(`
                    menu_id,
                    menus:menu_id (*)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error("Error fetching favorites:", error)
            } else if (data) {
                // Map the joined data cleanly
                const mappedMeals = data
                    .map((item: any) => item.menus)
                    .filter((menu: any) => menu !== null) // Filter out any nulls if join failed
                setFavorites(mappedMeals)
            }
            setLoading(false)
        }

        fetchFavorites()
    }, [user])

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Heart className="w-16 h-16 text-muted-foreground/20" />
                <h2 className="text-xl font-semibold">Lütfen Oturum Açın</h2>
                <p className="text-muted-foreground">Favorilerinizi görmek için giriş yapmalısınız.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Favorilerim</h2>
                <p className="text-muted-foreground">Beğendiğiniz yemeklerin listesi.</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Yükleniyor...</div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 text-red-200 fill-red-50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Henüz Favoriniz Yok</h3>
                    <p>Yemek listelerindeki kalp ikonuna tıklayarak favorilerinizi oluşturabilirsiniz.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {favorites.map((menu) => (
                        <MealCard
                            key={menu.id}
                            {...menu}
                            showDate={true}
                            initiallyLiked={true} // It's in favorites page, so it's liked.
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
