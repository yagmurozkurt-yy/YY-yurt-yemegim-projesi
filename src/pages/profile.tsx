import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { User, Mail, Bell, Loader2, Save } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { supabase } from "../lib/supabase"

export default function Profile() {
    const { user, profile, refreshProfile } = useAuth()
    const [fullName, setFullName] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (profile) {
            setFullName(`${profile.first_name} ${profile.last_name}`)
        }
    }, [profile])

    const handleSave = async () => {
        if (!user) return
        setLoading(true)
        setMessage(null)

        const names = fullName.trim().split(' ')
        const first_name = names[0] || ""
        const last_name = names.slice(1).join(' ') || ""

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    first_name,
                    last_name
                })

            if (error) throw error

            await refreshProfile()
            setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' })
        } catch (error: any) {
            console.error("Profile save error:", error)
            setMessage({ type: 'error', text: 'Güncelleme başarısız: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
                <p className="text-muted-foreground">Hesap bilgilerinizi yönetin.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Kişisel Bilgiler</CardTitle>
                    <CardDescription>Adınız ve iletişim bilgileriniz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ad Soyad</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ad Soyad"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={user?.email || ""}
                                className="pl-9"
                                disabled
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ayarlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                        <Link to="/settings/notifications">
                            <Bell className="w-4 h-4" />
                            Bildirim Ayarları
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Değişiklikleri Kaydet
                </Button>
            </div>
        </div>
    )
}
