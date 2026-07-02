"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Users, Building2, Shield, ArrowRight } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="relative h-[60vh] overflow-hidden bg-black flex items-center">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="relative z-10 max-w-5xl mx-auto px-8">
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.5em] mb-4">KSM Real Estate</p>
                    <h1 className="text-6xl md:text-8xl  font-black text-white uppercase tracking-tighter leading-none">
                        À Propos
                    </h1>
                    <div className="w-24 h-1 bg-white mt-8" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-24 space-y-24">

                {/* Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl  font-black text-black uppercase tracking-tight">Notre Mission</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            KSM Real Estate est une plateforme immobilière innovante conçue pour fluidifier
                            la relation entre acquéreurs et propriétaires de biens.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            Nous mettons la technologie au service de l&apos;immobilier camerounais pour offrir
                            une expérience transparente, rapide et sécurisée à tous nos utilisateurs.
                        </p>
                    </div>
                    <div className="bg-black p-12 text-white space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Fondée en</p>
                        <p className="text-7xl  font-black">2026</p>
                        <p className="text-white/60 text-sm mt-4">Yaoundé — Douala — Kribi</p>
                    </div>
                </div>

                {/* Three pillars */}
                <div className="space-y-8">
                    <h2 className="text-4xl  font-black text-black uppercase tracking-tight border-b-4 border-black inline-block pb-2">
                        Nos Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/10">
                        {[
                            {
                                icon: Users,
                                title: "Pour les Visiteurs",
                                desc: "Les visiteurs accèdent à un catalogue riche de propriétés, peuvent rechercher par critères, réserver des visites et effectuer un achat avec génération automatique d'un reçu de paiement au format PDF.",
                            },
                            {
                                icon: Building2,
                                title: "Pour les Propriétaires",
                                desc: "Les propriétaires de biens immobiliers disposent d'un espace dédié pour publier, modifier et supprimer leurs annonces, ainsi que pour consulter l'ensemble des demandes de visite reçues.",
                            },
                            {
                                icon: Shield,
                                title: "Pour les Administrateurs",
                                desc: "Les administrateurs assurent une supervision complète de la plateforme : modération des annonces, gestion des utilisateurs et suivi global des activités.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="p-12 border-r border-black/10 last:border-r-0 space-y-5 hover:bg-black hover:text-white group transition-all duration-300">
                                <div className="w-14 h-14 bg-black group-hover:bg-white rounded-full flex items-center justify-center transition-all">
                                    <item.icon className="text-white group-hover:text-black" size={24} />
                                </div>
                                <h3 className="text-xl  font-black uppercase tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div className="bg-black text-white p-16 space-y-10">
                    <h2 className="text-4xl  font-black uppercase tracking-tight">Nos Valeurs</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {["Transparence", "Excellence", "Confiance", "Innovation"].map((v) => (
                            <div key={v} className="space-y-3">
                                <div className="w-8 h-0.5 bg-white/30" />
                                <p className="font-black uppercase tracking-widest text-sm">{v}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-8">
                    <h2 className="text-4xl  font-black text-black uppercase tracking-tight">Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <a
                            href="tel:+237656309892"
                            className="border-2 border-black p-8 space-y-4 hover:bg-black hover:text-white group transition-all"
                        >
                            <Phone className="group-hover:text-white text-black" size={28} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white/50">Téléphone</p>
                                <p className="font-black text-black group-hover:text-white">+237 656 309 892</p>
                            </div>
                        </a>
                        <a
                            href="mailto:contact@ksm-realestate.cm"
                            className="border-2 border-black p-8 space-y-4 hover:bg-black hover:text-white group transition-all"
                        >
                            <Mail className="group-hover:text-white text-black" size={28} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white/50">Email</p>
                                <p className="font-black text-black group-hover:text-white">contact@ksm-realestate.cm</p>
                            </div>
                        </a>
                        <div className="border-2 border-black p-8 space-y-4">
                            <MapPin size={28} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Bureaux</p>
                                <p className="font-black text-black">Yaoundé — Douala — Kribi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center space-y-6 py-12 border-t border-black/10">
                    <p className="text-gray-400 text-sm uppercase tracking-widest font-black">Prêt à trouver votre bien de rêve ?</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all"
                    >
                        Explorer le Catalogue <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
