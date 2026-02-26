"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Signup triggered", { name, email, password });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 rounded-2xl shadow-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">Create Account</h1>
                    <p className="text-zinc-500 text-sm tracking-wide">Join Eate Up to start ordering.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    

                    <button 
                        type="submit" 
                        className="w-full bg-white text-black font-bold tracking-wide uppercase py-4 rounded-xl hover:bg-zinc-200 transition-colors mt-4"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline transition-all">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}