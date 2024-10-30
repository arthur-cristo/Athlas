import { signOut } from "@/lib/actions/auth.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const result = await signOut();

        if (result.error) throw new Error(result.error);
        return NextResponse.redirect(new URL('/', request.url));
    } catch (error: any) {
        console.error('Sign out error:', error)
        return NextResponse.redirect(
            new URL(`/auth/error?message=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}