"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [newUser, setNewUser] = useState({ 
        fullName: "", username: "", email: "", password: "", role: "user" 
    });

    const token = Cookies.get("token");

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        if (activeTab === "restaurants") fetchRestaurants();
        if (activeTab === "orders") fetchAllOrders();
    }, [activeTab]);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        window.location.href = "/login";
    };

    // --- ORDER ACTIONS (INCLUDING DELETE LOGIC) ---
    const fetchAllOrders = async () => {
        setIsFetching(true);
        try {
            const res = await fetch("http://localhost:5050/api/orders/my-orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setOrders(data.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleCompleteAndRemove = async (orderId: string) => {
        if (!confirm("Is this order finished? It will be permanently removed.")) return;
        try {
            const res = await fetch(`http://localhost:5050/api/orders/${orderId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setOrders(prev => prev.filter(order => order._id !== orderId));
                alert("Order cleared!");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // --- RESTAURANT ACTIONS ---
    const fetchRestaurants = async () => {
        try {
            const res = await fetch("http://localhost:5050/api/restaurants");
            const data = await res.json();
            if (res.ok) setRestaurants(data.data || []);
        } catch (error) { console.error(error); }
    };

    const handleCreateRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget; 
        const formData = new FormData(form);
        try {
            const res = await fetch("http://localhost:5050/api/restaurants/add", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData, 
            });
            if (res.ok) {
                alert("Restaurant Added!");
                form.reset(); 
                fetchRestaurants(); 
            }
        } catch (error) { console.error(error); }
    };

    const handleDeleteRestaurant = async (id: string) => {
        if (!confirm("Permanently delete this restaurant?")) return;
        try {
            const res = await fetch(`http://localhost:5050/api/restaurants/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchRestaurants();
        } catch (error) { console.error(error); }
    };

    // --- USER ACTIONS ---
    const fetchUsers = async () => {
        setIsFetching(true);
        try {
            const res = await fetch("http://localhost:5050/api/auth/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data.data || []);
        } catch (error) { console.error(error); } finally { setIsFetching(false); }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Delete user?")) return;
        try {
            const res = await fetch(`http://localhost:5050/api/auth/users/${id}`, { 
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchUsers();
        } catch (error) { console.error(error); }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...newUser, confirmPassword: newUser.password };
            const res = await fetch("http://localhost:5050/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setNewUser({ fullName: "", username: "", email: "", password: "", role: "user" });
                fetchUsers();
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="min-h-screen bg-black flex text-slate-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col">
                <div className="p-6 border-b border-zinc-900 text-white font-bold uppercase tracking-widest text-center">Eate Up Admin</div>
                <nav className="flex-1 p-4 space-y-2">
                    {["overview", "users", "restaurants", "orders"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`w-full text-left px-4 py-3 rounded-xl capitalize ${activeTab === tab ? "bg-orange-600/10 text-orange-500 font-bold" : "text-zinc-400 hover:bg-zinc-900"}`}
                        >
                            {tab === "users" ? "Manage Users" : tab === "orders" ? "Live Orders" : tab}
                        </button>
                    ))}
                </nav>
                <div className="p-4">
                    <button onClick={handleLogout} className="w-full bg-zinc-900 py-3 rounded-lg text-xs uppercase font-bold tracking-widest hover:bg-red-900/20 hover:text-red-500 transition-all">Log Out</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 bg-[#0a0e14] overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    
                    {/* USERS TAB */}
                    {activeTab === "users" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl h-fit">
                                <h3 className="text-white font-bold uppercase mb-4 text-xs tracking-widest">Add New User</h3>
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500" required />
                                    <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500" required />
                                    <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500" required />
                                    <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500" required />
                                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg text-xs uppercase hover:bg-orange-500 hover:text-white transition-all">Create User</button>
                                </form>
                            </div>
                            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl overflow-x-auto">
                                <table className="w-full text-left text-sm text-zinc-400">
                                    <thead className="text-xs uppercase bg-zinc-900 text-zinc-500">
                                        <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, i) => (
                                            <tr key={u._id || i} className="border-b border-zinc-900/50">
                                                <td className="px-4 py-3 text-white">{u.fullName || u.username}</td>
                                                <td className="px-4 py-3">{u.email}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 text-xs font-bold uppercase hover:underline">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* RESTAURANTS TAB */}
                    {activeTab === "restaurants" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl h-fit">
                                <h3 className="text-white font-bold uppercase mb-4 text-xs tracking-widest">Register Partner</h3>
                                <form onSubmit={handleCreateRestaurant} className="space-y-4">
                                    <input type="text" name="name" placeholder="Restaurant Name" className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    <input type="text" name="address" placeholder="Address" className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="number" step="0.1" name="rating" placeholder="Rating" className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" />
                                        <input type="text" name="deliveryTime" placeholder="Time" className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" />
                                    </div>
                                    <input type="file" name="restaurantImage" accept="image/*" className="text-xs text-zinc-500" required />
                                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-orange-700 transition-all">Save Restaurant</button>
                                </form>
                            </div>
                            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {restaurants.map((res) => (
                                        <div key={res._id} className="bg-black border border-zinc-800 rounded-xl overflow-hidden group">
                                            <div className="h-32 relative">
                                                <img src={`http://localhost:5050${res.restaurantImage}`} className="w-full h-full object-cover opacity-70" alt={res.name} />
                                                <div className="absolute bottom-2 left-3 text-white font-bold">{res.name}</div>
                                            </div>
                                            <div className="p-3 flex justify-between items-center">
                                                <Link href={`/admin/menu/${res._id}`} className="text-white bg-zinc-900 px-3 py-1 rounded text-[10px] font-bold uppercase">Menu</Link>
                                                <button onClick={() => handleDeleteRestaurant(res._id)} className="text-red-500 text-[10px] font-bold uppercase">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LIVE ORDERS TAB (NEW INTEGRATION) */}
                    {activeTab === "orders" && (
                        <div className="space-y-6">
                            <h2 className="text-white font-black text-xl uppercase tracking-widest">Active Kitchen Orders</h2>
                            {orders.length === 0 ? (
                                <div className="p-20 text-center border border-zinc-900 rounded-3xl bg-zinc-950 text-zinc-600 italic">No orders in the queue.</div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {orders.map((order) => (
                                        <div key={order._id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex justify-between items-center hover:border-orange-500/30 transition-all">
                                            <div className="space-y-1">
                                                <h3 className="text-white font-bold">Restaurant: {order.restaurant?.name || "Eate Up Partner"}</h3>
                                                <p className="text-zinc-400 text-xs">Total: Rs. {order.totalAmount}</p>
                                                <p className="text-zinc-500 text-[10px]">{order.address}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleCompleteAndRemove(order._id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Done & Clear
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "overview" && (
                        <div className="text-zinc-500 p-10 text-center border border-zinc-900 rounded-2xl bg-zinc-950">
                            <p className="text-xl font-bold text-white mb-2">Welcome, Admin</p>
                            <p>Everything is running smoothly.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}