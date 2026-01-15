import { Outlet, NavLink } from "react-router-dom"
import { LayoutDashboard, MapPin, Calendar, Utensils, Heart, Search, User, Settings, Shield } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { cn } from "../lib/utils"
import { AuthButton } from "./auth-button"
import { useAuth } from "../lib/auth-context"

const navItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: LayoutDashboard },
    { href: "/cities", label: "Şehirler", icon: MapPin },
    { href: "/monthly", label: "Aylık", icon: Calendar },
    { href: "/favorites", label: "Favoriler", icon: Heart },
    { href: "/weekly", label: "Haftalık", icon: Utensils },
    { href: "/search", label: "Ara", icon: Search },
]

export function Layout() {
    const { isAdmin } = useAuth()

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4 h-screen sticky top-0">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h1 className="text-2xl font-bold text-primary tracking-tight">YY</h1>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <AuthButton />
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="my-4 border-t border-border" />

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )
                        }
                    >
                        <User className="w-5 h-5" />
                        Profilim
                    </NavLink>

                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )
                            }
                        >
                            <Shield className="w-5 h-5" />
                            Admin
                        </NavLink>
                    )}
                </nav>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-20">
                <h1 className="text-xl font-bold text-primary">Yurt Yemeğim</h1>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <AuthButton />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-8">
                <div className="mx-auto max-w-4xl">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around z-20 safe-area-bottom">
                {navItems.slice(0, 5).map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
                {/* Mobile More/Menu could go here, for now restricting to 5 main items in bottom bar */}
            </nav>
        </div>
    )
}
