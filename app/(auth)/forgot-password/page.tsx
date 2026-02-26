"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Reset triggered for", email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 rounded-2xl shadow-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">Reset Password</h1>
                    <p className="text-zinc-500 text-sm tracking-wide">Enter your email to receive a reset link.</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleReset} className="space-y-6">
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
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <div className="text-center p-6 border border-zinc-800 rounded-xl bg-black">
                        <p className="text-white font-medium mb-2">Check your email</p>
                        <p className="text-sm text-zinc-500">If an account exists, we've sent a link to reset your password.</p>
                    </div>
                )}

                <p className="mt-8 text-center text-sm">
                    <Link href="/login" className="text-zinc-500 hover:text-white transition-all uppercase tracking-widest text-xs font-bold">
                        ← Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}