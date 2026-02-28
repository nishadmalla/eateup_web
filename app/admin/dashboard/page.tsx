"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const [restaurants, setRestaurants] = useState<any[]>([]);

    // --- USER MANAGEMENT STATE ---
    const [users, setUsers] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [newUser, setNewUser] = useState({ 
        fullName: "", username: "", email: "", password: "", role: "user" 
    });

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        if (activeTab === "restaurants") fetchRestaurants();
    }, [activeTab]);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        window.location.href = "/login";
    };

    // --- RESTAURANT API CALLS ---
    const fetchRestaurants = async () => {
        try {
            const res = await fetch("http://localhost:5050/api/restaurants");
            const data = await res.json();
            if (res.ok) setRestaurants(data.data || []);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const handleCreateRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget; 
        const formData = new FormData(form);

        // --- CATEGORY ARRAY LOGIC ---
        const categoryString = formData.get("categories") as string;
        if (categoryString) {
            const categoryArray = categoryString.split(",").map(cat => cat.trim()).filter(cat => cat !== "");
            formData.delete("categories");
            // Appends as categories[] so backend receives an array
            categoryArray.forEach(cat => formData.append("categories[]", cat)); 
        }

        try {
            const res = await fetch("http://localhost:5050/api/restaurants/add", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: formData, 
            });

            if (res.ok) {
                alert("Restaurant Added Successfully!");
                form.reset(); 
                fetchRestaurants(); 
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    // --- USER API CALLS ---
    const fetchUsers = async () => {
        setIsFetching(true);
        try {
            const res = await fetch("http://localhost:5050/api/auth/users");
            const data = await res.json();
            if (res.ok) setUsers(data.data || []);
        } catch (error) { console.error(error); } finally { setIsFetching(false); }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Delete user?")) return;
        try {
            const res = await fetch(`http://localhost:5050/api/auth/users/${id}`, { method: "DELETE" });
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
                <div className="p-6 border-b border-zinc-900 text-white font-bold uppercase tracking-widest">Eate Up Admin</div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab("overview")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "overview" ? "bg-orange-600/10 text-orange-500 font-bold" : "text-zinc-400"}`}>Overview</button>
                    <button onClick={() => setActiveTab("users")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "users" ? "bg-orange-600/10 text-orange-500 font-bold" : "text-zinc-400"}`}>Manage Users</button>
                    <button onClick={() => setActiveTab("restaurants")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "restaurants" ? "bg-orange-600/10 text-orange-500 font-bold" : "text-zinc-400"}`}>Restaurants</button>
                </nav>
                <div className="p-4"><button onClick={handleLogout} className="w-full bg-zinc-900 py-3 rounded-lg text-xs uppercase font-bold tracking-widest">Log Out</button></div>
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
                                    <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg text-xs uppercase">Create User</button>
                                </form>
                            </div>
                            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl overflow-x-auto">
                                <table className="w-full text-left text-sm text-zinc-400">
                                    <thead className="text-xs uppercase bg-zinc-900 text-zinc-500">
                                        <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, i) => (
                                            <tr key={u._id || i} className="border-b border-zinc-900/50">
                                                <td className="px-4 py-3 text-white">{u.fullName || u.username}</td>
                                                <td className="px-4 py-3">{u.email}</td>
                                                <td className="px-4 py-3 text-orange-500 font-bold">{u.role}</td>
                                                <td className="px-4 py-3 text-right"><button onClick={() => handleDeleteUser(u._id)} className="text-red-500 text-xs font-bold uppercase">Delete</button></td>
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
                                    
                                    {/* Multi-Category Input */}
                                    <div className="space-y-1">
                                        <input type="text" name="categories" placeholder="Categories (e.g. Burger, Pizza, Drinks)" className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                        <p className="text-[10px] text-zinc-500 ml-1">* Separate with commas</p>
                                    </div>

                                    <input type="text" name="address" placeholder="Address" className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" required />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="number" step="0.1" name="rating" placeholder="Rating (4.5)" className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" />
                                        <input type="text" name="deliveryTime" placeholder="Time (25-30 min)" className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" />
                                    </div>

                                    <input type="file" name="restaurantImage" accept="image/*" className="text-xs text-zinc-500" required />
                                    
                                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest">Save Restaurant</button>
                                </form>
                            </div>

                            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {restaurants.map((res) => (
                                        <div key={res._id} className="bg-black border border-zinc-800 rounded-xl overflow-hidden group hover:border-orange-600/50 transition-all">
                                            <div className="h-32 relative">
                                                <img src={`http://localhost:5050${res.restaurantImage}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={res.name} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                                <div className="absolute bottom-2 left-3">
                                                    <h4 className="text-white font-bold">{res.name}</h4>
                                                    {/* DISPLAY CATEGORY PILLS */}
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {res.categories?.map((cat: string, idx: number) => (
                                                            <span key={idx} className="bg-orange-600/20 text-orange-500 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold border border-orange-600/30">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 flex justify-between items-center bg-zinc-950/50">
                                                <span className="text-orange-500 text-[10px] font-bold">★ {res.rating || "0.0"}</span>
                                                <Link 
                                                    href={`/admin/menu/${res._id}`}
                                                    className="text-white bg-zinc-900 border border-zinc-800 hover:border-orange-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all"
                                                >
                                                    Manage Menu
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OVERVIEW TAB (Empty for now) */}
                    {activeTab === "overview" && (
                        <div className="text-zinc-500 p-10 text-center border border-zinc-900 rounded-2xl bg-zinc-950">Overview metrics coming soon...</div>
                    )}
                </div>
            </main>
        </div>
    );
}