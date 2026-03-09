"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import RestaurantCard from "./_components/RestaurantCard";
import { useRouter } from "next/navigation";

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    description?: string;
    restaurantImage?: string;
}

export default function UserHomepage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        const role = Cookies.get("role");
        setUserRole(role || null);

        const fetchRestaurants = async () => {
            try {
                const res = await fetch("http://localhost:5050/api/restaurants"); 
                if (res.ok) {
                    const data = await res.json();
                    setRestaurants(data.data || data);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (!isClient) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
            {/* Background Glows for Depth */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-900/20 rounded-full blur-[120px]" />
            </div>

            <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                
                {/* Hero Section - Refined with Glassmorphism */}
                <div className="relative bg-gradient-to-br from-zinc-900/40 to-black border border-white/5 p-10 md:p-20 rounded-[3rem] shadow-2xl mb-16 overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-600/10 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-orange-600/20">
                            Fast Delivery & Fresh Food
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9] italic">
                            Craving <br/> Something? <br/>
                            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">We've Got It.</span>
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed max-w-sm mt-4">
                            Discover the best restaurants, fast delivery, and exclusive deals right to your door.
                        </p>
                    </div>
                    {/* Abstract Decorative Element */}
                    <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px] hidden md:block" />
                </div>

                {/* My Orders Quick Link - Enhanced Interaction */}
                {userRole && (
                    <div className="mb-16">
                        <button 
                            onClick={() => router.push('/profile/orders')}
                            className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800 p-4 rounded-[2rem] hover:border-orange-500/40 hover:bg-zinc-900 transition-all group flex items-center gap-6 pr-12 shadow-xl"
                        >
                            <div className="bg-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.3)] group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🛵</span>
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-black uppercase tracking-tight">Active Orders</h3>
                                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest opacity-80">Track delivery status</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Section Title */}
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        Local Spots <span className="text-orange-500">.</span>
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                </div>

                {/* Restaurants Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 bg-zinc-900/50 rounded-[2.5rem] animate-pulse border border-zinc-800" />
                        ))}
                    </div>
                ) : restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurants.map((restaurant) => (
                            <div key={restaurant._id} className="hover:-translate-y-2 transition-transform duration-500">
                                <RestaurantCard 
                                    id={restaurant._id}
                                    name={restaurant.name}
                                    address={restaurant.address}
                                    description={restaurant.description}
                                    imageUrl={restaurant.restaurantImage} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-zinc-950 border border-dashed border-zinc-800 py-20 rounded-[3rem] text-center">
                        <div className="text-4xl mb-4 opacity-20">🍽️</div>
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">
                            No restaurants found in your area.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}