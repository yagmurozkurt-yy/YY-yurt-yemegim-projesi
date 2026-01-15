import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
// Would normally use a Switch component here, but will style a checkbox or button for simplicity if switch not available
// Actually I'll create a simple Switch-like button since I didn't install the Switch component details.
import { Button } from "../components/ui/button"
import { useState } from "react"
import { BellRing, Moon } from "lucide-react"

function SwitchItem({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked)
    return (
        <div className="flex items-center justify-between space-x-2 py-4">
            <div className="space-y-0.5">
                <h3 className="font-medium text-base">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
                variant={checked ? "default" : "outline"}
                onClick={() => setChecked(!checked)}
                className={checked ? "bg-primary" : ""}
                size="sm"
            >
                {checked ? "Açık" : "Kapalı"}
            </Button>
        </div>
    )
}

export default function NotificationSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Bildirim Ayarları</h2>
                <p className="text-muted-foreground">Hangi durumlarda bildirim almak istediğinizi seçin.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BellRing className="w-5 h-5 text-primary" />
                        <CardTitle>Yemek Hatırlatıcıları</CardTitle>
                    </div>
                    <CardDescription>Favori yemekleriniz menüde çıktığında haberdar olun.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SwitchItem
                        title="Favori Yemeğim Çıktı"
                        description="Favori listenizdeki bir yemek o günkü menüde varsa sabah bildirim gönder."
                        defaultChecked={true}
                    />
                    <Separator />
                    <SwitchItem
                        title="Günlük Menü Özeti"
                        description="Her sabah günün menüsünü bildirim olarak gönder."
                        defaultChecked={false}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Moon className="w-5 h-5 text-blue-500" />
                        <CardTitle>Akşam Yemeği</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <SwitchItem
                        title="Akşam Yemeği Başladı"
                        description="Akşam yemeği saati başladığında hatırlat (17:00)."
                        defaultChecked={true}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
