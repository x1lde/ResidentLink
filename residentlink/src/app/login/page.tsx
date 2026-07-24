"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"
import {  createClient } from "../../lib/supabase/client"

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const { error } = mode === "sign-in"
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });
        if (error) return setError(error.message);
        router.push("/resident/dashboard");
        router.refresh;
    }
    
    return (
        <main className="min-h-screen flex items-center justify-center px=6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border rounded p-6">
                <h1 className="text-2x1 font-semibold">{mode === "sign-in" ? "Sign in" : "Create an account"}</h1>
                <input type="email" required placeholder="Email" value={email}
                onChange = {(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                <input type="password" required minLength={6} placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2"/>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button className="w-full bg-slate-800 text-white rounded py-2">
                    {mode === "sign-in" ? "Sign in" : "Sign up"}
                </button>
                <button type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                    className="w-full text-sm text-slate-500">
                    {mode === "sign-in" ? "Need account? Sign up" : "Have an account? Sign in"}
                </button>
            </form>
        </main>
    );
}