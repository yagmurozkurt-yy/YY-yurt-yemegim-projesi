import { useState, useEffect } from "react"
import { Input } from "../components/ui/input"
import { Search } from "lucide-react"
import { supabase } from "../lib/supabase"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { parseContent } from "../lib/utils"
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

export default function SearchPage() {
    const { user } = useAuth()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Menu[]>([])
    const [loading, setLoading] = useState(false)
    const [allMenus, setAllMenus] = useState<Menu[]>([])
    const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set())

    useEffect(() => {
        const fetchAllMenus = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('menus')
                .select('*')
                .gte('date', '2026-01-01')
                .lte('date', '2026-12-31')
                .eq('city', 'İstanbul')

            if (!error && data) {
                // Deduplicate results based on date + meal_type
                const unique = data.reduce((acc: Menu[], current: Menu) => {
                    const exists = acc.find(item => item.date === current.date && item.meal_type === current.meal_type);
                    if (!exists) {
                        return acc.concat([current]);
                    }
                    return acc;
                }, []);
                setAllMenus(unique)
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
        fetchAllMenus()
    }, [user])

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([])
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = allMenus.filter(menu => {
            const content = parseContent(menu.content).toLowerCase()
            return content.includes(lowerQuery)
        })
        setResults(filtered)
    }, [query, allMenus])

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Yemek Ara</h2>
                <p className="text-muted-foreground">Tüm yılın menülerinde arama yapın.</p>
            </div>

            <div className="sticky top-0 bg-background/95 backdrop-blur z-20 py-4 border-b space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Yemek ismi girin... (Örn: 'Kuru Fasulye')"
                        className="pl-10 h-12 text-lg shadow-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4 pb-20">
                {results.map((menu) => (
                    <div key={menu.id} className="block group">
                        <div className="mb-2 pl-1">
                            <div className="text-sm font-medium text-muted-foreground">
                                {format(new Date(menu.date), 'd MMMM yyyy, EEEE', { locale: tr })}
                            </div>
                        </div>
                        <MealCard
                            {...menu}
                            initiallyLiked={userFavorites.has(menu.id)}
                        />
                    </div>
                ))}

                {query.length > 0 && results.length === 0 && !loading && (
                    <div className="text-center py-16 text-muted-foreground">
                        <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">Sonuç bulunamadı.</p>
                        <p className="text-sm">Farklı bir arama terimi deneyin.</p>
                    </div>
                )}

                {query.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground opacity-50">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Arama yapmak için yazmaya başlayın.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
