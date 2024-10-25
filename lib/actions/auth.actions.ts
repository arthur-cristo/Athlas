'use server'

import { z } from "zod";
import { loginSchema } from "../validation";
import { supabase } from "../supabase/client";

export async function signIn(values: z.infer<typeof loginSchema>) {

    const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
    })

    return error

}