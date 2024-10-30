'use server'

import { z } from "zod";
import { loginSchema, registerSchema } from "../validation";
import { cookies } from "next/headers";
import { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

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

        const { data: existingUserEmail } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', values.email)
            .single();
        if (existingUserEmail) throw new Error('A user with that email already exists')

        const { data: existingUserPhone } = await supabase
            .from('profiles')
            .select('id')
            .eq('phone_number', values.email)
            .single();
        if (existingUserPhone) throw new Error('A user with that phone number already exists')

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    first_name: values.firstName,
                    last_name: values.lastName,
                },
            },
        })

        if (authError) throw authError

        if (!authData.user) throw new Error('User creation failed')

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
            error: (error as Error).message,
            success: false,
        }
    }
}

export async function signOut(): Promise<AuthResult> {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.signOut();

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
        console.error('Sign out error:', error)
        return {
            error: error instanceof AuthError ? error.message : 'An unexpected error occurred',
            success: false,
        }
    }
}