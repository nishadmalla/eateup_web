"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5050/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                Cookies.set("token", data.token, { expires: 7 });
                Cookies.set("role", data.user.role, { expires: 7 });
                window.location.href = data.user.role === "admin" ? "/admin/dashboard" : "/";
            } else {
                alert(data.message);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-10 rounded-3xl shadow-2xl">
                <h1 className="text-white text-2xl font-black uppercase tracking-widest mb-8 text-center">Eate Up Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500" onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-2xl outline-none focus:border-orange-500" onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-widest">Sign In</button>
                </form>
            </div>
        </div>
    );
}