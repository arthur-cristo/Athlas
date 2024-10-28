import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        
        // Get current session state
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
            console.error('Session retrieval error:', sessionError)
            return NextResponse.json(
                { error: 'Failed to retrieve session' },
                { status: 500 }
            )
        }

        // Only attempt sign out if there's an active session
        if (session) {
            const { error: signOutError } = await supabase.auth.signOut()
            
            if (signOutError) {
                console.error('Sign out error:', signOutError)
                return NextResponse.json(
                    { error: 'Failed to sign out' },
                    { status: 500 }
                )
            }
        }

        // Clear cookies and revalidate
        cookieStore.getAll().forEach(cookie => {
            cookieStore.delete(cookie.name)
        })
        revalidatePath('/', 'layout')

        // Redirect to login page
        return NextResponse.redirect(new URL('/auth/login', req.url), {
            status: 302,
        })
    } catch (error) {
        console.error('Unexpected error during sign out:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}