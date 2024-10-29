import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check local storage for existing user to prevent flickering
    const cachedUser = localStorage.getItem('user')
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
      setLoading(false) // Stop loading if user exists in cache
    }

    const initializeAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)) // Cache user data
      } else {
        localStorage.removeItem('user')
      }
      setLoading(false)
    }

    // Only fetch user if not cached
    if (!cachedUser) {
      initializeAuth()
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        localStorage.setItem('user', JSON.stringify(session.user))
      } else {
        localStorage.removeItem('user')
      }
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return { user, loading }
}
