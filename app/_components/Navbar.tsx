"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            // Only search if user types 2 or more characters
            if (searchQuery.trim().length < 2) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:5050/api/restaurants/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                
                if (res.ok && data.success) {
                    setResults(data.data || []);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Search failed. Is backend at :5050 running?", error);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <nav className="flex justify-between items-center p-4 md:px-12 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-[100]">
            <Link href="/" className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white shrink-0">
                Eate Up <span className="text-orange-500">.</span>
            </Link>

            <div className="flex-1 max-w-md ml-auto mr-8 hidden md:block relative">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for burger house..." 
                        style={{ paddingLeft: '60px' }} 
                        className="w-full bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-sm py-3 pr-4 rounded-2xl outline-none focus:border-orange-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                </div>

                {/* RESULTS DROPDOWN */}
                {showDropdown && results.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-zinc-950 border border-zinc-900 mt-2 rounded-2xl overflow-hidden shadow-2xl z-[110] animate-in fade-in slide-in-from-top-2">
                        {results.map((res) => (
                            <Link 
                                key={res._id} 
                                href={`/restaurant/${res._id}`}
                                onClick={() => {
                                    setShowDropdown(false);
                                    setSearchQuery("");
                                }}
                                className="flex items-center gap-4 p-4 hover:bg-zinc-900 transition-colors border-b border-zinc-900/50 last:border-0"
                            >
                                <img 
                                    src={res.restaurantImage?.startsWith('http') ? res.restaurantImage : `http://localhost:5050${res.restaurantImage}`} 
                                    className="w-10 h-10 rounded-lg object-cover bg-zinc-900" 
                                    alt=""
                                />
                                <div>
                                    <p className="text-sm font-bold text-white">{res.name}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{res.address}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-all">
                        <svg className="w-5 h-5 text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </Link>
                ) : (
                    <Link href="/login" className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}