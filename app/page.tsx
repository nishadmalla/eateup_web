"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // You can fetch the user's specific orders or profile here
        const userRole = Cookies.get("role");
        setUser({ role: userRole, name: "Foodie Friend" });
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <nav className="flex justify-between items-center mb-10 border-b border-zinc-900 pb-6">
                <h1 className="text-2xl font-black italic uppercase">Eate Up <span className="text-orange-500">.</span></h1>
                <button onClick={handleLogout} className="bg-zinc-900 px-6 py-2 rounded-xl text-xs font-bold uppercase hover:text-red-500 transition-all">Logout</button>
            </nav>

            <div className="max-w-4xl mx-auto">
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl">
                    <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
                    <p className="text-zinc-500 uppercase text-xs tracking-widest">Your Account Type: <span className="text-orange-500">{user?.role}</span></p>
                    
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                            <h3 className="font-bold mb-2">My Orders</h3>
                            <p className="text-sm text-zinc-500">You haven't placed any orders yet. Hungry?</p>
                        </div>
                        <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                            <h3 className="font-bold mb-2">Favorite Restaurants</h3>
                            <p className="text-sm text-zinc-500">Save your top spots here for quick access.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}