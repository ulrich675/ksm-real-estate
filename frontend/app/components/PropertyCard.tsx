"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, GitCompare } from "lucide-react";

interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    mainImageUrl: string;
    proprietorName: string;
    surface?: number;
    status?: string;
    neighborhood?: string;
    city?: string;
    formatPrice?: (p: number) => string;
    hearts?: number;
}

export default function PropertyCard({ property, formatPrice }: { property: Property; formatPrice?: (p: number) => string }) {
    const displayPrice = formatPrice ? formatPrice(property.price) : `${property.price.toLocaleString()} FCFA`;
    const [isFav, setIsFav] = useState(false);
    const [isCompared, setIsCompared] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        // Fetch favorites
        fetch(`http://localhost:8080/api/favorites/${user.id}`)
            .then(res => res.text().then(text => text ? JSON.parse(text) : []))
            .then((favs: any[]) => {
                setIsFav(favs.some((p) => p.id === property.id));
            }).catch(console.error);

        // Fetch comparisons
        fetch(`http://localhost:8080/api/comparisons/${user.id}`)
            .then(res => res.text().then(text => text ? JSON.parse(text) : []))
            .then((compare: any[]) => {
                setIsCompared(compare.some((p) => p.id === property.id));
            }).catch(console.error);
    }, [property.id]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 2500);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) {
            showToast("Connectez-vous pour ajouter des favoris");
            return;
        }
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch("http://localhost:8080/api/favorites/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, propertyId: property.id })
            });
            const data = await res.text().then(text => text ? JSON.parse(text) : {});
            if (data.status === "added") {
                setIsFav(true);
                property.hearts = data.hearts;
                showToast("Ajouté aux favoris ❤️");
            } else {
                setIsFav(false);
                property.hearts = data.hearts;
                showToast("Retiré des favoris");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour");
        }
    };

    const toggleCompare = async (e: React.MouseEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) {
            showToast("Connectez-vous pour comparer");
            return;
        }
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch("http://localhost:8080/api/comparisons/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, propertyId: property.id })
            });

            if (res.ok) {
                const data = await res.text().then(text => text ? JSON.parse(text) : {});
                if (data.status === "added") {
                    setIsCompared(true);
                    showToast("Ajouté à la comparaison");
                } else {
                    setIsCompared(false);
                    showToast("Retiré de la comparaison");
                }
            } else {
                const errData = await res.text().then(text => text ? JSON.parse(text) : { error: "Erreur inconnue" });
                showToast(errData.error || "Erreur lors de la comparaison");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour");
        }
    };

    return (
        <div className="group relative bg-white border border-black/5 overflow-hidden transition-all duration-700 hover:shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
            {/* Toast */}
            {toastMsg && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap animate-bounce">
                    {toastMsg}
                </div>
            )}

            <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img
                    src={property.mainImageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover transition-all duration-1000 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Category badge */}
                <div className="absolute top-6 left-6">
                    <span className="bg-black text-white px-5 py-2 text-[8px] uppercase tracking-[0.3em] font-black">
                        {property.category}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <button
                        onClick={toggleFavorite}
                        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className="bg-white rounded-full p-2.5 shadow-md hover:scale-110 transition-transform"
                    >
                        <Heart size={16} fill={isFav ? "red" : "none"} stroke={isFav ? "red" : "black"} />
                    </button>
                    <button
                        onClick={toggleCompare}
                        title={isCompared ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
                        className={`rounded-full p-2.5 shadow-md hover:scale-110 transition-transform ${isCompared ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                        <GitCompare size={16} />
                    </button>
                </div>

                {/* Sold badge */}
                {property.status === "SOLD" && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] transform -rotate-12 border-2 border-white">
                            Vendu
                        </span>
                    </div>
                )}
            </div>

            <div className="p-10 space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-black/20"></span>
                        <p className="text-[8px] uppercase tracking-[0.4em] text-black/40 font-black">{property.location}</p>
                    </div>
                    <h3 className="text-2xl font-black leading-tight text-black group-hover:text-black/70 transition-colors">{property.title}</h3>
                    <p className="text-[9px] text-black/30 uppercase tracking-[0.2em] font-black">Propriétaire : {property.proprietorName}</p>
                </div>

                <div className="flex justify-between items-end pt-8 border-t border-black/5">
                    <div className="space-y-1">
                        <p className="text-[8px] text-black/20 uppercase tracking-widest font-black">Prix d&apos;acquisition</p>
                        <p className="text-black font-black text-xl tracking-tighter">
                            {displayPrice}
                        </p>
                    </div>
                    <Link
                        href={`/properties/${property.id}`}
                        className="text-[9px] uppercase tracking-[0.3em] font-black border-b-2 border-black pb-1 hover:text-black/40 hover:border-black/10 transition-all flex items-center gap-2"
                    >
                        Explorer
                    </Link>
                </div>
            </div>
        </div>
    );
}
