"use client";

import { X, Heart, ShieldCheck, Check } from "lucide-react";
import { useState } from "react";

interface VirtualTourModalProps {
    property: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function VirtualTourModal({ property, onClose, onSuccess }: VirtualTourModalProps) {
    const [loading, setLoading] = useState(false);
    const price = property.hearts >= 3 ? 750 : 500;

    const handlePayment = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem("ksm_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch("http://localhost:8080/api/virtual-tour/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    propertyId: property.id,
                    amount: price
                })
            });

            if (res.ok) {
                onSuccess();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 text-muted hover:text-black transition-colors">
                    <X size={20} />
                </button>

                <div className="text-center space-y-8">
                    <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Heart
                                key={i}
                                size={20}
                                className={i <= (property.hearts || 0) ? "fill-black text-black" : "text-black/10"}
                            />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Accès Visite 360°</p>
                        <h2 className="text-3xl  font-black uppercase text-black">Visite VIP Virtuelle</h2>
                    </div>

                    <div className="bg-secondary/30 p-8 border border-black/5 space-y-4">
                        <p className="text-xs text-muted leading-relaxed">
                            Payez une seule fois et découvrez chaque recoin de ce bien en immersion totale. Accès illimité après paiement.
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-black/10">
                            <span className="text-[10px] font-black uppercase tracking-widest">Tarif Unitaire :</span>
                            <span className="text-2xl font-black">{price.toLocaleString()} FCFA</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? "Traitement..." : "Payer et Démarrer la Visite"}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-green-600">
                        <ShieldCheck size={14} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Paiement Sécurisé (Simulation)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
