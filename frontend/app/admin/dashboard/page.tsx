"use client";

import { useState, useEffect } from "react";
import { Users, Home, ClipboardList, Trash2, ShieldCheck, Check, X, Clock, LogOut, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface User { id: number; fullName: string; username: string; email: string; phone: string; city: string; neighborhood: string; role: string; ownerStatus?: string; requestDate?: string; enabled?: boolean; }
interface Property { id: number; title: string; price: number; location: string; ownerName: string; category: string; active?: boolean; }
interface VisitRequest { id: number; visitorName: string; propertyName?: string; propertyTitle?: string; propertyLocation: string; ownerName: string; visitDate: string; status: string; date: string; userId: string; amount?: number; ref?: string; type?: string; }

const DEMO_USERS: User[] = [
    { id: 1, fullName: "Samuel Eto'o", username: "Samuel Eto'o", email: "samuel@ksm-realestate.cm", phone: "+237 699 001 001", city: "Yaoundé", neighborhood: "Bastos", role: "PROPRIETOR" },
    { id: 2, fullName: "Rigobert Song", username: "Rigobert Song", email: "rigobert@ksm-realestate.cm", phone: "+237 677 002 002", city: "Douala", neighborhood: "Bonapriso", role: "PROPRIETOR" },
    { id: 3, fullName: "Alice Bella", username: "Alice Bella", email: "alice@ksm-realestate.cm", phone: "+237 655 003 003", city: "Kribi", neighborhood: "Plage", role: "PROPRIETOR" },
    { id: 4, fullName: "Marc Ondoua", username: "Marc Ondoua", email: "marc.ondoua@gmail.cm", phone: "+237 677 100 200", city: "Yaoundé", neighborhood: "Mvan", role: "VISITOR" },
    { id: 5, fullName: "Diane Mbarga", username: "Diane Mbarga", email: "diane.mbarga@gmail.cm", phone: "+237 699 300 400", city: "Douala", neighborhood: "Akwa", role: "VISITOR" },
];

const DEMO_PROPERTIES: Property[] = [
    { id: 1, title: "Villa Blanche Bastos", price: 850000, location: "Bastos, Yaoundé", ownerName: "Samuel Eto'o", category: "VILLA" },
    { id: 2, title: "Le Palais des Manguiers", price: 1500000, location: "Bonapriso, Douala", ownerName: "Rigobert Song", category: "VILLA" },
    { id: 3, title: "Villa Océan Kribi", price: 680000, location: "Plage, Kribi", ownerName: "Alice Bella", category: "VILLA" },
    { id: 6, title: "Appartement Crystal Akwa", price: 450000, location: "Akwa, Douala", ownerName: "Rigobert Song", category: "APARTMENT" },
    { id: 7, title: "Résidence des Arts", price: 320000, location: "Bastos, Yaoundé", ownerName: "Samuel Eto'o", category: "APARTMENT" },
    { id: 11, title: "Penthouse Wouri River", price: 1200000, location: "Bonanjo, Douala", ownerName: "Samuel Eto'o", category: "LOFT" },
    { id: 17, title: "Lot Oceanfront Kribi", price: 4000000, location: "Lobe, Kribi", ownerName: "Alice Bella", category: "LAND" },
];

const formatPrice = (p: number) => {
    if (p >= 1000000) return `${(p / 1000000).toFixed(1)} M FCFA`;
    return `${p.toLocaleString("fr-FR")} FCFA`;
};

const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return dateStr; }
};

export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState<{ fullName?: string; username?: string } | null>(null);
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState<User[]>(DEMO_USERS);
    const [properties, setProperties] = useState<Property[]>(DEMO_PROPERTIES);
    const [allHistory, setAllHistory] = useState<VisitRequest[]>([]);
    const [pending, setPending] = useState<User[]>([]);
    const [toast, setToast] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("ksm_user");
        if (!stored) { router.push("/login?redirect=/admin/dashboard"); return; }
        const u = JSON.parse(stored);
        if (u.role !== "ADMIN") { router.push("/"); return; }
        setAdmin(u);

        // Fetch users
        fetch("http://localhost:8080/api/users")
            .then(res => res.ok ? res.json() : [])
            .then(data => setUsers(Array.isArray(data) ? data : []))
            .catch(() => setUsers([]));

        // Fetch properties
        fetch("http://localhost:8080/api/properties")
            .then(res => res.ok ? res.json() : [])
            .then(data => setProperties(Array.isArray(data) ? data : []))
            .catch(() => setProperties([]));

        // Fetch all visits/purchase history
        fetch("http://localhost:8080/api/history") // Assume a global history endpoint exists or combine visits/purchases
            .then(res => res.json())
            .then(data => setAllHistory(Array.isArray(data) ? data.reverse() : []))
            .catch(() => {
                // Fallback: merge visits and purchases if history endpoint doesn't exist
                Promise.all([
                    fetch("http://localhost:8080/api/visits").then(r => r.json()),
                    fetch("http://localhost:8080/api/purchases").then(r => r.json())
                ]).then(([v, p]) => {
                    const combined = [
                        ...v.map((x: any) => ({ ...x, type: 'visit', date: x.visitDate })),
                        ...p.map((x: any) => ({ ...x, type: 'purchase', date: x.purchaseDate }))
                    ];
                    setAllHistory(combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                });
            });

        // Fetch pending proprietors
        fetch("http://localhost:8080/api/users?status=PENDING")
            .then(res => res.json())
            .then(data => setPending(Array.isArray(data) ? data : []));
    }, [router]);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

    const toggleUserStatus = (id: number) => {
        fetch(`http://localhost:8080/api/users/${id}/toggle-status`, { method: "PUT" })
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur");
                return res.json();
            })
            .then(updated => {
                setUsers(prev => prev.map(u => u.id === id ? updated : u));
                showToast(updated.enabled ? "Compte réactivé." : "Compte désactivé.");
            })
            .catch(() => showToast("Erreur lors de la modification du statut utilisateur."));
    };

    const togglePropertyStatus = (id: number) => {
        fetch(`http://localhost:8080/api/properties/${id}/toggle-status`, { method: "PUT" })
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur");
                return res.json();
            })
            .then(updated => {
                setProperties(prev => prev.map(p => p.id === id ? updated : p));
                showToast(updated.active ? "Bien réactivé au catalogue." : "Bien masqué du catalogue.");
            })
            .catch(() => showToast("Erreur lors de la modification du statut du bien."));
    };

    const approveOwner = (u: User) => {
        fetch(`http://localhost:8080/api/users/${u.id}/approve`, { method: "POST" })
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur");
                return res.json();
            })
            .then(saved => {
                setUsers(prev => [...prev.filter(x => x.id !== u.id), saved]);
                setPending(prev => prev.filter(p => p.id !== u.id));
                showToast(`✓ ${u.fullName} est maintenant propriétaire. Son espace est activé.`);
            })
            .catch(() => showToast("Erreur lors de l'approbation."));
    };

    const rejectOwner = (id: number) => {
        fetch(`http://localhost:8080/api/users/${id}/reject`, { method: "POST" })
            .then(() => {
                setPending(prev => prev.filter(p => p.id !== id));
                showToast(`Demande refusée.`);
            });
    };

    const handleLogout = () => { localStorage.removeItem("ksm_user"); router.push("/"); };

    if (!admin) return <div className="min-h-screen flex items-center justify-center bg-black text-white  text-2xl">Vérification...</div>;

    const owners = users.filter(u => u.role === "PROPRIETOR");
    const visitors = users.filter(u => u.role === "VISITOR");
    const historyVisits = allHistory.filter(h => h.type === "visit");
    const historyPurchases = allHistory.filter(h => h.type === "purchase");

    const TABS = [
        { id: "users", label: `Utilisateurs (${users.length})`, icon: Users },
        { id: "properties", label: `Biens (${properties.length})`, icon: Home },
        { id: "history", label: `Historique global (${allHistory.length})`, icon: ClipboardList },
        { id: "pending", label: `Demandes Propriétaire (${pending.length})`, icon: Clock },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[300] bg-black text-white px-8 py-4 shadow-2xl text-sm font-black flex items-center gap-3">
                    <Check size={18} /> {toast}
                </div>
            )}

            {/* Header */}
            <div className="bg-black text-white px-8 py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-white flex items-center justify-center">
                            <ShieldCheck className="text-black" size={32} />
                        </div>
                        <div>
                            <p className="text-white/40 text-[9px] uppercase tracking-[0.5em] font-black">Administration Centrale</p>
                            <h1 className="text-4xl  font-black uppercase">Centre de Contrôle</h1>
                            <p className="text-white/50 text-sm">{admin.fullName || admin.username}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {[
                            { label: "Utilisateurs", value: users.length },
                            { label: "Propriétaires", value: owners.length },
                            { label: "Biens", value: properties.length },
                            { label: "En attente", value: pending.length },
                        ].map(s => (
                            <div key={s.label} className="bg-white/10 border border-white/10 px-5 py-3 text-center">
                                <p className="text-xl font-black ">{s.value}</p>
                                <p className="text-[7px] uppercase tracking-widest text-white/30 font-black">{s.label}</p>
                            </div>
                        ))}
                        <button onClick={handleLogout} className="border border-white/20 text-white/50 px-4 hover:text-white hover:border-white transition-all">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Pending banner */}
            {pending.length > 0 && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-8 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <p className="text-yellow-800 text-sm font-black flex items-center gap-2">
                            <Clock size={16} /> {pending.length} demande(s) de propriétaire en attente de validation
                        </p>
                        <button onClick={() => setActiveTab("pending")} className="text-yellow-800 underline text-xs font-black">Voir →</button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Tab navigation */}
                <div className="flex flex-wrap gap-2 mb-12 border-b border-black/5 pb-6">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? "bg-black text-white" : "text-muted hover:text-black border border-black/10 hover:border-black"}`}>
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>

                {/* Utilisateurs */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Owners */}
                            <div className="border border-black/10">
                                <div className="bg-black text-white px-6 py-4">
                                    <h2 className="font-black uppercase tracking-widest text-sm">Propriétaires ({owners.length})</h2>
                                </div>
                                <div className="divide-y divide-black/5">
                                    {owners.map(u => (
                                        <div key={u.id} className="px-6 py-5 flex justify-between items-center hover:bg-secondary transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-black">{u.fullName.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-black text-black text-sm">{u.fullName}</p>
                                                        <p className="text-[9px] text-muted">@{u.username}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 pl-10 space-y-0.5">
                                                    <p className="text-[9px] text-muted">{u.email}</p>
                                                    <p className="text-[9px] text-muted">{u.phone} — {u.city}, {u.neighborhood}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {u.enabled === false ? (
                                                    <button
                                                        onClick={() => toggleUserStatus(u.id)}
                                                        className="px-4 py-2 bg-green-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-1"
                                                    >
                                                        <UserCheck size={12} /> Réactiver
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleUserStatus(u.id)}
                                                        className="px-4 py-2 border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-500 transition-all flex items-center gap-1"
                                                    >
                                                        <Trash2 size={12} /> Désactiver
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Visitors */}
                            <div className="border border-black/10">
                                <div className="bg-secondary border-b border-black/10 px-6 py-4">
                                    <h2 className="font-black uppercase tracking-widest text-sm">Visiteurs ({visitors.length})</h2>
                                </div>
                                <div className="divide-y divide-black/5">
                                    {visitors.map(u => (
                                        <div key={u.id} className="px-6 py-5 flex justify-between items-center hover:bg-secondary transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 border-2 border-black/20 text-black rounded-full flex items-center justify-center text-xs font-black">{u.fullName.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-black text-black text-sm">{u.fullName}</p>
                                                        <p className="text-[9px] text-muted">@{u.username}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 pl-10 space-y-0.5">
                                                    <p className="text-[9px] text-muted">{u.email}</p>
                                                    <p className="text-[9px] text-muted">{u.phone} — {u.city}, {u.neighborhood}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {u.enabled === false ? (
                                                    <button
                                                        onClick={() => toggleUserStatus(u.id)}
                                                        className="px-4 py-2 bg-green-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-1"
                                                    >
                                                        <UserCheck size={12} /> Réactiver
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleUserStatus(u.id)}
                                                        className="px-4 py-2 border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-500 transition-all flex items-center gap-1"
                                                    >
                                                        <Trash2 size={12} /> Désactiver
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Properties */}
                {activeTab === "properties" && (
                    <div className="border border-black/10 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary border-b border-black/10 text-[9px] uppercase tracking-widest font-black text-black">
                                <tr>
                                    <th className="px-8 py-6">Bien</th>
                                    <th className="px-8 py-6">Propriétaire</th>
                                    <th className="px-8 py-6">Catégorie</th>
                                    <th className="px-8 py-6">Prix</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {properties.map(p => (
                                    <tr key={p.id} className="hover:bg-secondary/50 transition-colors">
                                        <td className="px-8 py-7">
                                            <p className="font-black text-black text-sm">{p.title}</p>
                                            <p className="text-[9px] text-muted">{p.location}</p>
                                        </td>
                                        <td className="px-8 py-7 text-sm  ">{p.ownerName}</td>
                                        <td className="px-8 py-7">
                                            <span className="bg-black/5 px-3 py-1 text-[8px] font-black uppercase tracking-widest">{p.category}</span>
                                        </td>
                                        <td className="px-8 py-7 font-black text-black">{formatPrice(p.price)}</td>
                                        <td className="px-8 py-7 text-right">
                                            <button
                                                onClick={() => togglePropertyStatus(p.id)}
                                                className={`p-2 transition-colors ${p.active === false ? "text-green-600 hover:text-green-800" : "text-muted hover:text-red-600"}`}
                                                title={p.active === false ? "Réactiver" : "Désactiver"}
                                            >
                                                {p.active === false ? <Check size={18} /> : <Trash2 size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Global History (visits + purchases) */}
                {activeTab === "history" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-secondary border border-black/10 p-6 text-center">
                                <p className="text-2xl font-black ">{historyVisits.length}</p>
                                <p className="text-[9px] uppercase tracking-widest text-muted font-black">Demandes de visite</p>
                            </div>
                            <div className="bg-black text-white p-6 text-center">
                                <p className="text-2xl font-black ">{historyPurchases.length}</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/40 font-black">Achats réalisés</p>
                            </div>
                        </div>

                        {allHistory.length === 0 ? (
                            <div className="py-32 text-center">
                                <ClipboardList className="mx-auto text-black/10 mb-6" size={60} />
                                <p className="text-muted text-xs uppercase tracking-widest font-black">Aucune activité enregistrée.</p>
                            </div>
                        ) : (
                            <div className="border border-black/10 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary border-b border-black/10 text-[9px] uppercase tracking-widest font-black text-black">
                                        <tr>
                                            <th className="px-6 py-5">Type</th>
                                            <th className="px-6 py-5">Utilisateur</th>
                                            <th className="px-6 py-5">Bien</th>
                                            <th className="px-6 py-5">Propriétaire</th>
                                            <th className="px-6 py-5">Date</th>
                                            <th className="px-6 py-5">Statut / Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {allHistory.map((h, i) => (
                                            <tr key={i} className="hover:bg-secondary/50 transition-colors">
                                                <td className="px-6 py-6">
                                                    <span className={`px-3 py-1 text-[7px] font-black uppercase tracking-widest ${h.type === "purchase" ? "bg-black text-white" : "bg-secondary text-black"}`}>
                                                        {h.type === "purchase" ? "Achat" : "Visite"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 font-black text-black text-sm">{h.userId}</td>
                                                <td className="px-6 py-6">
                                                    <p className="text-sm text-black">{h.propertyName || h.propertyTitle}</p>
                                                    <p className="text-[9px] text-muted">{h.propertyLocation}</p>
                                                </td>
                                                <td className="px-6 py-6 text-sm  ">{h.ownerName}</td>
                                                <td className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted">
                                                    {formatDate(h.date)}
                                                    {h.visitDate && <p className="text-[8px] text-muted">Visite: {h.visitDate}</p>}
                                                </td>
                                                <td className="px-6 py-6">
                                                    {h.type === "purchase" && h.amount ? (
                                                        <p className="font-black text-black">{formatPrice(h.amount)}</p>
                                                    ) : (
                                                        <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${h.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                                            h.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                                                "bg-yellow-100 text-yellow-800"
                                                            }`}>
                                                            {h.status === "CONFIRMED" ? "Confirmée" : h.status === "REJECTED" ? "Refusée" : "En attente"}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Pending owner requests */}
                {activeTab === "pending" && (
                    <div className="space-y-6">
                        {pending.length === 0 ? (
                            <div className="py-32 text-center">
                                <UserCheck className="mx-auto text-black/10 mb-6" size={60} />
                                <p className="text-muted text-xs uppercase tracking-widest font-black">Aucune demande en attente.</p>
                            </div>
                        ) : (
                            pending.map(u => (
                                <div key={u.id} className="border border-black/10 p-10 flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-secondary/30 transition-colors">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-2xl">
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl  font-black text-black">{u.fullName}</h3>
                                            <p className="text-muted text-sm">@{u.username}</p>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-1 pt-2">
                                                <p className="text-[9px] text-muted uppercase tracking-widest font-bold">Email : <span className="text-black">{u.email}</span></p>
                                                <p className="text-[9px] text-muted uppercase tracking-widest font-bold">Tél : <span className="text-black">{u.phone}</span></p>
                                                <p className="text-[9px] text-muted uppercase tracking-widest font-bold">Ville : <span className="text-black">{u.city}</span></p>
                                                <p className="text-[9px] text-muted uppercase tracking-widest font-bold">Quartier : <span className="text-black">{u.neighborhood}</span></p>
                                                {u.requestDate && <p className="text-[9px] text-muted col-span-2">Demande : {formatDate(u.requestDate)}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => rejectOwner(u.id)} className="border border-black/20 text-black/50 px-8 py-4 text-[9px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all flex items-center gap-2">
                                            <X size={14} /> Refuser
                                        </button>
                                        <button onClick={() => approveOwner(u)} className="bg-black text-white px-8 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center gap-2 shadow-xl">
                                            <Check size={14} /> Approuver — Créer Espace Propriétaire
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
