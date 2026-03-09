"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Retrieve the cart from the Restaurant ID page logic
    useEffect(() => {
        const savedCart = localStorage.getItem("eateup_cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (parsedCart.length === 0) {
                    router.push("/"); // Redirect if cart is empty
                } else {
                    setCart(parsedCart);
                }
            } catch (e) {
                console.error("Failed to parse cart data");
                router.push("/");
            }
        } else {
            router.push("/");
        }
    }, [router]);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get("token");

        if (!address.trim()) return alert("Please enter a delivery address!");
        if (cart.length === 0) return alert("Your cart is empty!");

        setIsSubmitting(true);

        // Prepare the payload for your OrderController
        const orderData = {
            restaurantId: cart[0]?.restaurantId, // Pulled from the first item in cart
            items: cart.map(item => ({
                menuItem: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: totalPrice,
            address: address
        };

        try {
            const res = await fetch("http://localhost:5050/api/orders/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const result = await res.json();

            if (res.ok) {
                alert("Order Placed Successfully!");
                localStorage.removeItem("eateup_cart"); // Clear cart after success
                router.push("/profile/orders"); // Redirect to profile to see the order
            } else {
                alert(`Error: ${result.message || "Failed to place order"}`);
            }
        } catch (error) {
            console.error("Order submission error:", error);
            alert("Network error. Please check if your backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-20 font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-12 tracking-tighter">
                    Checkout <span className="text-orange-500">.</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Side: Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-500">Items</h2>
                        {cart.map((item) => (
                            <div key={item._id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{item.itemName}</h3>
                                    <p className="text-zinc-500 text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-orange-500 font-black">Rs. {item.price * item.quantity}</p>
                                    <p className="text-[10px] text-zinc-700 uppercase">Rs. {item.price} each</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Delivery & Total */}
                    <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] h-fit sticky top-10">
                        <h2 className="text-xl font-bold mb-6">Delivery Details</h2>
                        <form onSubmit={handlePlaceOrder} className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase font-black text-zinc-500 mb-2 block tracking-widest">Address</label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full address..."
                                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm focus:border-orange-500 outline-none h-32 transition-all"
                                    required
                                />
                            </div>

                            <div className="pt-6 border-t border-zinc-900">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-zinc-500 uppercase text-xs font-bold tracking-widest">Total Amount</span>
                                    <span className="text-3xl font-black text-white">Rs. {totalPrice}</span>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-600/20"
                                >
                                    {isSubmitting ? "Processing..." : "Confirm Order"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}