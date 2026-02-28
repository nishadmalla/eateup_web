"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5050/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, confirmPassword: form.password }),
            });

            if (res.ok) {
                alert("Account created successfully! Please login.");
                router.push("/login");
            } else {
                const data = await res.json();
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-10 rounded-3xl shadow-2xl">
                <h2 className="text-white text-2xl font-black uppercase mb-8 text-center tracking-widest italic">Join Eate Up</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500 transition-all" onChange={e => setForm({...form, fullName: e.target.value})} required />
                    <input type="text" placeholder="Username" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500 transition-all" onChange={e => setForm({...form, username: e.target.value})} required />
                    <input type="email" placeholder="Email Address" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500 transition-all" onChange={e => setForm({...form, email: e.target.value})} required />
                    <input type="password" placeholder="Create Password" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500 transition-all" onChange={e => setForm({...form, password: e.target.value})} required />
                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-500 uppercase tracking-widest shadow-lg shadow-orange-600/20 transition-all">Sign Up</button>
                </form>
                <p className="text-zinc-500 text-center mt-6 text-sm">Already a member? <Link href="/login" className="text-orange-500 font-bold hover:underline">Login here</Link></p>
            </div>
        </div>
    );
}