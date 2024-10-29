import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const { searchParams } = new URL(request.url);
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type') as EmailOtpType | null;
        const next = searchParams.get('next') || '/login';

        // Validate required parameters
        if (!token_hash || !type) {
            return NextResponse.redirect(
                new URL('/auth/error?message=Missing required parameters', request.url)
            );
        }

        // Verify the OTP token
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (error) {
            console.error('Auth confirmation error:', error);
            return NextResponse.redirect(
                new URL(`/auth/error?message=${encodeURIComponent(error.message)}`, request.url)
            );
        }

        // Successful verification - redirect to the next page
        return NextResponse.redirect(new URL(next, request.url));
    } catch (error) {
        console.error('Unexpected error during auth confirmation:', error);
        return NextResponse.redirect(
            new URL('/auth/error?message=An unexpected error occurred', request.url)
        );
    }
}