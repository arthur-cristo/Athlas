import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client configured for server-side usage.
 * This client automatically handles cookie management and authentication state.
 * 
 * @param cookieStore - Next.js cookie store from headers
 * @returns Supabase client instance configured for server-side use
 */
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Get a cookie from the Next.js cookie store
         */
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        /**
         * Set a cookie in the Next.js cookie store
         */
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle edge cases where cookies cannot be set
            console.error('Error setting cookie:', error)
          }
        },
        /**
         * Remove a cookie from the Next.js cookie store
         */
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Handle edge cases where cookies cannot be removed
            console.error('Error removing cookie:', error)
          }
        },
      },
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
      },
    }
  )
}

/**
 * Helper function to get the current user server-side
 * Usage: const user = await getCurrentUser()
 */
export async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}

/**
 * Helper function to check if a user is authenticated server-side
 * Usage: const isAuthenticated = await isUserAuthenticated()
 */
export async function isUserAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Helper function to get the current session server-side
 * Usage: const session = await getCurrentSession()
 */
export async function getCurrentSession() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error fetching session:', error)
    return null
  }

  return session
}