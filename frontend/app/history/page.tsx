"use client";

import { useState, useEffect } from "react";
import { History, ShoppingBag, Calendar, CheckCircle, Clock, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryItem {
    type: "visit" | "purchase";
    propertyId: number;
    propertyTitle: string;
    propertyLocation: string;
    ownerName: string;
    ownerPhone: string;
    visitDate?: string;
    amount?: number;
    ref?: string;
    date: string;
    status?: string;
    userId: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ fullName?: string; username?: string; email?: string; phone?: string; role?: string } | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "visits" | "purchases">("all");

    useEffect(() => {
        const stored = localStorage.getItem("ksm_user");
        if (!stored) {
            router.push("/login?redirect=/history");
            return;
        }
        const u = JSON.parse(stored);
        setUser(u);

        // Load history from API
        fetch(`http://localhost:8080/api/users/${u.id}/history`)
            .then(res => res.json())
            .then(data => setHistory(Array.isArray(data) ? data : []))
            .catch(err => console.error("Failed to load history:", err));
    }, [router]);

    const filteredHistory = history.filter(h => {
        if (activeTab === "visits") return h.type === "visit";
        if (activeTab === "purchases") return h.type === "purchase";
        return true;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    };

    const formatPrice = (p: number) => {
        if (p >= 1000000) return `${(p / 1000000).toFixed(1)} M FCFA`;
        return `${p.toLocaleString("fr-FR")} FCFA`;
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center bg-black text-white  text-2xl">Chargement...</div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-black text-white px-8 py-16">
                <div className="max-w-5xl mx-auto">
                    <p className="text-white/40 text-[9px] uppercase tracking-[0.5em] font-black mb-2">Espace Personnel</p>
                    <h1 className="text-4xl  font-black uppercase">Mon Historique</h1>
                    <p className="text-white/60 text-sm mt-2">{user.fullName || user.username}</p>

                    <div className="flex gap-6 mt-8">
                        {[
                            { key: "all", label: `Tout (${history.length})` },
                            { key: "visits", label: `Visites (${history.filter(h => h.type === "visit").length})` },
                            { key: "purchases", label: `Achats (${history.filter(h => h.type === "purchase").length})` },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as "all" | "visits" | "purchases")}
                                className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === tab.key ? "text-white border-white" : "text-white/30 border-transparent hover:text-white/60"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-16">
                {filteredHistory.length === 0 ? (
                    <div className="py-32 text-center space-y-6">
                        <History className="mx-auto text-black/10" size={80} />
                        <p className="text-muted text-xs uppercase tracking-widest font-black">Aucune action dans votre historique.</p>
                        <a href="/" className="inline-flex items-center gap-2 text-black font-black text-xs uppercase tracking-widest border-b-2 border-black pb-1">
                            Explorer les biens <ArrowRight size={14} />
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredHistory.map((item, index) => (
                            <div key={index} className={`border p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${item.type === "purchase" ? "border-black bg-white" : "border-black/10"}`}>
                                <div className="flex items-start gap-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === "purchase" ? "bg-black text-white" : "bg-secondary text-black"}`}>
                                        {item.type === "purchase" ? <ShoppingBag size={20} /> : <Calendar size={20} />}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-[7px] font-black uppercase tracking-widest ${item.type === "purchase" ? "bg-black text-white" : "bg-secondary text-black"}`}>
                                                {item.type === "purchase" ? "ACHAT" : "VISITE"}
                                            </span>
                                            <span className="text-[9px] text-muted font-black uppercase tracking-widest">{formatDate(item.date)}</span>
                                        </div>
                                        <h3 className=" font-black text-black text-xl">{item.propertyTitle}</h3>
                                        <p className="text-muted text-sm">{item.propertyLocation}</p>
                                        <div className="text-xs space-y-1">
                                            <p className="text-black/50"><span className="font-black">Propriétaire :</span> {item.ownerName} — {item.ownerPhone}</p>
                                            {item.type === "visit" && item.visitDate && (
                                                <p className="text-black/50"><span className="font-black">Date souhaitée :</span> {item.visitDate}</p>
                                            )}
                                            {item.type === "purchase" && item.ref && (
                                                <p className="text-black/50"><span className="font-black">Réf :</span> {item.ref}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                    {item.type === "purchase" && item.amount && (
                                        <p className="font-black text-black text-xl ">{formatPrice(item.amount)}</p>
                                    )}
                                    <div className={`flex items-center gap-2 px-3 py-1 text-[8px] font-black uppercase tracking-widest ${item.status === "CONFIRMED" || item.type === "purchase"
                                        ? "bg-green-100 text-green-700"
                                        : item.status === "REJECTED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {item.type === "purchase" ? (
                                            <><CheckCircle size={10} /> Complété</>
                                        ) : item.status === "CONFIRMED" ? (
                                            <><CheckCircle size={10} /> Confirmée</>
                                        ) : item.status === "REJECTED" ? (
                                            <><X size={10} /> Refusée</>
                                        ) : (
                                            <><Clock size={10} /> En attente</>
                                        )}
                                    </div>
                                    <a
                                        href={`/properties/${item.propertyId}`}
                                        className="text-[9px] font-black uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all"
                                    >
                                        Voir le bien →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
