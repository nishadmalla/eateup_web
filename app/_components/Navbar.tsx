"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            setIsLoggedIn(true);
            // Example: setProfilePic(localStorage.getItem("profilePic"));
        }
    }, []);

    return (
        <nav className="flex justify-between items-center p-6 md:px-12 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
            
            <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter text-white">
                Eate Up <span className="text-orange-500">.</span>
            </Link>
            
            <div className="flex items-center">
                {isLoggedIn ? (
                    /* Only the Profile Picture shows when logged in */
                    <Link href="/profile" className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-zinc-800 hover:border-orange-500 transition-all shadow-lg">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </Link>
                ) : (
                    /* Super clean logged-out state */
                    <Link href="/login" className="text-xs font-bold uppercase text-zinc-400 hover:text-white transition-colors py-2 tracking-widest">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}