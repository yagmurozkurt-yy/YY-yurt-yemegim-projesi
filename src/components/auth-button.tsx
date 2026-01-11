import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function AuthButton() {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()

    if (user) {
        return (
            <div className="flex items-center gap-4">
                {profile && (
                    <span className="text-sm font-medium hidden md:inline-block">
                        Hoş geldin, {profile.first_name} {profile.last_name}
                    </span>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                            <User className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{profile ? `${profile.first_name} ${profile.last_name}` : 'Kullanıcı'}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            Profilim
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()}>
                            Çıkış Yap
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    return (
        <Button onClick={() => navigate("/auth")} size="sm">
            Oturum Aç
        </Button>
    )
}
