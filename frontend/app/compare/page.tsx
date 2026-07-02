"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, GitCompare, ArrowRight, MapPin } from "lucide-react";

export default function ComparePage() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        fetch(`http://localhost:8080/api/comparisons/${user.id}`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(console.error);
    }, []);

    const remove = async (id: number) => {
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch("http://localhost:8080/api/comparisons/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, propertyId: id })
            });
            if (res.ok) {
                setItems(items.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const formatPrice = (p: number) => {
        if (p >= 1000000) return `${(p / 1000000).toFixed(p % 1000000 === 0 ? 0 : 1)} M FCFA`;
        return `${p.toLocaleString("fr-FR")} FCFA`;
    };

    const fields: any[] = [
        { label: "Prix", key: "price", format: (v: number) => formatPrice(v) },
        { label: "Catégorie", key: "category", format: (v: string) => v },
        { label: "Localisation", key: "location", format: (v: string) => v },
        { label: "Surface (m²)", key: "surface", format: (v: number) => v ? `${v} m²` : "N/A" },
        { label: "Propriétaire", key: "proprietorName", format: (v: string) => v || "—" },
        { label: "Statut", key: "status", format: (v: string) => v === "AVAILABLE" ? "✅ Disponible" : "❌ Vendu" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-black text-white py-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black mb-3">KSM Real Estate</p>
                    <div className="flex items-center gap-4">
                        <GitCompare size={32} />
                        <h1 className="text-5xl  font-black uppercase tracking-tight">Comparaison</h1>
                    </div>
                    <p className="text-white/50 text-sm mt-4">{items.length}/3 bien{items.length !== 1 ? "s" : ""} sélectionné{items.length !== 1 ? "s" : ""}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-16">
                {items.length === 0 ? (
                    <div className="text-center py-32 space-y-6">
                        <GitCompare size={64} className="text-black/10 mx-auto" />
                        <h2 className="text-3xl  font-black text-black">Aucun bien à comparer</h2>
                        <p className="text-gray-400">Cliquez sur &quot;+ Comparer&quot; sur les annonces pour les ajouter ici (max 3).</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-black/80 transition-all">
                            Explorer les biens <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Property cards header */}
                        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}>
                            <div />
                            {items.map((p) => (
                                <div key={p.id} className="relative group">
                                    <img src={p.mainImageUrl || p.mainimageurl} alt={p.title} className="w-full h-40 object-cover" />
                                    <button
                                        onClick={() => remove(p.id)}
                                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="p-3 border border-black/10 border-t-0">
                                        <p className="font-black text-sm text-black truncate">{p.title}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                            <MapPin size={10} /> {p.location}
                                        </p>
                                        <Link href={`/properties/${p.id}`} className="text-[10px] font-black uppercase tracking-widest text-black hover:underline">
                                            Voir le bien →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparison table */}
                        <div className="border border-black/10 overflow-hidden">
                            {fields.map((field, i) => (
                                <div
                                    key={field.key}
                                    className={`grid items-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                    style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
                                >
                                    <div className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-400 border-r border-black/10">
                                        {field.label}
                                    </div>
                                    {items.map((p) => (
                                        <div key={p.id} className="px-6 py-4 text-sm font-bold text-black border-r border-black/10 last:border-r-0">
                                            {field.format((p as any)[field.key])}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {items.length < 3 && (
                            <div className="text-center py-8 border-2 border-dashed border-black/20">
                                <p className="text-gray-400 text-sm">Vous pouvez ajouter encore {3 - items.length} bien{3 - items.length !== 1 ? "s" : ""}</p>
                                <Link href="/" className="text-black font-black text-xs uppercase tracking-widest hover:underline mt-2 inline-block">
                                    Retourner au catalogue →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
