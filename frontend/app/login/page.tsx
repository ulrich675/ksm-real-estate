"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { validateEmail, validatePhone } from "../utils/validation";

const BACKEND = "http://localhost:8080/api";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
  const redirectUrl = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "register">(defaultTab as "login" | "register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginFullName, setLoginFullName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regFullName, setRegFullName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: loginFullName, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("ksm_user", JSON.stringify(data.user));
        if (data.user.role === "ADMIN") router.push("/admin/dashboard");
        else if (data.user.role === "PROPRIETOR") router.push("/proprietor/dashboard");
        else router.push(redirectUrl);
      } else {
        setError(data.message || "Identifiants incorrects.");
      }
    } catch {
      setError("Le serveur KSM ne répond pas. Veuillez vérifier que le backend est lancé.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(regEmail)) {
      setError("L'email doit utiliser l'un de ces domaines: gmail.com, outlook.com, hotmail.com, live.com, yahoo.com, yahoo.fr, protonmail.com, proton.me, icloud.com, mail.com, gmx.com, aol.com");
      return;
    }

    if (!validatePhone(regPhone)) {
      setError("Le numéro de téléphone doit être au format camerounais (+237 6...)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName,
          password: regPassword,
          email: regEmail,
          phone: regPhone
        }),
      });
      const data = await res.json();
      if (data.success || data.id) {
        localStorage.setItem("ksm_user", JSON.stringify(data.user || data));
        router.push(redirectUrl);
      } else {
        setError(data.message || "Erreur lors de l'inscription.");
      }
    } catch {
      setError("Le serveur KSM ne répond pas. Veuillez vérifier que le backend est lancé sur le port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-black" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white shadow-[0_100px_200px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Left branding */}
        <div className="hidden lg:flex flex-col justify-between p-20 bg-black text-white relative overflow-hidden">
          <div className="space-y-8">
            <div className="w-16 h-16 border-2 border-white/20 flex items-center justify-center rotate-45">
              <span className="text-3xl  font-black -rotate-45">K</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl  font-black leading-none uppercase">
                L&apos;Excellence <br /><span className="text-white/40 ">Partagée</span>
              </h2>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black ">Membre Privilégié KSM</p>
            </div>
          </div>
          {/* Living room image hint */}
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop"
            className="absolute bottom-0 left-0 w-full h-40 object-cover opacity-10"
            alt=""
          />
          <div className="space-y-4 relative">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-white/30" size={22} />
              <p className="text-[9px] uppercase tracking-widest font-black text-white/30">Sécurité & Confidentialité</p>
            </div>
            <p className="text-[9px] uppercase tracking-widest font-black text-white/20">© 2026 KSM Real Estate</p>
          </div>
          <div className="absolute -right-20 top-1/3 text-[200px]  font-black text-white/5 select-none">KSM</div>
        </div>

        {/* Right form */}
        <div className="p-12 md:p-16 space-y-10">
          {/* Tabs */}
          <div className="flex border-b border-black/5">
            <button
              onClick={() => setMode("login")}
              className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 flex-grow ${mode === "login" ? "text-black border-black" : "text-black/20 border-transparent hover:text-black/40"}`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode("register")}
              className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 flex-grow ${mode === "register" ? "text-black border-black" : "text-black/20 border-transparent hover:text-black/40"}`}
            >
              Inscription
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl  font-black text-black uppercase">
              {mode === "login" ? "Accès Membre" : "Rejoindre le Réseau"}
            </h3>
            <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-black">
              {mode === "login" ? "Entrez votre nom complet et votre mot de passe." : "Inscrivez-vous pour accéder à nos services immobiliers."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 px-5 py-4 text-xs text-red-700 font-bold">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-6">
                <InputField label="Nom Complet" icon={<User size={16} />} value={loginFullName} onChange={setLoginFullName} placeholder="VOTRE NOM COMPLET" required />
                <InputField label="Mot de Passe" icon={<Lock size={16} />} value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" type="password" required />
              </div>
              <SubmitButton loading={loading} label="S'Identifier" />
              <p className="text-center text-[9px] text-black/30 uppercase tracking-widest">
                Pas encore inscrit ?{" "}
                <button type="button" onClick={() => setMode("register")} className="text-black font-black hover:underline">
                  Créer un compte
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-8">
              <div className="space-y-6">
                <InputField label="Nom Complet" icon={<User size={16} />} value={regFullName} onChange={setRegFullName} placeholder="NOM PRÉNOM" required />
                <InputField label="Email (Domaine validé)" icon={<Mail size={16} />} value={regEmail} onChange={setRegEmail} placeholder="utilisateur@gmail.com" type="email" required />
                <InputField label="Téléphone (+237)" icon={<Phone size={16} />} value={regPhone} onChange={setRegPhone} placeholder="+237 6XX XXX XXX" type="tel" required />
                <InputField label="Mot de Passe" icon={<Lock size={16} />} value={regPassword} onChange={setRegPassword} placeholder="••••••" type="password" required />
              </div>
              <SubmitButton loading={loading} label="Créer mon Compte" />
              <p className="text-center text-[9px] text-black/30 uppercase tracking-widest">
                Déjà membre ?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-black font-black hover:underline">
                  Se connecter
                </button>
              </p>
            </form>
          )}

          {/* Tips hint */}
          <div className="bg-secondary border border-black/5 p-5 text-[9px] space-y-1">
            <p className="font-black uppercase tracking-widest text-black underline mb-2">Note de sécurité :</p>
            <p className="text-muted ">Vos accès sont protégés. Pour une première visite ou un achat direct, l&apos;inscription est obligatoire et immédiate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, icon, value, onChange, placeholder, type = "text", required = false }: {
  label: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean;
}) {
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
          className="w-full bg-transparent border-b border-black/10 pl-7 py-3 focus:outline-none focus:border-black transition-colors text-xs font-bold tracking-wider"
        />
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-black text-white font-black py-7 uppercase text-[10px] tracking-[0.4em] shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
    >
      {loading ? "En cours..." : label}
      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
    </button>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white  text-2xl">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}
