import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "KSM Real Estate | Excellence Immobilière",
  description: "Plateforme immobilière premium au Cameroun – Yaoundé, Douala, Kribi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="light">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-black/5">
            {/* Logo with couch shadow */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-white shadow-xl z-10 relative group-hover:scale-105 transition-transform">
                  K
                </div>
                {/* Couch shadow under logo */}
                <div className="relative w-14 -mt-1">
                  <svg viewBox="0 0 56 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-20">
                    <rect x="2" y="4" width="52" height="7" rx="3.5" fill="#000" />
                    <rect x="0" y="2" width="12" height="10" rx="3" fill="#000" />
                    <rect x="44" y="2" width="12" height="10" rx="3" fill="#000" />
                    <rect x="8" y="8" width="40" height="6" rx="1" fill="#000" />
                    <rect x="10" y="11" width="6" height="3" rx="1" fill="#000" />
                    <rect x="40" y="11" width="6" height="3" rx="1" fill="#000" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-black leading-none">KSM REAL ESTATE</h1>
            </a>

            <div className="hidden lg:flex gap-6 items-center text-[10px] uppercase tracking-[0.25em] font-black">
              <Link href="/" className="hover:text-muted transition-colors">Accueil</Link>
              <Link href="/about" className="hover:text-muted transition-colors border-l border-black/10 pl-6">À Propos</Link>
              <Link href="/favorites" className="hover:text-muted transition-colors border-l border-black/10 pl-6">❤️ Favoris</Link>
              <Link href="/compare" className="hover:text-muted transition-colors border-l border-black/10 pl-6">Comparer</Link>
              <Link href="/history" className="hover:text-muted transition-colors border-l border-black/10 pl-6">Historique</Link>
              <Link href="/become-proprietor" className="hover:text-muted transition-colors border-l border-black/10 pl-6">Devenir Propriétaire</Link>
              <Link href="/proprietor/dashboard" className="hover:text-muted transition-colors border-l border-black/10 pl-6">Espace Prop.</Link>
              <Link href="/admin/dashboard" className="hover:text-muted transition-colors border-l border-black/10 pl-6">Admin</Link>
              <Link href="/login" className="bg-black text-white px-8 py-3 rounded-none hover:bg-black/80 transition-all duration-300 ml-2">
                Login
              </Link>
            </div>

            {/* Mobile nav */}
            <div className="lg:hidden flex gap-4">
              <Link href="/favorites" className="text-black text-[10px] font-black uppercase tracking-widest">❤️</Link>
              <Link href="/history" className="text-black text-[10px] font-black uppercase tracking-widest border-b border-black/20 pb-0.5">Historique</Link>
              <Link href="/login" className="bg-black text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest">Login</Link>
            </div>
          </nav>

          <main className="flex-grow bg-white">{children}</main>

          <footer className="py-24 border-t border-black/5 bg-secondary px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
              <div className="space-y-6 col-span-2">
                <h2 className="text-3xl font-black text-black">KSM REAL ESTATE</h2>
                <p className="text-muted text-sm max-w-sm leading-relaxed">
                  L&apos;excellence immobilière au Cameroun. Une sélection exclusive de propriétés à Yaoundé, Douala et Kribi.
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="text-black uppercase tracking-[0.2em] text-xs font-black">Navigation</h4>
                <ul className="text-sm text-muted space-y-3 font-medium">
                  <li><a href="/history" className="hover:text-black transition-colors">Mon Historique</a></li>
                  <li><a href="/become-proprietor" className="hover:text-black transition-colors">Devenir Propriétaire</a></li>
                  <li><a href="/proprietor/dashboard" className="hover:text-black transition-colors">Espace Propriétaire</a></li>
                  <li><a href="/admin/dashboard" className="hover:text-black transition-colors">Espace Admin</a></li>
                  <li><a href="/login" className="hover:text-black transition-colors">Connexion / Inscription</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-black uppercase tracking-[0.2em] text-xs font-black">Contact Direct</h4>
                <p className="text-lg text-black font-black">+237 656 309 892</p>
                <p className="text-sm text-muted">contact@ksm-realestate.cm</p>
              </div>
            </div>
            <div className="mt-24 pt-10 border-t border-black/5 text-center text-muted text-[10px] uppercase tracking-[0.3em] font-bold">
              <p>&copy; 2026 KSM Real Estate. Design Minimaliste &amp; Excellence.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
