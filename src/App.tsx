import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./lib/auth-context"
import { ToastProvider } from "./components/ui/use-toast"
import { Layout } from "./components/layout"

// Page Imports
import AuthPage from "./pages/auth"
import Dashboard from "./pages/dashboard"
import CitySelection from "./pages/city-selection"

import MonthlyList from "./pages/monthly-list"
import Favorites from "./pages/favorites"
import WeeklyPlan from "./pages/weekly-plan"
import NotificationSettings from "./pages/notification-settings"
import SearchPage from "./pages/search"
import Profile from "./pages/profile"
import AdminPanel from "./pages/admin-panel"

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
                <ToastProvider>
                    <Router>
                        <Routes>
                            <Route path="/auth" element={<AuthPage />} />

                            <Route element={<Layout />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/cities" element={<CitySelection />} />
                                <Route path="/monthly" element={<MonthlyList />} />
                                <Route path="/favorites" element={<Favorites />} />
                                <Route path="/weekly" element={<WeeklyPlan />} />
                                <Route path="/settings/notifications" element={<NotificationSettings />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/admin" element={<AdminPanel />} />
                            </Route>
                        </Routes>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
