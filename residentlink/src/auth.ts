import { createClient } from "./lib/supabase/server";

export async function getCurrentProfile () {
    // Await the client initialization because cookies() is now async
    const supabase = await createClient();

    // Use getUser() instead of getSession() for server security
    const { data: { session } } = await supabase.auth.getSession();

    // Return null if the user is not authenticated
    if (!session) return null;

    // Safely query the profiles table for the logged-in user
    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

    return data;
}