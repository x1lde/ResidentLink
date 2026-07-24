import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function createMiddlewareClient(request: NextRequest) {
// Initialize the base response
    let response = NextResponse.next({
    request: {
        headers: request.headers,
    },
    });

    const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
        // Map request cookies correctly
        getAll() {
            return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
            }));
        },
        // Sync chunks safely onto both the request and response objects
        setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value); // Keeps internal state fresh
            response.cookies.set({ name, value, ...options }); // Sends to browser
            });
        },
        },
    }
    );

    return { supabase, response };
}
