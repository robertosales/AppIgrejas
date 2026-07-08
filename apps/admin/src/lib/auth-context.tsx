import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

type Profile = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  phone: string | null
}

type ChurchUser = {
  church_id: string
  role: string
  church_name: string
}

type AuthContextType = {
  session: Session | null
  user: User | null
  profile: Profile | null
  churchUser: ChurchUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [churchUser, setChurchUser] = useState<ChurchUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setChurchUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, phone')
        .eq('id', userId)
        .single()

      if (profileErr) console.error('profile error:', profileErr)
      if (profile) setProfile(profile)

      const { data: cuList, error: cuErr } = await supabase
        .from('church_users')
        .select('church_id, role')
        .eq('user_id', userId)

      if (cuErr) {
        console.error('church_users error:', cuErr)
      } else if (cuList && cuList.length > 0) {
        const cu = cuList[0]

        const { data: church } = await supabase
          .from('churches')
          .select('name')
          .eq('id', cu.church_id)
          .single()

        setChurchUser({
          church_id: cu.church_id,
          role: cu.role,
          church_name: church?.name ?? 'Igreja',
        })
      } else {
        console.log('No church_users found for user:', userId)
      }
    } catch (err) {
      console.error('fetchProfile error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) return { error: error.message }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
      })

      setProfile({ id: data.user.id, email, full_name: fullName, avatar_url: null, phone: null })

      try {
        const { data: church } = await supabase
          .from('churches')
          .select('id, name')
          .limit(1)
          .maybeSingle()

        if (church) {
          await supabase.from('church_users').insert({
            church_id: church.id,
            user_id: data.user.id,
            role: 'member',
          })

          setChurchUser({
            church_id: church.id,
            role: 'member',
            church_name: church.name,
          })
        }
      } catch {
        // RLS bloqueia consulta a churches para novos usuarios
        // O admin pode vincular manualmente em /admin/settings
      }
    }

    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
    setChurchUser(null)
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, churchUser, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
