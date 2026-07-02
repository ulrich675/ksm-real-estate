"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Check, X, ShieldCheck, LogOut, Home, Calendar, TrendingDown, Save, Upload, Image, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const BACKEND = "http://localhost:8080/api";

interface Property {
    id: number; title: string; price: number; location: string;
    category: string; status: string; mainImageUrl: string; description: string;
    active?: boolean;
}

interface VisitRequest {
    id: number; visitorName: string; email: string; phone: string;
    visitDate: string; propertyName: string; status: string;
}

interface Purchase { id: number; buyerName: string; propertyName: string; amount: number; date: string; ref: string; }

const DEMO_PROPERTIES: Record<string, Property[]> = {
    "Samuel Eto'o": [
        { id: 1, title: "Villa Blanche Bastos", price: 850000, location: "Bastos, Yaoundé", category: "VILLA", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800", description: "Prouesse architecturale au cœur de Yaoundé." },
        { id: 7, title: "Résidence des Arts", price: 320000, location: "Bastos, Yaoundé", category: "APARTMENT", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800", description: "Appartement haut standing." },
        { id: 11, title: "Penthouse Wouri River", price: 1200000, location: "Bonanjo, Douala", category: "LOFT", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800", description: "Loft d'exception avec terrasse." },
    ],
    "Rigobert Song": [
        { id: 2, title: "Le Palais des Manguiers", price: 1500000, location: "Bonapriso, Douala", category: "VILLA", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800", description: "Villa luxueuse avec jardin tropical." },
        { id: 6, title: "Appartement Crystal Akwa", price: 450000, location: "Akwa, Douala", category: "APARTMENT", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1545324418-f1d3c5953e06?q=80&w=800", description: "Le luxe vertical de Douala." },
        { id: 18, title: "Domaine de Bonabéri", price: 750000, location: "Bonabéri, Douala", category: "LAND", status: "SOLD", mainImageUrl: "https://images.unsplash.com/photo-1502472545311-6228469acf90?q=80&w=800", description: "Terrain titré 2000m²." },
    ],
    "Alice Bella": [
        { id: 3, title: "Villa Océan Kribi", price: 680000, location: "Plage, Kribi", category: "VILLA", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800", description: "Vue imprenable sur l'Atlantique." },
        { id: 14, title: "Hideaway Loft Kribi", price: 280000, location: "Kribi", category: "LOFT", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800", description: "Loft en bois et verre." },
        { id: 17, title: "Lot Oceanfront Kribi", price: 4000000, location: "Lobe, Kribi", category: "LAND", status: "AVAILABLE", mainImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800", description: "Terrain 2000m² en bord de mer." },
    ],
};

const DEMO_VISITS: VisitRequest[] = [
    { id: 1, visitorName: "Marc Ondoua", email: "marc.ondoua@gmail.cm", phone: "+237 677 100 200", visitDate: "2026-06-15", propertyName: "Villa Blanche Bastos", status: "PENDING" },
    { id: 2, visitorName: "Diane Mbarga", email: "diane.mbarga@gmail.cm", phone: "+237 699 300 400", visitDate: "2026-06-20", propertyName: "Appartement Crystal Akwa", status: "PENDING" },
];

export default function ProprietorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ id?: number; username?: string; fullName?: string; phone?: string; role?: string } | null>(null);
    const [activeTab, setActiveTab] = useState("properties");
    const [properties, setProperties] = useState<Property[]>([]);
    const [visits, setVisits] = useState<VisitRequest[]>([]);
    const [purchases] = useState<Purchase[]>([
        { id: 1, buyerName: "Marc Ondoua", propertyName: "Domaine de Bonabéri", amount: 750000, date: "2026-05-10", ref: "#KSM-44201-237" },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProperty, setEditProperty] = useState<Property | null>(null);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
    const [proprietorComments, setProprietorComments] = useState<any[]>([]);

    // Add form state
    const [newTitle, setNewTitle] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newCategory, setNewCategory] = useState("VILLA");
    const [newDescription, setNewDescription] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newCharImages, setNewCharImages] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("ksm_user");
        if (!stored) {
            router.push("/login?redirect=/proprietor/dashboard");
            return;
        }
        const u = JSON.parse(stored);

        // Strict role check
        if (u.role !== "PROPRIETOR") {
            localStorage.removeItem("ksm_user"); // Clear invalid session
            router.push("/login?redirect=/proprietor/dashboard");
            return;
        }

        setUser(u);

        // Fetch properties
        fetch(`${BACKEND}/properties/proprietor/${u.id}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setProperties(Array.isArray(data) ? data : []));

        // Fetch visits
        fetch(`${BACKEND}/visits`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const myVisits = data.filter((v: any) => v.property.proprietor.id === u.id);
                setVisits(myVisits.map((v: any) => ({
                    id: v.id,
                    visitorName: v.visitor.fullName || v.visitor.username,
                    email: v.visitor.email,
                    phone: v.visitor.phone,
                    visitDate: v.visitDate,
                    propertyName: v.property.title,
                    status: v.status
                })));
            });
    }, [router]);

    useEffect(() => {
        if (activePropertyId) {
            fetch(`${BACKEND}/comments/property/${activePropertyId}`)
                .then(res => res.json())
                .then(data => setProprietorComments(data));
        }
    }, [activePropertyId]);

    const handleLogout = () => { localStorage.removeItem("ksm_user"); router.push("/"); };

    const confirmVisit = async (id: number) => {
        try {
            const res = await fetch(`${BACKEND}/visits/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CONFIRMED" })
            });
            if (!res.ok) throw new Error("Erreur serveur");
            setVisits(prev => prev.map(v => v.id === id ? { ...v, status: "CONFIRMED" } : v));
            setNotifications(prev => [...prev, `✓ Visite confirmée`]);
        } catch (err) {
            console.error("Failed to confirm visit:", err);
            setNotifications(prev => [...prev, "Erreur lors de la confirmation."]);
        }
    };

    const rejectVisit = async (id: number) => {
        try {
            const res = await fetch(`${BACKEND}/visits/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "REJECTED" })
            });
            if (!res.ok) throw new Error("Erreur serveur");
            setVisits(prev => prev.map(v => v.id === id ? { ...v, status: "REJECTED" } : v));
            setNotifications(prev => [...prev, "Visite refusée."]);
        } catch (err) {
            console.error("Failed to reject visit:", err);
            setNotifications(prev => [...prev, "Erreur lors du refus."]);
        }
    };

    const togglePropertyStatus = async (id: number) => {
        try {
            const res = await fetch(`${BACKEND}/properties/${id}/toggle-status`, { method: "PUT" });
            if (!res.ok) throw new Error("Toggle failed");
            const updated = await res.json();
            setProperties(prev => prev.map(p => p.id === id ? updated : p));
            setNotifications(prev => [...prev, updated.active ? "Bien réactivé." : "Bien désactivé."]);
            setTimeout(() => setNotifications([]), 4000);
        } catch (err) {
            console.error("Failed to toggle status:", err);
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${BACKEND}/upload`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.url;
        } catch (err) {
            console.error("Upload failed", err);
            return null;
        }
    };

    const addProperty = async () => {
        if (!newTitle || !newPrice || !user) return;
        const body = {
            title: newTitle,
            price: parseFloat(newPrice),
            location: newLocation,
            category: newCategory,
            description: newDescription,
            mainImageUrl: newImageUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800",
            proprietorId: user.id,
            proprietorName: user.fullName,
            proprietorPhone: user.phone,
            characteristicImages: newCharImages
        };

        try {
            const res = await fetch(`${BACKEND}/properties`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error("Erreur lors de la création");
            const saved = await res.json();
            setProperties(prev => [saved, ...prev]);
            setShowAddModal(false);
            setNewTitle(""); setNewPrice(""); setNewLocation(""); setNewDescription(""); setNewImageUrl(""); setNewCharImages([]);
            setNotifications(prev => [...prev, "Bien publié avec succès !"]);
        } catch (err) {
            console.error("Failed to add property:", err);
            setNotifications(prev => [...prev, "Erreur lors de la publication."]);
        }
    };

    const saveEdit = async () => {
        if (!editProperty) return;
        try {
            const res = await fetch(`${BACKEND}/properties/${editProperty.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editProperty.title,
                    price: editProperty.price,
                    description: editProperty.description,
                    mainImageUrl: editProperty.mainImageUrl,
                    characteristicImages: editProperty.characteristicImages,
                    category: editProperty.category,
                    location: editProperty.location
                }),
            });
            if (res.ok) {
                const updated = await res.json();
                setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
                setNotifications(prev => [...prev, `"${updated.title}" mis à jour avec succès.`]);
                setTimeout(() => setNotifications([]), 4000);
            }
        } catch (err) {
            console.error("Failed to update property:", err);
        }
        setEditProperty(null);
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center bg-black text-white  text-2xl">Vérification...</div>;

    const availableProps = properties.filter(p => p.status === "AVAILABLE");
    const soldProps = properties.filter(p => p.status === "SOLD");
    const pendingVisits = visits.filter(v => v.status === "PENDING");

    return (
        <div className="min-h-screen bg-white">
            {/* Edit Modal */}
            {editProperty && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
                    <div className="bg-white max-w-lg w-full p-12 space-y-6 relative">
                        <button onClick={() => setEditProperty(null)} className="absolute top-6 right-6"><X size={24} /></button>
                        <h2 className="text-2xl  font-black uppercase">Modifier le Bien</h2>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Titre</label>
                                <input className="w-full border-b-2 border-black/20 focus:border-black py-2 outline-none text-sm font-bold" value={editProperty.title} onChange={e => setEditProperty({ ...editProperty, title: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Prix (FCFA)</label>
                                    <input type="number" className="w-full border-b-2 border-black/20 focus:border-black py-2 outline-none text-sm font-bold" value={editProperty.price} onChange={e => setEditProperty({ ...editProperty, price: parseFloat(e.target.value) })} /></div>
                                <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Catégorie</label>
                                    <select className="w-full border-b-2 border-black/20 focus:border-black py-2 outline-none text-sm font-bold" value={editProperty.category} onChange={e => setEditProperty({ ...editProperty, category: e.target.value })}>
                                        <option>VILLA</option><option>APARTMENT</option><option>LOFT</option><option>LAND</option>
                                    </select></div>
                            </div>
                            <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Localisation</label>
                                <input className="w-full border-b-2 border-black/20 focus:border-black py-2 outline-none text-sm font-bold" value={editProperty.location} onChange={e => setEditProperty({ ...editProperty, location: e.target.value })} /></div>
                            <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Description</label>
                                <textarea className="w-full border-b-2 border-black/20 focus:border-black py-2 outline-none text-sm resize-none" rows={3} value={editProperty.description} onChange={e => setEditProperty({ ...editProperty, description: e.target.value })} /></div>
                            <div><label className="text-[9px] uppercase font-black text-muted tracking-widest flex items-center gap-2"><Image size={12} /> Image Principale (Locale)</label>
                                <input type="file" accept="image/*" className="w-full text-[10px] py-1" onChange={async (e) => { if (e.target.files?.[0]) { const url = await handleFileUpload(e.target.files[0]); if (url) setEditProperty({ ...editProperty, mainImageUrl: url }); } }} /></div>

                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black text-muted tracking-widest flex items-center gap-2"><Image size={12} /> Galerie des Pièces</label>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {(editProperty.characteristicImages || []).map((img: string, idx: number) => (
                                        <div key={idx} className="relative w-16 h-16 flex-shrink-0">
                                            <img src={img} className="w-full h-full object-cover border border-black/10" alt="" />
                                            <button onClick={() => setEditProperty({ ...editProperty, characteristicImages: editProperty.characteristicImages.filter((_, i) => i !== idx) })} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                                        </div>
                                    ))}
                                    <label className="w-16 h-16 border-2 border-dashed border-black/10 flex items-center justify-center cursor-pointer hover:border-black transition-colors">
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={async (e) => {
                                            if (e.target.files) {
                                                const uploads = Array.from(e.target.files).map(f => handleFileUpload(f));
                                                const urls = (await Promise.all(uploads)).filter(u => u !== null) as string[];
                                                setEditProperty({ ...editProperty, characteristicImages: [...(editProperty.characteristicImages || []), ...urls] });
                                            }
                                        }} />
                                        <Plus size={16} className="text-muted" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button onClick={saveEdit} className="w-full bg-black text-white py-5 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-black/80 transition-all">
                            <Save size={16} /> Enregistrer les modifications
                        </button>
                    </div>
                </div>
            )}

            {/* Add Property Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
                    <div className="bg-white max-w-2xl w-full p-12 space-y-6 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6"><X size={24} /></button>
                        <h2 className="text-3xl  font-black uppercase">Nouvelle Annonce</h2>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2"><label className="text-[9px] uppercase font-black text-muted tracking-widest">Titre du Bien *</label>
                                <input required className="w-full border-b-2 border-black/20 focus:border-black py-3 outline-none text-sm font-bold uppercase" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="EX: VILLA LUXUEUSE À BASTOS" /></div>
                            <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Prix (FCFA) *</label>
                                <input type="number" required className="w-full border-b-2 border-black/20 focus:border-black py-3 outline-none text-sm font-bold" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="5000000" /></div>
                            <div><label className="text-[9px] uppercase font-black text-muted tracking-widest">Catégorie</label>
                                <select className="w-full border-b-2 border-black/20 focus:border-black py-3 outline-none text-sm font-bold" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                    <option>VILLA</option><option>APARTMENT</option><option>LOFT</option><option>LAND</option>
                                </select></div>
                            <div className="col-span-2"><label className="text-[9px] uppercase font-black text-muted tracking-widest">Localisation (Quartier, Ville)</label>
                                <input className="w-full border-b-2 border-black/20 focus:border-black py-3 outline-none text-sm" value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Bastos, Yaoundé" /></div>
                            <div className="col-span-2"><label className="text-[9px] uppercase font-black text-muted tracking-widest">Description</label>
                                <textarea className="w-full border border-black/10 p-4 outline-none text-sm resize-none bg-secondary" rows={4} value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez votre bien..." /></div>
                            <div className="col-span-2"><label className="text-[9px] uppercase font-black text-muted tracking-widest flex items-center gap-2"><Image size={12} /> Photo Principale (Local)</label>
                                <input type="file" accept="image/*" className="w-full text-[10px] py-3 cursor-pointer" onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleFileUpload(e.target.files[0]);
                                        if (url) setNewImageUrl(url);
                                    }
                                }} />
                                {newImageUrl && <p className="text-[8px] text-green-600 truncate mt-1">✓ Fichier prêt : {newImageUrl}</p>}
                            </div>
                            {newImageUrl && <div className="col-span-2"><img src={newImageUrl} alt="preview" className="w-full h-40 object-cover border border-black/10" /></div>}

                            <div className="col-span-2 space-y-4">
                                <label className="text-[9px] uppercase font-black text-muted tracking-widest flex items-center gap-2"><Image size={12} /> Photos des Pièces (Salon, Cuisine, etc.)</label>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {newCharImages.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0">
                                            <img src={img} className="w-full h-full object-cover border border-black/10" alt={`Pièce ${idx}`} />
                                            <button onClick={() => setNewCharImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={10} /></button>
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 border-2 border-dashed border-black/10 flex items-center justify-center cursor-pointer hover:border-black transition-colors">
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={async (e) => {
                                            if (e.target.files) {
                                                const uploads = Array.from(e.target.files).map(f => handleFileUpload(f));
                                                const urls = (await Promise.all(uploads)).filter(u => u !== null) as string[];
                                                setNewCharImages(prev => [...prev, ...urls]);
                                            }
                                        }} />
                                        <Plus size={20} className="text-muted" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button onClick={addProperty} className="w-full bg-black text-white py-6 font-black uppercase text-[10px] tracking-widest hover:bg-black/80 transition-all mt-6">
                            + Publier le Bien
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-black text-white px-8 py-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <p className="text-white/40 text-[9px] uppercase tracking-[0.5em] font-black mb-2">Propriétaire KSM</p>
                        <h1 className="text-4xl  font-black uppercase">ESPACE PROPRIÉTAIRE</h1>
                        <p className="text-white/60 text-sm mt-1">{user.fullName || user.username}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        {pendingVisits.length > 0 && (
                            <div className="bg-white/10 border border-white/20 px-6 py-3 text-center">
                                <p className="text-2xl font-black">{pendingVisits.length}</p>
                                <p className="text-[8px] uppercase tracking-widest text-white/50">Visites en attente</p>
                            </div>
                        )}
                        <div className="bg-white/10 border border-white/20 px-6 py-3 text-center">
                            <p className="text-2xl font-black">{properties.length}</p>
                            <p className="text-[8px] uppercase tracking-widest text-white/50">Biens</p>
                        </div>
                        <button onClick={() => setShowAddModal(true)} className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2">
                            <Plus size={16} /> Ajouter un Bien
                        </button>
                        <button onClick={handleLogout} className="border border-white/20 text-white/60 px-5 py-4 hover:text-white hover:border-white transition-all">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="bg-green-50 border-b border-green-200 px-8 py-4">
                    <div className="max-w-7xl mx-auto">
                        {notifications.map((n, i) => (
                            <div key={i} className="flex items-center gap-3 text-green-700 text-sm font-bold">
                                <Check size={16} /> {n}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Tabs */}
                <div className="flex gap-12 border-b border-black/5 mb-16">
                    {[
                        { key: "properties", label: `Mon Portefeuille (${properties.length})`, icon: Home },
                        { key: "visits", label: `Visites (${pendingVisits.length} en attente)`, icon: Calendar },
                        { key: "sold", label: `Ventes (${soldProps.length})`, icon: TrendingDown },
                    ].map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-[3px] flex items-center gap-2 ${activeTab === key ? "text-black border-black" : "text-muted border-transparent hover:text-black"}`}>
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>

                {/* Properties */}
                {activeTab === "properties" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {properties.filter(p => p.status === "AVAILABLE").map(p => (
                            <div key={p.id} className="bg-white border border-black/10 group">
                                <div className="relative aspect-video overflow-hidden">
                                    <img src={p.mainImageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">{p.category}</div>
                                </div>
                                <div className="p-7 space-y-4">
                                    <p className="text-[9px] text-muted uppercase tracking-widest">{p.location}</p>
                                    <h3 className=" font-black text-black text-lg">{p.title}</h3>
                                    <p className="text-muted text-xs line-clamp-2">{p.description}</p>
                                    <p className="font-black text-black text-lg">{p.price.toLocaleString("fr-FR")} FCFA</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-black/5">
                                        <div className="flex gap-4">
                                            <button onClick={() => setEditProperty(p)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest hover:text-black text-muted transition-colors">
                                                <Edit size={14} /> Modifier
                                            </button>
                                            <button onClick={() => { setActivePropertyId(p.id); setActiveTab("comments"); }} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest hover:text-black text-muted transition-colors">
                                                <Eye size={14} /> Avis
                                            </button>
                                            <button
                                                onClick={() => togglePropertyStatus(p.id)}
                                                className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors ${p.active === false ? "text-green-600 hover:text-green-800" : "text-muted hover:text-red-600"}`}
                                                title={p.active === false ? "Réactiver" : "Désactiver"}
                                            >
                                                {p.active === false ? <Check size={14} /> : <Trash2 size={14} />} {p.active === false ? "Réactiver" : "Désactiver"}
                                            </button>
                                        </div>
                                        <a href={`/properties/${p.id}`} className="text-[9px] uppercase font-black text-black border-b-2 border-black pb-0.5 hover:text-muted hover:border-muted transition-all">Savoir Plus</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setShowAddModal(true)} className="border-2 border-dashed border-black/20 flex flex-col items-center justify-center gap-4 py-20 hover:border-black hover:bg-secondary transition-all group min-h-[300px]">
                            <Plus size={40} className="text-black/20 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-black transition-colors">Ajouter un Bien</span>
                        </button>
                    </div>
                )}

                {/* Visits */}
                {activeTab === "visits" && (
                    <div className="border border-black/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-secondary border-b border-black/10 text-[9px] uppercase tracking-widest font-black text-black">
                                <tr>
                                    <th className="px-8 py-6">Visiteur</th>
                                    <th className="px-8 py-6">Propriété</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Contact</th>
                                    <th className="px-8 py-6">Statut</th>
                                    <th className="px-8 py-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {visits.map(v => (
                                    <tr key={v.id} className="hover:bg-secondary/40 transition-colors">
                                        <td className="px-8 py-8">
                                            <p className="font-black text-black text-sm">{v.visitorName}</p>
                                            <p className="text-[10px] text-muted">{v.email}</p>
                                        </td>
                                        <td className="px-8 py-8 text-sm  ">{v.propertyName}</td>
                                        <td className="px-8 py-8 text-[10px] font-black uppercase tracking-widest">{v.visitDate}</td>
                                        <td className="px-8 py-8 text-xs text-muted">{v.phone}</td>
                                        <td className="px-8 py-8">
                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${v.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                                v.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                                }`}>{v.status === "CONFIRMED" ? "Confirmée" : v.status === "REJECTED" ? "Refusée" : "En attente"}</span>
                                        </td>
                                        <td className="px-8 py-8">
                                            {v.status === "PENDING" && (
                                                <div className="flex gap-3">
                                                    <button onClick={() => confirmVisit(v.id)} className="bg-black text-white px-4 py-2 text-[8px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center gap-1">
                                                        <Check size={12} /> Confirmer
                                                    </button>
                                                    <button onClick={() => rejectVisit(v.id)} className="border border-black/20 text-black/50 px-4 py-2 text-[8px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all flex items-center gap-1">
                                                        <X size={12} /> Refuser
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Sold */}
                {activeTab === "sold" && (
                    <div className="space-y-8">
                        {soldProps.length === 0 && purchases.length === 0 ? (
                            <div className="py-32 text-center">
                                <ShieldCheck className="mx-auto text-black/10 mb-6" size={60} />
                                <p className="text-muted text-xs uppercase tracking-widest">Aucune vente enregistrée pour le moment.</p>
                            </div>
                        ) : (
                            <>
                                {soldProps.map(p => (
                                    <div key={p.id} className="p-8 border border-black/10 flex justify-between items-center">
                                        <div className="flex gap-6 items-center">
                                            <img src={p.mainImageUrl} className="w-24 h-16 object-cover" alt={p.title} />
                                            <div>
                                                <p className="font-black text-black">{p.title}</p>
                                                <p className="text-muted text-xs">{p.location}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-black text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest">VENDU</span>
                                            <p className="font-black text-black mt-2">{p.price.toLocaleString("fr-FR")} FCFA</p>
                                        </div>
                                    </div>
                                ))}
                                {purchases.map(p => (
                                    <div key={p.id} className="p-8 border border-green-200 bg-green-50 flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-black">{p.propertyName}</p>
                                            <p className="text-muted text-xs">Acheteur : {p.buyerName} — {p.date}</p>
                                            <p className="text-green-600 text-[9px] font-black uppercase tracking-widest">{p.ref}</p>
                                        </div>
                                        <p className="font-black text-black text-xl">{p.amount.toLocaleString("fr-FR")} FCFA</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {/* Comments */}
                {activeTab === "comments" && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl  font-black uppercase">Commentaires du Bien</h2>
                            <button onClick={() => setActiveTab("properties")} className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-black">← Retour aux biens</button>
                        </div>
                        <div className="space-y-6">
                            {proprietorComments.map(c => (
                                <div key={c.id} className="p-8 border border-black/10 bg-secondary/20">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="font-black text-black text-xs uppercase tracking-widest">{c.user?.fullName || c.user?.username}</p>
                                        <p className="text-[9px] text-muted">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-sm ">&quot;{c.text}&quot;</p>
                                </div>
                            ))}
                            {proprietorComments.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-black/5 text-muted text-xs uppercase tracking-widest font-black">
                                    Aucun commentaire pour ce bien.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
