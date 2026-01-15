import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Sun, Moon } from "lucide-react"
import { MealCard } from "../components/meal-card"
import { supabase } from "../lib/supabase"
import { useAuth } from "../lib/auth-context"
import { format } from "date-fns"

type Menu = {
    id: string
    date: string
    city: string
    meal_type: string
    content: string
    calories: string
}

export default function Dashboard() {
    const { user } = useAuth()
    const [todaysMeals, setTodaysMeals] = useState<Menu[]>([])
    const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const fetchData = async () => {
            try {
                setLoading(true)
                const todayStr = format(new Date(), 'yyyy-MM-dd')

                // 1. Fetch Today's Meals
                const { data: menuData, error: menuError } = await supabase
                    .from('menus')
                    .select('*')
                    .eq('date', todayStr)
                    .eq('city', 'İstanbul')

                if (menuError) {
                    console.error("Error fetching daily menu:", menuError)
                }

                if (mounted && menuData) {
                    setTodaysMeals(menuData)
                }

                // 2. Fetch User Favorites (if logged in)
                if (user) {
                    const { data: favData, error: favError } = await supabase
                        .from('favorites')
                        .select('menu_id')
                        .eq('user_id', user.id)

                    if (favError) {
                        console.error("Error fetching favorites:", favError)
                    }

                    if (mounted && favData) {
                        // Secure comparison: Convert everything to string to avoid type mismatches
                        // and filter out nulls/undefineds immediately
                        const ids = new Set<string>()
                        favData.forEach(f => {
                            if (f && f.menu_id) {
                                ids.add(String(f.menu_id))
                            }
                        })
                        setUserFavorites(ids)
                    }
                }
            } catch (err) {
                console.error("Critical error in Dashboard fetch:", err)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchData()

        return () => { mounted = false }
    }, [user])

    const breakfast = todaysMeals.find(m => m.meal_type === 'Kahvaltı')
    const dinner = todaysMeals.find(m => m.meal_type === 'Akşam' || m.meal_type === 'Akşam Yemeği')

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Ana Sayfa</h2>
                <p className="text-muted-foreground">Günlük yemek planı ve özet bilgiler.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-bold text-orange-700">
                            SABAH MENÜSÜ
                        </CardTitle>
                        <Sun className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        {breakfast ? (
                            <MealCard
                                {...breakfast}
                                // Explicit check passed to child
                                initiallyLiked={userFavorites.has(String(breakfast.id))}
                            />
                        ) : (
                            <div className="text-sm text-muted-foreground py-4 italic">Bugün için kahvaltı verisi henüz girilmemiş.</div>
                        )}
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-bold text-blue-700">
                            AKŞAM MENÜSÜ
                        </CardTitle>
                        <Moon className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        {dinner ? (
                            <MealCard
                                {...dinner}
                                // Explicit check passed to child
                                initiallyLiked={userFavorites.has(String(dinner.id))}
                            />
                        ) : (
                            <div className="text-sm text-muted-foreground py-4 italic">Bugün için akşam yemeği verisi henüz girilmemiş.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
