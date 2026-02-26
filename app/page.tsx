"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the data directly inside the page
    useEffect(() => {
        const getRestaurants = async () => {
            try {
                const response = await fetch("http://localhost:5050/api/restaurants");
                const res = await response.json();
                if (res.success) {
                    setRestaurants(res.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        getRestaurants();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#0a0e14] text-white p-10">Loading restaurants...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0e14] text-slate-200 p-8">
            <div className="max-w-6xl mx-auto">
                
                <h1 className="text-3xl font-light tracking-widest text-white uppercase mb-10 border-b border-slate-800 pb-4">
                    Eate Up Feed
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant: any) => (
                        <Link href={`/restaurant/${restaurant._id}`} key={restaurant._id}>
                            <div className="bg-[#0f151d] border border-slate-800 rounded-xl p-4 hover:border-slate-500 transition-all cursor-pointer">
                                
                                {/* Image Box */}
                                {restaurant.restaurantImage ? (
                                    <img 
                                        src={`http://localhost:5050${restaurant.restaurantImage}`} 
                                        alt={restaurant.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-slate-900 rounded-lg mb-4 flex items-center justify-center text-slate-600">
                                        No Image
                                    </div>
                                )}

                                {/* Text Details */}
                                <h2 className="text-xl font-bold text-white">{restaurant.name}</h2>
                                <p className="text-sm text-slate-400 mt-1">{restaurant.address}</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}