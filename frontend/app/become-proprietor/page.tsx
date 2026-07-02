"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, MapPin, Building2, ArrowRight, Check } from "lucide-react";
import { validateEmail, validatePhone } from "../utils/validation";

const BACKEND = "http://localhost:8080/api";

export default function BecomeProprietorPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("ksm_user");
        if (!savedUser) {
            router.push("/login?tab=register&redirect=/become-proprietor");
        } else {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setEmail(parsedUser.email || "");
            setPhone(parsedUser.phone || "");
        }
    }, [router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("L'email doit utiliser l'un des domaines autorisés (ex: gmail.com, yahoo.com, outlook.com...)");
            return;
        }

        if (!validatePhone(phone)) {
            setError("Le numéro de téléphone doit être au format camerounais (+237 6...)");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BACKEND}/auth/become-proprietor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    email,
                    phone,
                    city,
                    neighborhood
                }),
            });
            const data = await res.json();
            if (data.success || data.id) {
                setSubmitted(true);
            } else {
                setError(data.message || "Erreur. Le nom d'utilisateur existe peut-être déjà.");
            }
        } catch {
            setError("Le serveur KSM ne répond pas. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white  text-2xl uppercase tracking-widest animate-pulse">Vérification...</div>;
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary px-6">
                <div className="bg-white max-w-lg w-full p-16 text-center space-y-8 shadow-xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="text-green-600" size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl  font-black text-black uppercase">Demande Envoyée !</h1>
                        <p className="text-muted text-sm leading-relaxed">
                            Votre demande pour devenir propriétaire a été soumise avec succès.
                            L&apos;administrateur KSM examinera votre dossier et vous notifiera de la décision.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-4 mx-auto"
                    >
                        Retour à l&apos;accueil <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary relative overflow-hidden flex items-center justify-center py-20 px-6">
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-black" />

            <div className="relative z-10 w-full max-w-4xl bg-white shadow-[0_50px_150px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden ">
                <div className="md:w-1/3 bg-black text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-6 relative z-10">
                        <div className="w-12 h-12 border-2 border-white/20 flex items-center justify-center rotate-45">
                            <span className="text-xl  font-black -rotate-45">K</span>
                        </div>
                        <h2 className="text-3xl  font-black leading-tight uppercase">Propriétaire <br /><span className="text-white/40 ">Partenaire</span></h2>
                        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 leading-loose">
                            Valorisez votre patrimoine avec le réseau KSM Real Estate.
                        </p>
                    </div>
                    {/* Abstract design elements */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 border border-white/5 rounded-full" />
                </div>

                <div className="flex-1 p-12 md:p-16 space-y-10">
                    <div className="space-y-2">
                        <h3 className="text-3xl  font-black text-black uppercase">Finaliser ma Demande</h3>
                        <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-black">Veuillez compléter vos informations de contact.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 p-4 text-[10px] text-red-700 font-bold uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 group opacity-60">
                                <label className="text-[9px] uppercase tracking-widest text-black/40 font-black">Nom Complet (Vérifié)</label>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none"><User size={16} /></span>
                                    <input
                                        type="text"
                                        value={user?.fullName}
                                        disabled
                                        className="w-full bg-transparent border-b border-black/10 pl-7 py-3 focus:outline-none text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <Field label="Email de Contact" icon={<Mail size={16} />} type="email" value={email} onChange={setEmail} placeholder="contact@exemple.cm" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Field label="Téléphone (+237)" icon={<Phone size={16} />} value={phone} onChange={setPhone} placeholder="+237 6XX XXX XXX" required />
                            <Field label="Ville / Localisation" icon={<MapPin size={16} />} value={city} onChange={setCity} placeholder="YAOUNDÉ / DOUALA..." required />
                        </div>

                        <Field label="Quartier / Adresse Précise" icon={<Building2 size={16} />} value={neighborhood} onChange={setNeighborhood} placeholder="BASTOS, AKWA, BONAPRISO..." required />

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white font-black py-7 uppercase text-[10px] tracking-[0.4em] shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {loading ? "Traitement en cours..." : "Soumettre ma Demande"}
                                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({ label, icon, value, onChange, placeholder, type = "text", required = false }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-[9px] uppercase tracking-widest text-black/40 font-black group-focus-within:text-black transition-colors">{label}</label>
            <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none">{icon}</span>
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-b border-black/10 pl-7 py-3 focus:outline-none focus:border-black transition-colors text-xs font-bold uppercase tracking-wider"
                />
            </div>
        </div>
    );
}
