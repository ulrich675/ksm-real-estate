"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "./components/PropertyCard";
import { Search, MapPin, Phone, Building2, Home as HomeIcon, Trees, Layers } from "lucide-react";


const CATEGORIES = [
  { key: "TOUS", label: "Tous", icon: Layers },
  { key: "VILLA", label: "Villas", icon: HomeIcon },
  { key: "APARTMENT", label: "Appartements", icon: Building2 },
  { key: "LOFT", label: "Lofts", icon: Layers },
  { key: "LAND", label: "Terrains", icon: Trees },
  { key: "BUREAU", label: "Bureaux", icon: Layers },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TOUS");
  const [searchType, setSearchType] = useState("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [favCounts, setFavCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [totalProprietors, setTotalProprietors] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/properties")
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch properties:", err);
        setLoading(false);
      });

    fetch("http://localhost:8080/api/favorites/counts")
      .then(res => res.ok ? res.json() : {})
      .then(data => setFavCounts(data))
      .catch(err => console.error("Failed to fetch fav counts:", err));

    fetch("http://localhost:8080/api/users")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const propCount = data.filter((u: any) => u.role === "PROPRIETOR").length;
        setTotalProprietors(propCount);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredProperties = properties.filter(p => {
    const q = searchTerm.toLowerCase();
    let matchesSearch = true;

    if (q) {
      switch (searchType) {
        case "owner":
          matchesSearch = p.proprietorName.toLowerCase().includes(q);
          break;
        case "neighborhood":
          matchesSearch = p.neighborhood.toLowerCase().includes(q);
          break;
        case "city":
          matchesSearch = p.city.toLowerCase().includes(q);
          break;
        case "category":
          matchesSearch = p.category.toLowerCase().includes(q);
          break;
        default:
          matchesSearch = p.proprietorName.toLowerCase().includes(q) ||
            p.neighborhood.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.title.toLowerCase().includes(q);
      }
    }

    const matchesCategory = selectedCategory === "TOUS" || p.category === selectedCategory;
    const isAvailable = p.status === "AVAILABLE" && p.active !== false;
    return matchesSearch && matchesCategory && isAvailable;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const countA = favCounts[a.id] || 0;
    const countB = favCounts[b.id] || 0;
    return countB - countA;
  });

  const formatPrice = (p: number) => {
    if (p >= 1000000) return `${(p / 1000000).toFixed(1)} M FCFA`;
    return `${p.toLocaleString()} FCFA`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[86vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
          alt="Salon de luxe"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        <div className="relative z-10 text-center space-y-8 px-6 max-w-5xl w-full">
          <h1 className="text-5xl md:text-8xl  text-white tracking-tighter leading-none drop-shadow-2xl">
            L&apos;EXCELLENCE <br />
            <span className="font-light  text-white/80">Immobilière</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base uppercase tracking-[0.4em] font-medium">
            Yaoundé &bull; Douala &bull; Kribi
          </p>

          {/* Search bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {[
                { key: "all", label: "Tout" },
                { key: "owner", label: "Propriétaire" },
                { key: "neighborhood", label: "Quartier" },
                { key: "city", label: "Ville" },
                { key: "category", label: "Catégorie" },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSearchType(opt.key)}
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${searchType === opt.key
                    ? "bg-white text-black"
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex bg-white shadow-2xl">
              <div className="flex-grow flex items-center px-6">
                <Search className="text-muted mr-3 flex-shrink-0" size={18} />
                <input
                  type="text"
                  placeholder={
                    searchType === "owner" ? "Nom du propriétaire..." :
                      searchType === "neighborhood" ? "Nom du quartier..." :
                        searchType === "city" ? "Ville (Yaoundé, Douala, Kribi...)" :
                          searchType === "category" ? "Villa, Appartement, Loft, Terrain..." :
                            "Propriétaire, quartier, ville ou catégorie..."
                  }
                  className="w-full bg-transparent outline-none text-black text-xs uppercase tracking-widest font-black py-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex-shrink-0"
              >
                Explorer
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 pt-4">
            {[
              { label: "Biens", value: filteredProperties.length },
              { label: "Propriétaires", value: totalProprietors },
              { label: "Villes", value: new Set(properties.map(p => p.city)).size },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-white font-black text-2xl ">{s.value}</p>
                <p className="text-white/40 text-[8px] uppercase tracking-widest font-black">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devenir Propriétaire Banner */}
      <div className="bg-black text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm   text-white/70">Vous avez un bien immobilier à valoriser ?</p>
          <Link
            href="/become-proprietor"
            className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex-shrink-0"
          >
            Devenir Propriétaire →
          </Link>
        </div>
      </div>

      {/* Popular Section - Top 4 by favorites */}
      <section id="popular" className="py-24 px-8 max-w-[1600px] mx-auto w-full border-b border-black/5">
        <div className="space-y-12">
          <div className="flex justify-between items-end pb-10">
            <div className="space-y-2">
              <h2 className="text-4xl  font-black text-black">Les Plus Aimés</h2>
              <p className="text-muted text-[10px] uppercase tracking-[0.4em] font-medium">Biens classés par nombre de favoris (Coups de Cœur des Visiteurs)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {sortedProperties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} formatPrice={formatPrice} />
            ))}
          </div>

          {sortedProperties.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-black/5">
              <p className="text-muted text-[10px] uppercase tracking-widest font-black">Aucun bien populaire pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Full Catalog Section - All properties sorted by favorites */}
      <section id="catalogue" className="py-24 px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-black/5 pb-10">
          <div className="space-y-2">
            <h2 className="text-4xl  font-black text-black">Tout le Catalogue</h2>
            <p className="text-muted text-[10px] uppercase tracking-[0.4em] font-medium">
              Collection Globale — {filteredProperties.length} bien{filteredProperties.length > 1 ? "s" : ""} (Populaires et autres, triés par préférence)
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.25em] font-black">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`transition-all pb-2 ${selectedCategory === key ? "text-black border-b-[3px] border-black" : "text-muted hover:text-black"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} formatPrice={formatPrice} />
          ))}
        </div>

        {filteredProperties.length === 0 && !loading && (
          <div className="py-40 text-center space-y-6">
            <MapPin className="mx-auto text-muted/20" size={80} />
            <p className="text-muted text-xs uppercase tracking-widest font-bold">Aucun bien ne correspond à votre recherche.</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("TOUS"); setSearchType("all"); }} className="text-black underline text-xs font-bold">Réinitialiser</button>
          </div>
        )}
      </section>

      {/* Contact Flottant */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <a
          href="tel:+237656309892"
          className="bg-black text-white px-8 py-5 flex items-center gap-4 premium-shadow hover:scale-105 transition-transform"
        >
          <Phone size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">+237 656 309 892</span>
        </a>
      </div>
    </div>
  );
}
