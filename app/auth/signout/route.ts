import { signOut } from "@/lib/actions/auth.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const result = await signOut();

        if (result.error) {
            console.error('Auth confirmation error:', result.error);
            return NextResponse.redirect(
                new URL(`/auth/error?message=${encodeURIComponent(result.error)}`, request.url)
            );
        }
        return NextResponse.redirect(new URL('/', request.url));
    } catch (error: any) {
        console.error('Sign out error:', error)
    }
}