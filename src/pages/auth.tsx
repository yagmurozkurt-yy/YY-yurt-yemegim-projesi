import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { supabase } from "../lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const navigate = useNavigate()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                console.log("Attempting login with:", email)
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                console.log("Login Result:", { data, error })
                if (error) throw error
            } else {
                console.log("Attempting sign up with:", email)
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                        }
                    }
                })

                if (error) throw error
                console.log("Sign Up Result:", data)

                // Create profile if user signup successful and we have a user
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert([
                            {
                                id: data.user.id,
                                first_name: firstName,
                                last_name: lastName
                            }
                        ])

                    if (profileError) {
                        console.error("Profile creation failed:", profileError)
                        // Don't block auth flow on profile error, but log it.
                        // Ideally we show a warning.
                        setErrorMsg("Hesap oluşturuldu ancak profil bilgileri kaydedilemedi: " + profileError.message)
                    }
                }

                // Check if session is missing (Email confirmation required)
                if (data.user && !data.session) {
                    setErrorMsg("Kayıt başarılı! Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin.")
                    setLoading(false)
                    return
                }
            }

            // Navigate to dashboard on success if we have a session (handled by AuthContext state change usually, but we force it here)
            console.log("Auth successful, navigating to dashboard...")
            navigate("/dashboard")

        } catch (error: any) {
            console.error("Auth Error:", error)
            setErrorMsg(error.message || "Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md animate-in fade-in duration-500">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">YY</CardTitle>
                    <CardDescription>
                        {isLogin ? "Hesabınıza giriş yapın" : "Yeni bir hesap oluşturun"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {errorMsg && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium leading-none">Ad</label>
                                    <Input
                                        id="firstName"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Adınız"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium leading-none">Soyad</label>
                                    <Input
                                        id="lastName"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Soyadınız"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Şifre</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-muted-foreground">
                        {isLogin ? "Hesabınız yok mu? Kayıt olun" : "Zaten hesabınız var mı? Giriş yapın"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
