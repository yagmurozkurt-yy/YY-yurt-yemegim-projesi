import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Search, MapPin } from "lucide-react"

const CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
]

export default function CitySelection() {
    const [search, setSearch] = useState("")
    const [selectedCity, setSelectedCity] = useState("İstanbul")

    const filteredCities = CITIES.filter(city =>
        city.toLowerCase().includes(search.toLocaleLowerCase('tr-TR'))
    )

    const handleSelect = (city: string) => {
        setSelectedCity(city)
        localStorage.setItem('selectedCity', city)
        console.log("Selected city:", city)
        // Navigate to monthly list (optional, but good UX)
        // window.location.href = '/monthly' 
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Şehir Seçimi</h2>
                <p className="text-muted-foreground">Yemek listesini görmek istediğiniz ili seçiniz.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="İl ara..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {filteredCities.map(city => (
                            <Button
                                key={city}
                                variant={selectedCity === city ? "default" : "outline"}
                                className={selectedCity === city ? "bg-primary text-white hover:bg-primary/90" : ""}
                                onClick={() => handleSelect(city)}
                            >
                                {selectedCity === city && <MapPin className="w-4 h-4 mr-2" />}
                                {city}
                            </Button>
                        ))}
                        {filteredCities.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                Şehir bulunamadı.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
