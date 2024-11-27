import { signOut } from "@/lib/actions/auth.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await signOut().then(() => {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        });
    } catch (error: any) {
        console.error('Sign out error:', error)
        return NextResponse.redirect(
            new URL(`/auth/error?message=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}