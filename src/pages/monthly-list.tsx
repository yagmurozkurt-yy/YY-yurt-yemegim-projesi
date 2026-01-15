
import { useEffect, useState, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ChevronLeft, ChevronRight, Search, Sun, Moon } from "lucide-react"
import { supabase } from "../lib/supabase"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
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

export default function MonthlyList() {
    const { user } = useAuth()
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
    const [menus, setMenus] = useState<Menu[]>([])
    const [city, setCity] = useState("İstanbul")
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState<"ALL" | "Kahvaltı" | "Akşam">("ALL")
    const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set())

    useEffect(() => {
        const storedCity = localStorage.getItem('selectedCity')
        if (storedCity) setCity(storedCity)
    }, [])

    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true)
            const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
            const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')

            const { data, error } = await supabase
                .from('menus')
                .select('*')
                .eq('city', city)
                .gte('date', start)
                .lte('date', end)

            if (error) {
                console.error('Error fetching menus:', error)
            } else {
                // Deduplicate explicitly
                const unique = (data || []).reduce((acc: Menu[], current: Menu) => {
                    const exists = acc.find(item => item.date === current.date && item.meal_type === current.meal_type);
                    if (!exists) {
                        return acc.concat([current]);
                    }
                    return acc;
                }, []);

                const safeData = unique.filter((m: Menu) => m.meal_type === 'Kahvaltı' || m.meal_type === 'Akşam' || m.meal_type === 'Akşam Yemeği');
                setMenus(safeData)
            }

            // Fetch favorites if user logged in
            if (user) {
                const { data: favData } = await supabase
                    .from('favorites')
                    .select('food_id')
                    .eq('user_id', user.id)

                if (favData) {
                    const ids = new Set(favData.map(f => f.food_id))
                    setUserFavorites(ids)
                }
            }

            setLoading(false)
        }
        fetchMenus()
    }, [currentDate, city, user])

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    })

    // Filter Logic
    const processedDays = useMemo(() => {
        try {
            let matchingDays = days;

            // 1. Search Filter
            if (searchQuery.trim().length > 0) {
                matchingDays = days.filter(day => {
                    const dayMenus = menus.filter(m => {
                        if (!m.date) return false
                        const d = new Date(m.date)
                        return !isNaN(d.getTime()) && isSameDay(d, day)
                    })
                    return dayMenus.some(m => parseContent(m.content).toLowerCase().includes(searchQuery.toLowerCase()))
                })
            }

            return matchingDays.map(day => {
                const dayMenus = menus.filter(m => {
                    if (!m.date) return false
                    const d = new Date(m.date)
                    return !isNaN(d.getTime()) && isSameDay(d, day)
                })

                // 2. Meal Type Filter
                let displayMenus = dayMenus
                if (activeFilter !== "ALL") {
                    displayMenus = displayMenus.filter(m => {
                        const type = m.meal_type === 'Akşam Yemeği' ? 'Akşam' : m.meal_type;
                        return type === activeFilter
                    })
                }

                // 3. Search Highlights
                if (searchQuery.trim().length > 0) {
                    displayMenus = displayMenus.filter(m => parseContent(m.content).toLowerCase().includes(searchQuery.toLowerCase()))
                }

                return { day, displayMenus }
            }).filter(item => item.displayMenus.length > 0)
        } catch (err) {
            console.error("Filter error:", err)
            return []
        }

    }, [days, menus, searchQuery, activeFilter])

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
            {/* Header & Month Nav */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl shadow-sm border">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-center md:text-left">{city} Yemek Listesi</h2>
                    <p className="text-muted-foreground text-sm text-center md:text-left">Aylık Plan</p>
                </div>

                <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-lg">
                    <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-5 w-5" /></Button>
                    <span className="font-semibold text-lg w-[160px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: tr })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-5 w-5" /></Button>
                </div>
            </div>

            {/* Smart Search & Quick Filters */}
            <div className="sticky top-0 bg-background/95 backdrop-blur z-20 py-4 border-b space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Akıllı Arama... (Örn: 'Mercimek', 'Yumurta')"
                        className="pl-10 h-11 text-base shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={activeFilter === "ALL" ? "default" : "secondary"}
                        onClick={() => setActiveFilter("ALL")}
                        className="flex-1"
                    >
                        Tümü
                    </Button>
                    <Button
                        variant={activeFilter === "Kahvaltı" ? "default" : "secondary"}
                        onClick={() => setActiveFilter("Kahvaltı")}
                        className="flex-1 gap-2"
                    >
                        <Sun className="w-4 h-4 text-orange-400" />
                        Kahvaltı
                    </Button>
                    <Button
                        variant={activeFilter === "Akşam" ? "default" : "secondary"}
                        onClick={() => setActiveFilter("Akşam")}
                        className="flex-1 gap-2"
                    >
                        <Moon className="w-4 h-4 text-blue-400" />
                        Akşam
                    </Button>
                </div>
            </div>

            {/* Result List */}
            <div className="space-y-6 pb-20">
                {processedDays.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">Sonuç bulunamadı.</p>
                        <p className="text-sm">Farklı bir arama terimi veya filtre deneyin.</p>
                    </div>
                )}

                {processedDays.map(({ day, displayMenus }) => (
                    <div key={day.toISOString()} className="relative pl-4 md:pl-0">
                        {/* Timeline Line (Desktop) */}
                        <div className="hidden md:block absolute left-[-20px] top-0 bottom-0 w-[2px] bg-border" />
                        <div className="hidden md:block absolute left-[-26px] top-6 w-3.5 h-3.5 rounded-full bg-primary border-4 border-background" />

                        <div className="mb-3 flex items-center gap-2">
                            <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md text-sm">
                                {format(day, 'd MMMM', { locale: tr })}
                            </div>
                            <div className="text-muted-foreground text-sm font-medium">
                                {format(day, 'EEEE', { locale: tr })}
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {displayMenus.map((menu) => (
                                <MealCard
                                    key={menu.id}
                                    {...menu}
                                    initiallyLiked={userFavorites.has(menu.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg shadow-lg">Yükleniyor...</div>
                </div>
            )}
        </div>
    )
}
