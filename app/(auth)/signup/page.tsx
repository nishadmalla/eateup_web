"use client";

import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { signupSchema } from "../schemas";

export default function SignUpPage() {
    // 🛑 ALL 5 STATES MUST BE HERE! 
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [errors, setErrors] = useState<{ fullName?: string; username?: string; email?: string; password?: string; confirmPassword?: string }>({});
    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); 
        setApiError("");
        setIsLoading(true);

        const result = signupSchema.safeParse({ fullName, username, email, password, confirmPassword });
        
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                fullName: fieldErrors.fullName?.[0],
                username: fieldErrors.username?.[0],
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5050/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: result.data.fullName,
                    username: result.data.username,
                    email: result.data.email,
                    password: result.data.password,
                    confirmPassword: result.data.confirmPassword, // Express needs this!
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = "Registration failed. Please try again.";
                if (typeof data.message === "string") {
                    errorMessage = data.message;
                } else if (Array.isArray(data.message)) {
                    errorMessage = data.message[0]?.message || "Validation error.";
                } else if (Array.isArray(data.errors)) {
                    errorMessage = data.errors[0]?.message || "Validation error.";
                } else if (data.message?.message) {
                    errorMessage = data.message.message;
                } else if (Array.isArray(data)) {
                    errorMessage = data[0]?.message || "Validation error.";
                }

                setApiError(errorMessage);
                setIsLoading(false);
                return;
            }

            if (data.token) {
                Cookies.set("token", data.token, { 
                    expires: 7, 
                    secure: process.env.NODE_ENV === "production", 
                    sameSite: "strict"
                });
            }
            
            // Success! Redirect to home
            window.location.href = "/"; 

        } catch (error) {
            setApiError("Server connection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-6 py-12">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 rounded-2xl shadow-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">Create Account</h1>
                    <p className="text-zinc-500 text-sm tracking-wide">Join Eate Up to start ordering.</p>
                </div>

                {apiError && (
                    <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-xl text-center">
                        <p className="text-red-400 text-sm tracking-wide">{apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Full Name</label>
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`w-full bg-black border ${errors.fullName ? 'border-red-500/50' : 'border-zinc-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors`}
                            placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full bg-black border ${errors.username ? 'border-red-500/50' : 'border-zinc-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors`}
                            placeholder="johndoe99"
                        />
                        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-black border ${errors.email ? 'border-red-500/50' : 'border-zinc-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors`}
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-black border ${errors.password ? 'border-red-500/50' : 'border-zinc-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-black border ${errors.confirmPassword ? 'border-red-500/50' : 'border-zinc-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-orange-600 text-white font-bold tracking-wide uppercase py-4 rounded-xl hover:bg-orange-500 transition-colors mt-4 disabled:bg-zinc-600 disabled:text-zinc-400"
                    >
                        {isLoading ? "Processing..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-orange-500 hover:text-orange-400 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}