'use server'

import { z } from "zod";
import { loginSchema, registerSchema } from "../validation";
import { cookies } from "next/headers";
import { AuthError } from "@supabase/supabase-js";
import { createClient } from '../supabase/server';

export type AuthResult = {
    error: string | null;
    success: boolean;
}

export async function signIn(values: z.infer<typeof loginSchema>): Promise<AuthResult> {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })

        if (error) {
            return {
                error: error.message,
                success: false,
            }
        }

        return {
            error: null,
            success: true,
        }
    } catch (error) {
        console.error('Sign in error:', error)
        return {
            error: error instanceof AuthError ? error.message : 'An unexpected error occurred',
            success: false,
        }
    }
}

export async function signUp(values: z.infer<typeof registerSchema>): Promise<AuthResult> {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        // Begin transaction by signing up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    first_name: values.firstName,
                    last_name: values.lastName,
                    phone: values.phoneNumber,
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
            },
        })

        if (authError) {
            throw authError
        }

        if (!authData.user) {
            throw new Error('User creation failed')
        }

        // Insert user profile data
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                email: values.email,
                phone_number: values.phoneNumber,
                first_name: values.firstName,
                last_name: values.lastName,
            })

        if (profileError) {
            // If profile creation fails, clean up the auth user
            await supabase.auth.admin.deleteUser(authData.user.id)
            throw profileError
        }

        return {
            error: null,
            success: true,
        }
    } catch (error) {
        console.error('Sign up error:', error)
        return {
            error: error instanceof AuthError ? error.message : 'An unexpected error occurred',
            success: false,
        }
    }
}

export async function signOut(): Promise<AuthResult> {
    try {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to sign out')
        }

        return {
            error: null,
            success: true,
        }
    } catch (error) {
        console.error('Sign out error:', error)
        return {
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            success: false,
        }
    }
}