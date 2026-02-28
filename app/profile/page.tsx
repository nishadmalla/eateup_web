"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [fullName, setFullName] = useState("Loading...");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Placeholder for your backend fetch
        setFullName("John Doe"); 
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        window.location.href = "/login";
    };

    const handleSaveName = async () => {
        setIsLoading(true);
        try {
            // BACKEND CALL GOES HERE
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulating network
            setIsEditingName(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setProfilePic(objectUrl);
            // BACKEND FILE UPLOAD GOES HERE
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative font-sans selection:bg-orange-500/30 pb-12">
            
            <div className="max-w-md mx-auto pt-10 px-6">
                
                {/* 1. Top Navigation Bar (Absolute Positioning for perfect alignment) */}
                <div className="relative flex justify-center items-center w-full mb-10">
                    {/* Back Arrow - Pinned to absolute far left */}
                    <button onClick={() => router.back()} className="absolute left-0 text-white hover:text-zinc-400 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    {/* Center Title - Perfectly centered */}
                    <h1 className="text-xl font-bold tracking-wide">Profile</h1>
                    
                    {/* Right Edit Pencil - Pinned to absolute far right */}
                    <button onClick={() => setIsEditingName(!isEditingName)} className="absolute right-0 text-white hover:text-orange-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                {/* 2. Premium Profile Picture & Name Display */}
                <div className="flex flex-col items-center justify-center mb-12">
                    
                    {/* Avatar */}
                    <div className="relative group cursor-pointer w-32 h-32">
                        {/* Orange Gradient Border */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full p-[3px] shadow-lg shadow-orange-600/20">
                            <label className="relative flex w-full h-full bg-zinc-950 rounded-full overflow-hidden border-4 border-black cursor-pointer">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                        <svg className="w-12 h-12 text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    {/* Display Name */}
                    <div className="mt-5 text-center w-full">
                        {isEditingName ? (
                            <div className="flex flex-col items-center gap-3">
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-xl text-center focus:outline-none focus:border-orange-500 font-bold w-3/4 mx-auto"
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <button onClick={handleSaveName} disabled={isLoading} className="text-orange-500 text-xs font-black uppercase tracking-widest hover:text-orange-400">
                                        {isLoading ? "Saving..." : "Save"}
                                    </button>
                                    <button onClick={() => setIsEditingName(false)} className="text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-zinc-400">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold tracking-wide text-white">{fullName}</h2>
                                {/* Location Pin */}
                                <div className="flex items-center justify-center text-zinc-500 mt-2 text-sm font-medium">
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                                    </svg>
                                    <span>Lalitpur, Nepal</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Extra Details */}
                <div className="space-y-4">
                    {/* Email Card (Read Only) */}
                    <div className="bg-zinc-950/50 border border-zinc-900 p-5 rounded-3xl backdrop-blur-md">
                        <div className="flex justify-between items-center opacity-70">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Email Address</p>
                                <p className="text-zinc-300 font-bold text-sm">user@example.com</p>
                            </div>
                            <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 4. Danger Zone (Logout) */}
                <div className="mt-16">
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white font-black tracking-widest uppercase py-4 rounded-3xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
}