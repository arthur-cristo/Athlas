import { signOut } from "@/lib/actions/auth.actions";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const result = await signOut();
    if (result.error) throw new Error(result.error);
    return NextResponse.redirect(new URL('/', request.url));
}