"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminMenuManager() {
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.id as string;

    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [restaurantName, setRestaurantName] = useState("Loading...");

    const fetchMenu = async () => {
        try {
            const res = await fetch(`http://localhost:5050/api/menu/${restaurantId}`);
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        }
    };

    const fetchRestaurantInfo = async () => {
        try {
            const res = await fetch(`http://localhost:5050/api/restaurants/${restaurantId}`);
            if (res.ok) {
                const data = await res.json();
                setRestaurantName(data.data.name || "Restaurant");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantInfo();
            fetchMenu();
        }
    }, [restaurantId]);

    const handleAddMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        // 🔥 PERFECT MATCH TO YOUR DATABASE NOW 🔥
        const payload = {
            itemName: formData.get("name"), // Using 'itemName' so Mongoose accepts it
            price: Number(formData.get("price")),
            description: formData.get("description"),
            restaurantId: restaurantId 
        };

        try {
            const res = await fetch("http://localhost:5050/api/menu/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                form.reset();
                fetchMenu(); 
            } else {
                const errorData = await res.json();
                console.error("Backend Error Details:", errorData);
                alert("Failed to add item. Check the console (F12) for the exact error!");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e14] text-slate-200 font-sans p-10">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors font-bold text-sm">
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-widest text-white">Manage Menu</h1>
                        <p className="text-orange-500 font-bold uppercase tracking-widest text-xs mt-1">{restaurantName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Add Item Form */}
                    <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl h-fit">
                        <h3 className="text-white font-bold uppercase mb-4 text-xs tracking-widest">Add New Item</h3>
                        
                        <form suppressHydrationWarning onSubmit={handleAddMenuItem} className="space-y-4">
                            <input suppressHydrationWarning type="text" name="name" placeholder="Item Name (e.g., Cheeseburger)" className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                            <input suppressHydrationWarning type="number" step="0.01" name="price" placeholder="Price (e.g., 250)" className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                            <textarea suppressHydrationWarning name="description" placeholder="Optional Description..." rows={3} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm resize-none"></textarea>
                            
                            <button suppressHydrationWarning type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-orange-500 transition-colors">
                                Save Item
                            </button>
                        </form>
                    </div>

                    {/* Current Menu Items */}
                    <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
                        <h3 className="text-white font-bold uppercase mb-4 text-xs tracking-widest border-b border-zinc-900 pb-4">Current Menu</h3>
                        
                        {menuItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {menuItems.map((item) => (
                                    <div key={item._id} className="bg-black border border-zinc-800 p-5 rounded-xl flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            {/* 🔥 Displaying item.itemName 🔥 */}
                                            <h4 className="text-white font-bold text-base">{item.itemName}</h4>
                                            <p className="text-orange-500 font-black text-sm">Rs. {item.price}</p>
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{item.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-10 text-zinc-500 text-sm font-bold uppercase tracking-widest">
                                No items yet. Add some delicious food!
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}