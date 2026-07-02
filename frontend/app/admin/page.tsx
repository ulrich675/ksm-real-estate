"use client";

export default function AdminDashboard() {
  return (
    <div className="px-6 py-12 space-y-12">
      <h1 className="text-4xl ">Administration Globale</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Propriétés Totales", value: "24", sub: "+2 ce mois" },
          { label: "Visites Demandées", value: "142", sub: "12 en attente" },
          { label: "Chiffre d'Affaires Simulé", value: "24.5M", sub: "FCFA" },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 border-l-2 border-gold space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="text-4xl ">{stat.value}</p>
            <p className="text-[10px] text-gold">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl ">Derniers Utilisateurs</h2>
        <div className="glass border border-gold/10">
           {/* Simple list simulation */}
           <div className="p-6 text-muted text-sm text-center">Chargement des données...</div>
        </div>
      </div>
    </div>
  );
}
