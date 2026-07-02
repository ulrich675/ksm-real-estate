"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        fetch(`http://localhost:8080/api/favorites/${user.id}`)
            .then(res => res.json())
            .then(data => setFavorites(data))
            .catch(console.error);
    }, []);

    const removeFavorite = async (id: number) => {
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch("http://localhost:8080/api/favorites/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, propertyId: id })
            });
            if (res.ok) {
                setFavorites(favorites.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const formatPrice = (p: number) => {
        if (p >= 1000000) return `${(p / 1000000).toFixed(p % 1000000 === 0 ? 0 : 1)} M FCFA`;
        return `${p.toLocaleString("fr-FR")} FCFA`;
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-black text-white py-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black mb-3">KSM Real Estate</p>
                    <div className="flex items-center gap-4">
                        <Heart fill="white" size={32} />
                        <h1 className="text-5xl  font-black uppercase tracking-tight">Mes Favoris</h1>
                    </div>
                    <p className="text-white/50 text-sm mt-4">{favorites.length} bien{favorites.length !== 1 ? "s" : ""} sauvegardé{favorites.length !== 1 ? "s" : ""}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-16">
                {favorites.length === 0 ? (
                    <div className="text-center py-32 space-y-6">
                        <Heart size={64} className="text-black/10 mx-auto" />
                        <h2 className="text-3xl  font-black text-black">Aucun favori pour l&apos;instant</h2>
                        <p className="text-gray-400">Cliquez sur le ❤️ sur une annonce pour l&apos;ajouter ici.</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-black/80 transition-all">
                            Explorer les biens <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-10">
                            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Vos biens sauvegardés</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((property) => (
                                <div key={property.id} className="group border border-black/10 hover:border-black transition-all">
                                    <div className="relative overflow-hidden h-52">
                                        <img
                                            src={property.mainImageUrl || property.mainimageurl}
                                            alt={property.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
                                            <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                                {property.category}
                                            </span>
                                            <button
                                                onClick={() => removeFavorite(property.id)}
                                                className="bg-white rounded-full p-2 hover:bg-red-50 transition-all"
                                                title="Retirer des favoris"
                                            >
                                                <Heart fill="red" stroke="red" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <h3 className="font-black text-black text-lg  leading-tight">{property.title}</h3>
                                        <p className="text-gray-400 text-xs">{property.location}</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-black/5">
                                            <span className="font-black text-black">{formatPrice(property.price)}</span>
                                            <Link
                                                href={`/properties/${property.id}`}
                                                className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-black hover:underline"
                                            >
                                                Voir <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
