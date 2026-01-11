
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { format, startOfWeek, endOfWeek } from "date-fns"
import { tr } from "date-fns/locale"
import { MealCard } from "../components/meal-card"
import { useAuth } from "../lib/auth-context"

type Menu = {
    id: string
    date: string
    city: string
    meal_type: string
    content: string | string[]
    calories: string
}

export default function WeeklyPlan() {
    const { user } = useAuth()
    const [weekMenus, setWeekMenus] = useState<{ date: Date; meals: Menu[] }[]>([])
    const [loading, setLoading] = useState(true)
    const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set())

    useEffect(() => {
        const fetchWeekMenus = async () => {
            setLoading(true)

            // Mocking a date that has a full week of data (Mon-Sun)
            // Using Jan 5, 2026 (Monday) so startOfWeek gives us Jan 5 - Jan 11 (Full data availability)
            const mockToday = new Date(2026, 0, 5)
            const start = format(startOfWeek(mockToday, { weekStartsOn: 1 }), 'yyyy-MM-dd')
            const end = format(endOfWeek(mockToday, { weekStartsOn: 1 }), 'yyyy-MM-dd')

            const { data } = await supabase
                .from('menus')
                .select('*')
                .eq('city', 'İstanbul') // Default
                .gte('date', start)
                .lte('date', end)

            if (data) {
                // Deduplicate explicitly
                const unique = data.reduce((acc: Menu[], current: Menu) => {
                    const exists = acc.find(item => item.date === current.date && item.meal_type === current.meal_type);
                    if (!exists) {
                        return acc.concat([current]);
                    }
                    return acc;
                }, []);

                // Group by day
                const grouped = unique.reduce((acc: any, menu: Menu) => {
                    const dateStr = menu.date
                    if (!acc[dateStr]) acc[dateStr] = []
                    acc[dateStr].push(menu)
                    return acc
                }, {})

                // Convert to array
                const result = Object.keys(grouped).sort().map(dateStr => ({
                    date: new Date(dateStr),
                    meals: grouped[dateStr].sort((a: Menu) => a.meal_type === 'Kahvaltı' ? -1 : 1)
                }))

                setWeekMenus(result)
            }

            if (user) {
                const { data: favData } = await supabase
                    .from('favorites')
                    .select('menu_id')
                    .eq('user_id', user.id)

                if (favData) {
                    const ids = new Set(favData.map(f => f.menu_id))
                    setUserFavorites(ids)
                }
            }

            setLoading(false)
        }
        fetchWeekMenus()
    }, [user])

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Haftalık Plan</h2>
                <p className="text-muted-foreground">Bu haftanın yemek listesi.</p>
            </div>

            <div className="space-y-8">
                {weekMenus.map(({ date, meals }) => (
                    <div key={date.toISOString()} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <h3 className="text-lg font-semibold min-w-fit">
                                {format(date, 'd MMMM EEEE', { locale: tr })}
                            </h3>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="flex flex-col gap-4">
                            {meals.map(meal => (
                                <MealCard
                                    key={meal.id}
                                    {...meal}
                                    initiallyLiked={userFavorites.has(meal.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {loading && <div className="text-center py-12">Yükleniyor...</div>}
        </div>
    )
}
