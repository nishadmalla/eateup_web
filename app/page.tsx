"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function UserHomepage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const role = Cookies.get("role");
        setUserRole(role || null);
    }, []);

    if (!isClient) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans selection:bg-orange-500/30">
            <main className="max-w-6xl mx-auto p-6 md:p-10">
                {/* Hero Banner */}
                <div className="bg-zinc-950 border border-zinc-900 p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden mb-12">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic">
                            Craving Something? <br/>
                            <span className="text-orange-500">We've Got It.</span>
                        </h2>
                        <p className="text-zinc-500 uppercase text-xs font-bold tracking-[0.2em] max-w-md mt-6">
                            Discover the best restaurants, fast delivery, and exclusive deals right to your door.
                        </p>
                    </div>
                    {/* Background Glow Effect */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
                </div>

                {/* Dashboard Widgets (Only visible if logged in) */}
                {userRole && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl hover:border-orange-500/30 transition-all group cursor-pointer">
                            <div className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600/20 transition-colors">
                                <span className="text-xl">🍔</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Browse Food</h3>
                            <p className="text-sm text-zinc-500">Explore local restaurants and their menus.</p>
                        </div>

                        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl hover:border-orange-500/30 transition-all group cursor-pointer">
                            <div className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600/20 transition-colors">
                                <span className="text-xl">🛵</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">My Orders</h3>
                            <p className="text-sm text-zinc-500">Track current deliveries and past history.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}