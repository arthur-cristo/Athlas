'use server'

import { z } from "zod";
import { loginSchema, registerSchema } from "../validation";
import { supabase } from "../supabase/client";
import { cookies } from "next/headers";
import { AuthError } from "@supabase/supabase-js";

export type AuthResult = {
    error: string | null;
    success: boolean;
}

export async function signIn(values: z.infer<typeof loginSchema>): Promise<AuthResult> {

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password
        })

        if (error) {
            return { error: error.message, success: false }
        }

        return { error: null, success: true }
    } catch (error) {
        console.error('Sign in error:', error)
        return {
            error: error instanceof AuthError ? error.message : 'An unexpected error occurred',
            success: false
        }
    }
}

export async function signUp(values: z.infer<typeof registerSchema>): Promise<AuthResult> {

    try {
        const { data: user, error: authError } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            phone: values.phoneNumber,
            options: {
                data: {
                    first_name: values.firstName,
                    last_name: values.lastName,
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm`,
            },
        })

        if (authError) {
            return { error: authError.message, success: false }
        }

        if (!user.user) {
            return { error: 'User creation failed', success: false }
        }

        const { error: dbError } = await supabase.from('profiles').insert({
            id: user.user.id,
            email: values.email,
            phone_number: values.phoneNumber,
            first_name: values.firstName,
            last_name: values.lastName,
        })

        if (dbError) {
            await supabase.auth.admin.deleteUser(user.user.id);
            return { error: dbError.message, success: false }
        }

        return { error: null, success: true }
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            error: error instanceof AuthError ? error.message : 'An unexpected error occurred',
            success: false,
        };
    }
}