"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = Cookies.get("token");
            
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                // Hits the getMyOrders method in your OrderController
                const res = await fetch("http://localhost:5050/api/orders/my-orders", {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setOrders(data.data || []);
                } else {
                    setError(data.message || "Failed to load orders");
                }
            } catch (err) {
                setError("Network error: Is the backend running on 5050?");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-black animate-pulse uppercase tracking-widest">
            Fetching your orders...
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white p-10">
            <div className="bg-red-950 border border-red-900 p-6 rounded-2xl text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-xs uppercase font-black bg-white text-black px-4 py-2 rounded-lg">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-20 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-12 tracking-tighter">
                    My Orders <span className="text-orange-500">.</span>
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-16 text-center">
                        <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-6">No orders found.</p>
                        <button onClick={() => router.push("/")} className="bg-orange-600 px-8 py-3 rounded-xl font-black uppercase text-xs">Order Food Now</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-1">
                                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                        {order.status} {/* Uses the status field from OrderModel */}
                                    </p>
                                    <h3 className="text-2xl font-bold">{order.restaurant?.name || "Eate Up Partner"}</h3>
                                    <p className="text-zinc-500 text-xs mt-1">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-white">Rs. {order.totalAmount}</p>
                                    <p className="text-zinc-600 text-[10px] font-mono mt-1">ID: {order._id.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}