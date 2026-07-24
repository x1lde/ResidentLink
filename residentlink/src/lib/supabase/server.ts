import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    // Await cookies() for modern Next.js environments
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Use getAll to retrieve all session cookies
                getAll() {
                    return cookieStore.getAll();
                },
                // Use setAll to handle setting and removing cookies safely
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The Server Component can safely ignore failed cookie modifications
                    }
                },
            },
        }
    );
}
