"use client";

import { useState } from "react";

export default function ProprietorDashboard() {
  const [properties] = useState([
    { id: 1, title: "Villa de Luxe Bastos", price: 1200000, status: "Active" },
    { id: 2, title: "Penthouse Bonapriso", price: 850000, status: "Active" },
  ]);

  return (
    <div className="px-6 py-12 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl ">Tableau de Bord Propriétaire</h1>
        <button className="gold-gradient text-black font-bold px-6 py-2 rounded-sm text-xs uppercase tracking-widest">
          Nouveau Bien
        </button>
      </div>

      <div className="glass border border-gold/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-gold/10">
            <tr>
              <th className="px-6 py-4">Propriété</th>
              <th className="px-6 py-4">Prix (FCFA)</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-6 ">{p.title}</td>
                <td className="px-6 py-6 font-bold">{p.price.toLocaleString()}</td>
                <td className="px-6 py-6 text-xs text-gold">{p.status}</td>
                <td className="px-6 py-6 flex gap-4">
                  <button className="text-[10px] uppercase tracking-widest hover:text-gold">Modifier</button>
                  <button className="text-[10px] uppercase tracking-widest text-red-500/70 hover:text-red-500">Désactiver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
