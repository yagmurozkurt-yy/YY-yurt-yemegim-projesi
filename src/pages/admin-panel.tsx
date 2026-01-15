
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useState } from "react"
import { Upload, Save } from "lucide-react"
import { useAuth } from "../lib/auth-context"
import { Navigate } from "react-router-dom"

export default function AdminPanel() {
    const { isAdmin, loading, user } = useAuth()
    const [date, setDate] = useState("")
    const [city, setCity] = useState("İstanbul")

    if (loading) return <div>Yükleniyor...</div>

    // Strict Guard: Only 'yagmurozkurt013@gmail.com' can access
    if (!user || !isAdmin) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Veri Paneli</h2>
                <p className="text-muted-foreground">Sisteme yeni yemek listeleri yükleyin veya düzenleyin.</p>
                <div className="bg-green-50 text-green-700 p-2 rounded border border-green-200 text-sm">
                    Admin Hesabı Doğrulandı: {user.email}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Hızlı Menü Ekle</CardTitle>
                        <CardDescription>Tek bir gün için menü girişi.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tarih</label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şehir</label>
                            <Input value={city} onChange={e => setCity(e.target.value)} />
                        </div>

                        {/* Breakfast Inputs */}
                        <div className="p-4 border rounded-md bg-muted/20 space-y-3">
                            <h4 className="font-semibold text-sm">Kahvaltı</h4>
                            <Input placeholder="Menü İçeriği (Örn: Peynir, Zeytin, Reçel...)" />
                            <Input placeholder="Kalori (Örn: 600-800 kcal)" />
                        </div>

                        {/* Dinner Inputs */}
                        <div className="p-4 border rounded-md bg-muted/20 space-y-3">
                            <h4 className="font-semibold text-sm">Akşam Yemeği</h4>
                            <Input placeholder="Menü İçeriği (Örn: Çorba, Ana Yemek, Pilav...)" />
                            <Input placeholder="Kalori (Örn: 800-1000 kcal)" />
                        </div>

                        <Button className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Toplu Yükleme</CardTitle>
                        <CardDescription>Excel veya JSON dosyası ile aylık liste yükle.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">Dosyayı buraya sürükleyin</h3>
                            <p className="text-sm text-muted-foreground">veya seçmek için tıklayın (.xlsx, .json)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
