"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function BulkMenuEditor() {
    const { id: restaurantId } = useParams();
    const router = useRouter();
    const [menuRows, setMenuRows] = useState([{ itemName: "", price: "", category: "", description: "" }]);

    const addRow = () => setMenuRows([...menuRows, { itemName: "", price: "", category: "", description: "" }]);

    const updateRow = (index: number, field: string, value: string) => {
        const updated = [...menuRows];
        (updated[index] as any)[field] = value;
        setMenuRows(updated);
    };

    const saveAll = async () => {
        try {
            const token = Cookies.get("token");
            for (const item of menuRows) {
                if (!item.itemName || !item.price || !item.category) continue; 
                await fetch("http://localhost:5050/api/menu/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ restaurantId, ...item, price: Number(item.price), description: item.description || "" }),
                });
            }
            alert("Menu saved successfully!");
            router.push("/admin/dashboard");
        } catch (error) { console.error(error); }
    };

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
                <h1 className="text-2xl font-bold uppercase tracking-widest">Menu Builder <span className="text-orange-500">.</span></h1>
                <button onClick={() => router.back()} className="text-zinc-500 hover:text-white uppercase font-bold text-xs">Back</button>
            </header>

            <div className="space-y-4 max-w-5xl mx-auto">
                {menuRows.map((row, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                        <input type="text" value={row.itemName} onChange={(e) => updateRow(index, "itemName", e.target.value)} className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" placeholder="Item Name" />
                        <input type="text" value={row.category} onChange={(e) => updateRow(index, "category", e.target.value)} className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" placeholder="Category" />
                        <input type="number" value={row.price} onChange={(e) => updateRow(index, "price", e.target.value)} className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" placeholder="Price (Rs.)" />
                        <input type="text" value={row.description} onChange={(e) => updateRow(index, "description", e.target.value)} className="bg-black border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm" placeholder="Description (Optional)" />
                    </div>
                ))}
                <div className="flex gap-4 pt-6">
                    <button onClick={addRow} className="flex-1 bg-zinc-900 py-4 rounded-xl border border-zinc-800 font-bold uppercase text-xs">+ Row</button>
                    <button onClick={saveAll} className="flex-1 bg-orange-600 py-4 rounded-xl font-bold uppercase text-xs">Save Menu</button>
                </div>
            </div>
        </div>
    );
}