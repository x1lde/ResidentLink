import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Get our configured client and mutable response
    const { supabase, response } = createMiddlewareClient(request);

  // ALWAYS use getUser() in middleware for security and token refresh
    const { data: { user } } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isProtected = path.startsWith("/resident") || path.startsWith("/board");

  // User is not logged in -> Send to login, but KEEP updated cookies!
    if (isProtected && !user) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    // Copy updated cookies so they don't get lost
    response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
    }

  // Role checking for the board admin route
    if (user && path.startsWith("/board")) {
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "board_admin") {
        const redirectResponse = NextResponse.redirect(new URL("/resident/dashboard", request.url));
      // Copy updated cookies so they don't get lost
        response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
        });
        return redirectResponse;
    }
    }

  // Everything is fine, return our response containing fresh cookies
    return response;
}

export const config = { matcher: ["/resident/:path*", "/board/:path*"] };
