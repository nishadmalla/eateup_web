"use client";

import Link from "next/link";
import { useState } from "react";
import { loginSchema } from "../schemas";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    
    // States for backend connection
    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors when the user tries again
        setErrors({}); 
        setApiError("");
        setIsLoading(true);

        // 1. Validate with Zod first (so we don't spam the backend)
        const result = loginSchema.safeParse({ email, password });
        
        if (!result.success) {
            // Using .flatten() to get the clean field errors
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            });
            setIsLoading(false);
            return;
        }

        // 2. Send valid data to your Express Backend
        try {
            const response = await fetch("http://localhost:5050/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: result.data.email,
                    password: result.data.password,
                }),
            });

            const data = await response.json();

            // 3. Handle Backend Errors (Wrong password, user not found, etc.)
            if (!response.ok) {
                setApiError(data.message || "Invalid credentials. Please try again.");
                setIsLoading(false);
                return;
            }

            // 4. Success! The backend accepted the login.
            console.log("Backend Success! JWT Token:", data);
            
            // TODO: We need to save the token here!
            
            // Redirect the user to the main feed
            window.location.href = "/"; 

        } catch (error) {
            console.error("Backend Connection Error:", error);
            setApiError("Cannot connect to the server. Is your Express backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 rounded-2xl shadow-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">Welcome Back</h1>
                    <p className="text-zinc-500 text-sm tracking-wide">Enter your details to access your account.</p>
                </div>

                {/* API Error Message Box */}
                {apiError && (
                    <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-xl text-center">
                        <p className="text-red-400 text-sm tracking-wide">{apiError}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-black border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'} text-white px-4 py-3 rounded-xl focus:outline-none transition-colors`}
                            placeholder="name@example.com"
                        />
                        {/* Zod Email Error */}
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Password</label>
                            <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-white transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-black border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'} text-white px-4 py-3 rounded-xl focus:outline-none transition-colors`}
                            placeholder="••••••••"
                        />
                        {/* Zod Password Error */}
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold tracking-wide uppercase py-4 rounded-xl hover:bg-zinc-200 transition-colors mt-4 disabled:bg-zinc-600 disabled:text-zinc-400"
                    >
                        {isLoading ? "Verifying..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline transition-all">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}