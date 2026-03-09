"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RestaurantMenuPage() {
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.id as string;

    const [restaurant, setRestaurant] = useState<any>(null);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [debugError, setDebugError] = useState<string | null>(null);
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("eateup_cart");
        if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
        }

        const fetchRestaurantAndMenu = async () => {
            try {
                const restaurantRes = await fetch(`http://localhost:5050/api/restaurants/${restaurantId}`);
                if (!restaurantRes.ok) {
                    setDebugError(`Status: ${restaurantRes.status}`);
                    return;
                }
                const resData = await restaurantRes.json();
                setRestaurant(resData.data || resData);

                const menuRes = await fetch(`http://localhost:5050/api/menu/${restaurantId}`);
                const menuJson = await menuRes.json();
                setMenuItems(menuJson.data || menuJson || []);
            } catch (error: any) {
                setDebugError(`Network Crash: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (restaurantId) fetchRestaurantAndMenu();
    }, [restaurantId]);

    useEffect(() => {
        localStorage.setItem("eateup_cart", JSON.stringify(cart));
    }, [cart]);

    const addToOrder = (item: any) => {
        setCart((prev) => {
            if (prev.length > 0 && prev[0].restaurantId !== restaurantId) {
                if (!confirm("Clear cart to add items from a new restaurant?")) return prev;
                return [{ ...item, quantity: 1, restaurantId }];
            }
            const existing = prev.find((i) => i._id === item._id);
            if (existing) {
                return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1, restaurantId }];
        });
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-black animate-pulse uppercase tracking-[0.3em]">Opening Menu...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 pb-40">
            {/* Minimalist Header */}
            <div className="relative w-full h-80 bg-zinc-900">
                {restaurant?.restaurantImage && (
                    <img 
                        src={restaurant.restaurantImage.startsWith("http") ? restaurant.restaurantImage : `http://localhost:5050${restaurant.restaurantImage}`} 
                        className="w-full h-full object-cover opacity-40 grayscale-[50%]" 
                        alt="" 
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                
                <button onClick={() => router.back()} className="absolute top-8 left-8 w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:bg-orange-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="absolute bottom-12 left-0 w-full px-8 md:px-20">
                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Now Open</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-2 uppercase tracking-tighter leading-none">{restaurant.name}</h1>
                    <p className="text-zinc-500 text-sm font-medium tracking-wide">{restaurant.address}</p>
                </div>
            </div>

            {/* Line-by-Line Menu List */}
            <div className="max-w-4xl mx-auto px-6 mt-16">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Main Selection</h2>
                    <div className="h-[1px] flex-1 bg-zinc-900"></div>
                </div>

                <div className="space-y-0">
                    {menuItems.map((item) => (
                        <div key={item._id} className="group py-8 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-900/30 px-4 -mx-4 rounded-2xl transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold tracking-tight text-zinc-100">{item.itemName}</h3>
                                    {item.price < 500 && <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter">Popular</span>}
                                </div>
                                {item.description && (
                                    <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-8">
                                <span className="text-xl font-black text-white whitespace-nowrap">
                                    <span className="text-orange-500 text-xs mr-1 italic">Rs.</span>{item.price}
                                </span>
                                
                                <button 
                                    onClick={() => addToOrder(item)}
                                    className="h-12 px-8 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95"
                                >
                                    Add +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- REDESIGNED FLOATING CART --- */}
            {cart.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-50">
                    <div className="bg-orange-600 rounded-[2.5rem] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(234,88,12,0.4)] border border-orange-500">
                        <div className="pl-8">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                <p className="text-white font-black text-[10px] uppercase tracking-widest">{totalItems} Items</p>
                            </div>
                            <p className="text-white text-lg font-black tracking-tight">Rs. {totalPrice}</p>
                        </div>
                        
                        <button 
                            onClick={() => router.push('/checkout')}
                            className="bg-black text-white h-16 px-10 rounded-[2rem] font-black uppercase text-xs hover:bg-zinc-900 transition-all flex items-center gap-3"
                        >
                            Complete Order
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}