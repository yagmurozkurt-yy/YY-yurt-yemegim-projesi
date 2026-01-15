
import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"

type Profile = {
    first_name: string
    last_name: string
}

type AuthContextType = {
    user: User | null
    session: Session | null
    profile: Profile | null
    loading: boolean
    isAdmin: boolean
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ user: null, session: null, profile: null, loading: true, isAdmin: false, signOut: async () => { }, refreshProfile: async () => { } })

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            checkAdmin(session?.user)
            if (session?.user) fetchProfile(session.user.id)
            else setLoading(false)
        })

        // Listen for changes on auth state (sing in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            checkAdmin(session?.user)
            if (session?.user) fetchProfile(session.user.id)
            else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId: string) => {
        try {
            console.log("Fetching profile for:", userId)
            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', userId)
                .single() // This might fail if no row exists (returns error code PGRST116)

            if (error) {
                console.error("Error fetching profile:", error)
                // If 406 or no rows, we simply have no profile yet.
            }

            if (data) {
                console.log("Profile data found:", data)
                setProfile(data)
            } else {
                console.warn("No profile found for user.")
                // Potentially could retry or set default
            }
        } catch (err) {
            console.error("Unexpected error in fetchProfile:", err)
        } finally {
            setLoading(false)
        }
    }

    const checkAdmin = (user: User | null | undefined) => {
        if (user && user.email === 'yagmurozkurt013@gmail.com') {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setProfile(null)
    }

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id)
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, isAdmin, signOut, refreshProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
