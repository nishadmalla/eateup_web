"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would call your backend API: /api/auth/forgot-password
        alert(`If an account exists for ${email}, a reset link has been sent to your email.`);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-10 rounded-3xl shadow-2xl">
                <div className="bg-orange-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-orange-500 text-2xl">?</span>
                </div>
                <h2 className="text-white text-xl font-black uppercase mb-3">Forgot Password?</h2>
                <p className="text-zinc-500 text-sm mb-8">No worries! Enter your email and we'll send you a link to reset your password.</p>
                <form onSubmit={handleResetRequest} className="space-y-4">
                    <input type="email" placeholder="Email Address" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500 transition-all" value={email} onChange={e => setEmail(e.target.value)} required />
                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-500 uppercase tracking-widest transition-all">Send Reset Link</button>
                </form>
                <Link href="/login" className="block mt-6 text-zinc-500 text-sm hover:text-white transition-colors uppercase font-bold tracking-tighter">Back to Login</Link>
            </div>
        </div>
    );
}