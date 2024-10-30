'use server'

import { z } from "zod";
import { loginSchema, registerSchema } from "../validation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
    error: string | null;
    success: boolean;
}

export async function signIn(values: z.infer<typeof loginSchema>) {

    const { error } = await createClient().auth.signInWithPassword({
        email: values.email,
        password: values.password,
    })

    if (error) throw error;
}

export async function signUp(values: z.infer<typeof registerSchema>) {

    const supabase = createClient()

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
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw profileError
    }
}

export async function signOut() {

    const { error } = await createClient().auth.signOut();

    if (error) throw error;

}