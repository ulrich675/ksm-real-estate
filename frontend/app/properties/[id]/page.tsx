"use client";

import { useState, useEffect, use, Suspense } from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone, Calendar, ShieldCheck, Download, ChevronRight, X, Eye, ArrowRight, Check, TrendingUp, Clock, Share2, Mail, Play, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import VirtualTourViewer from "../../components/VirtualTourViewer";
import { validateEmail, validatePhone } from "../../utils/validation";

// Simulated coordinates by neighborhood
const COORDS: Record<string, [number, number]> = {
  Bastos: [3.8815, 11.5165],
  Golf: [3.8875, 11.5235],
  Bonapriso: [4.0345, 9.7025],
  Bonanjo: [4.0415, 9.7145],
  Akwa: [4.0505, 9.7065],
  Messa: [3.8965, 11.5055],
  Bassa: [4.0195, 9.7785],
  Omnisports: [3.8555, 11.5345],
  Lobe: [2.9365, 9.9435],
  Plage: [2.9405, 9.9265],
  Centre: [2.9385, 9.9325],
  Nkolbisson: [3.9185, 11.4575],
  Ngousso: [3.8875, 11.5455],
  "Bonabéri": [4.0655, 9.6895],
  "Etoa-Meki": [3.8645, 11.5275],
  default: [3.8480, 11.5021],
};

const PRICE_PER_M2: Record<string, number> = {
  VILLA: 500000,
  APARTMENT: 400000,
  LOFT: 450000,
  LAND: 80000,
  BUREAU: 600000,
};

const PropertyMap = dynamic(() => import("../../components/PropertyMap"), { ssr: false, loading: () => <div className="h-80 bg-gray-100 flex items-center justify-center text-sm text-gray-400">Chargement de la carte...</div> });

// All 20 properties with characteristic images and full details

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authAction, setAuthAction] = useState<"visit" | "purchase" | null>(null);
  const [user, setUser] = useState<{ id?: number; fullName?: string; username?: string; email?: string; phone?: string; role?: string } | null>(null);
  const [featureImg, setFeatureImg] = useState<string | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitSent, setVisitSent] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState(1);
  const [purchaseRef, setPurchaseRef] = useState(`KSM-${Math.floor(Math.random() * 90000) + 10000}-237`);
  const [buyerFullName, setBuyerFullName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [showEstimator, setShowEstimator] = useState(false);
  const [surface, setSurface] = useState<number>(100);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [tourPrice, setTourPrice] = useState<{ hearts: number; price: number } | null>(null);
  const [tourPaid, setTourPaid] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showTourViewer, setShowTourViewer] = useState(false);
  const [processingTourPayment, setProcessingTourPayment] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number | null>(null);
  const [alreadyBought, setAlreadyBought] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/properties/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Propriété non trouvée");
        return res.json();
      })
      .then(data => {
        if (data.active === false && (!user || user.role !== 'ADMIN' && user.id !== data.proprietor?.id)) {
          router.push("/");
          return;
        }
        setProperty(data);
        setLoading(false);
        fetchComments(id);
        fetchTourPrice(id);
      })
      .catch(err => {
        console.error("Error fetching property:", err);
        setLoading(false);
        setProperty(null);
      });
  }, [id]);

  // Check if already bought when both user and property are loaded
  useEffect(() => {
    const stored = localStorage.getItem("ksm_user");
    if (!stored || !id) return;
    const u = JSON.parse(stored);
    fetch(`http://localhost:8080/api/purchases/check?userId=${u.id}&propertyId=${id}`)
      .then(res => res.ok ? res.json() : { alreadyBought: false })
      .then(data => {
        const isBought = data.alreadyBought || false;
        setAlreadyBought(isBought);

        // Access control for SOLD properties
        if (property?.status === "SOLD") {
          const isAdmin = u.role === "ADMIN";
          const isOwner = property.proprietor?.id === u.id;
          if (!isBought && !isAdmin && !isOwner) {
            alert("Ce bien a été vendu et n'est plus consultable publiquement.");
            router.push("/");
          }
        }
      })
      .catch(() => { });
  }, [id, property, router]);

  const fetchTourPrice = (propId: string) => {
    fetch(`http://localhost:8080/api/virtual-tours/price/${propId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setTourPrice(data))
      .catch(err => console.error("Error fetching tour price:", err));
  };

  const checkTourPaid = () => {
    if (!user || !property) return;
    fetch(`http://localhost:8080/api/virtual-tours/paid?userId=${user.id}&propertyId=${property.id}`)
      .then(res => res.ok ? res.json() : { paid: false })
      .then(data => setTourPaid(data.paid || false))
      .catch(err => console.error("Error checking tour payment:", err));
  };

  const fetchComments = (propId: string) => {
    fetch(`http://localhost:8080/api/comments/property/${propId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching comments:", err);
        setComments([]);
      });
  };

  useEffect(() => {
    const stored = localStorage.getItem("ksm_user");
    let u = null;
    if (stored) {
      u = JSON.parse(stored);
      setUser(u);
      setBuyerFullName(u.fullName || "");
      setBuyerEmail(u.email || "");
      setBuyerContact(u.phone || "");
    }
    const userId = u?.id || "guest";
    const rv: any[] = JSON.parse(localStorage.getItem(`ksm_recently_viewed_${userId}`) || "[]");
    setRecentlyViewed(rv);
  }, []);

  useEffect(() => {
    if (user && property) {
      checkTourPaid();
    }
  }, [user, property]);

  useEffect(() => {
    if (!property) return;
    const userId = user?.id || "guest";
    const key = `ksm_recently_viewed_${userId}`;
    const rv: any[] = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = rv.filter((p: any) => p.id !== property.id);
    const updated = [property, ...filtered].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
    setRecentlyViewed(updated);
  }, [property, user]);
  const toggleFavorite = () => {
    if (!user) {
      router.push(`/login?redirect=/properties/${property.id}`);
      return;
    }

    fetch(`http://localhost:8080/api/favorites/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId: property.id }),
    })
      .then(res => res.text().then(text => text ? JSON.parse(text) : {}))
      .then(data => {
        setProperty((prev: any) => ({ ...prev, hearts: data.hearts }));
        // Update tour price locally immediately for immediate feedback
        setTourPrice((prev: any) => prev ? { ...prev, hearts: data.hearts, price: Math.max(500, 5000 - (data.hearts * 500)) } : null);
      })
      .catch(err => console.error("Error toggling favorite:", err));
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center  text-2xl uppercase tracking-widest animate-pulse">Chargement par KSM...</div>;
  if (!property) return <div className="min-h-screen bg-white flex items-center justify-center  text-2xl">Propriété non trouvée.</div>;

  const handleTourPayment = async () => {
    if (!user || !property) return;

    setProcessingTourPayment(true);
    try {
      const res = await fetch("http://localhost:8080/api/virtual-tours/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          propertyId: property.id
        })
      });
      if (res.ok) {
        setTourPaid(true);
        setShowTourModal(false);
        setShowTourViewer(true);
      } else {
        alert("Erreur lors de la transaction de visite virtuelle.");
      }
    } catch (err) {
      console.error("Tour payment failed:", err);
      alert("Erreur lors du paiement.");
    } finally {
      setProcessingTourPayment(false);
    }
  };

  const launchTour = () => {
    alert("L'immersion 3D est momentanément indisponible sur ce bien.");
  };

  const requireAuth = (action: "visit" | "purchase") => {
    if (!user) {
      router.push(`/login?redirect=/properties/${property.id}`);
      return;
    }
    if (action === "visit") {
      setShowVisitModal(true);
    } else if (action === "purchase") {
      if (alreadyBought) {
        alert("Vous avez déjà acquis ce bien. Retrouvez-le dans votre historique.");
        return;
      }
      if (property.status === "SOLD") {
        alert("Ce bien n'est plus disponible.");
        return;
      }
      setShowPurchaseModal(true);
    }
  };


  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR", { style: "currency", currency: "XAF" }).replace("FCFA", "").trim() + " FCFA";
  };

  const handlePurchaseConfirm = async () => {
    if (!user) return;

    if (!validateEmail(buyerEmail)) {
      alert("L'email doit impérativement se terminer par @gmail.com");
      return;
    }

    if (!validatePhone(buyerContact)) {
      alert("Le numéro de téléphone doit être au format camerounais (+237 6...)");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          userId: user.id || 0
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPurchaseRef(data.transactionReference);
        setPurchaseStep(2);
        // Automatically trigger PDF after success
        setTimeout(() => {
          generatePDF();
        }, 1000);
      } else {
        alert("Erreur lors de la transaction.");
      }
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  };

  const handleVisitConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!visitDate) {
      alert("Veuillez sélectionner une date pour la visite.");
      return;
    }

    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("La date de visite ne peut pas être dans le passé.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          visitorId: user.id || 0,
          visitDate,
          message: `Demande de visite pour ${property.title}`
        })
      });
      if (res.ok) {
        setVisitSent(true);
      }
    } catch (err) {
      console.error("Visit submission failed:", err);
    }
  };

  const handleCommentPost = async () => {
    if (!user || !newComment.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          userId: user.id,
          propertyId: property.id
        })
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(property.id);
      }
    } catch (err) {
      console.error("Comment post failed:", err);
    } finally {
      setPostingComment(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const ref = `#${purchaseRef}`;
    const date = new Date().toLocaleDateString("fr-FR");
    const fullName = buyerFullName || user?.fullName || user?.username || "—";
    const email = buyerEmail || user?.email || "—";
    const phone = buyerContact || user?.phone || "—";

    const formatPriceForPDF = (p: number) => {
      if (p >= 1000000) return `${(p / 1000000).toFixed(p % 1000000 === 0 ? 0 : 1)} M FCFA`;
      return `${p.toLocaleString("fr-FR")} FCFA`;
    };

    // Header bar
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 45, "F");

    // KSM Logo (text-based)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("KSM", 20, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("REAL ESTATE", 53, 22);
    doc.setFontSize(8);
    doc.text("L'Excellence Immobilière — Yaoundé | Douala | Kribi", 20, 32);
    doc.setFontSize(7);
    doc.text("contact@ksm-realestate.cm | +237 656 309 892", 20, 39);

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("REÇU DE PAIEMENT", 20, 62);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Référence : ${ref}`, 20, 70);
    doc.text(`Date : ${date}`, 20, 77);

    // Box border
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.rect(15, 50, 180, 210);

    // Separator
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);

    // Property info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BIEN IMMOBILIER", 20, 97);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Titre : ${property.title}`, 20, 106);
    doc.text(`Localisation : ${property.location}`, 20, 114);
    doc.text(`Catégorie : ${property.category}`, 20, 122);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Montant : ${property.price.toLocaleString("fr-FR")} FCFA`, 20, 132);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 138, 190, 138);

    // Owner info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("PROPRIÉTAIRE DU BIEN", 20, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nom : ${property.proprietorName || "KSM Real Estate"}`, 20, 159);
    doc.text(`Téléphone : ${property.proprietorPhone || "+237 656 309 892"}`, 20, 167);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 173, 190, 173);

    // Buyer info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("INFORMATIONS ACQUÉREUR", 20, 185);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nom Complet : ${fullName}`, 20, 194);
    doc.text(`Email : ${email}`, 20, 202);
    doc.text(`Téléphone : ${phone}`, 20, 210);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 218, 190, 218);

    // Validation stamp
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("✓ TRANSACTION VALIDÉE", 20, 235);

    // Footer
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 268, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("KSM REAL ESTATE — +237 656 309 892 — contact@ksm-realestate.cm", 20, 280);
    doc.setFont("helvetica", "normal");
    doc.text("© 2026 KSM Real Estate. Tous droits réservés.", 20, 288);

    doc.save(`KSM_Recu_${property.id}_${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Feature Image Lightbox (Enhanced with Navigation) */}
      {currentGalleryIndex !== null && property.characteristicImages && (
        <div className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-6">
          <button onClick={() => setCurrentGalleryIndex(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 z-50"><X size={32} /></button>

          <button
            onClick={(e) => { e.stopPropagation(); setCurrentGalleryIndex(prev => prev! > 0 ? prev! - 1 : property.characteristicImages.length - 1); }}
            className="absolute left-6 text-white hover:bg-white/10 p-4 rounded-full transition-all"
          >
            <ChevronRight size={48} className="rotate-180" />
          </button>

          <img src={property.characteristicImages[currentGalleryIndex]} className="max-h-[90vh] max-w-[80vw] object-contain transition-all duration-500" alt="Pièce" />

          <button
            onClick={(e) => { e.stopPropagation(); setCurrentGalleryIndex(prev => prev! < property.characteristicImages.length - 1 ? prev! + 1 : 0); }}
            className="absolute right-6 text-white hover:bg-white/10 p-4 rounded-full transition-all"
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-10 text-white/50 text-[10px] font-black uppercase tracking-widest">
            Piece {currentGalleryIndex + 1} / {property.characteristicImages.length}
          </div>
        </div>
      )}

      {/* Auth Gate (Re-integrated) */}
      {showAuthGate && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-6">
          <div className="bg-white max-w-md w-full p-12 space-y-8 text-center rounded-sm">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl  font-black text-black uppercase">Identification</h2>
              <p className="text-muted text-sm">Veuillez vous connecter pour continuer cette action.</p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => router.push(`/login?tab=register&redirect=/properties/${property.id}`)}
                className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-2"
              >
                S&apos;Inscrire <ArrowRight size={14} />
              </button>
              <button
                onClick={() => router.push(`/login?redirect=/properties/${property.id}`)}
                className="w-full border-2 border-black text-black py-5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Connexion
              </button>
            </div>
            <button onClick={() => setShowAuthGate(false)} className="text-muted text-xs hover:text-black">Annuler</button>
          </div>
        </div>
      )}

      {/* Visit Modal (Re-integrated) */}
      {showVisitModal && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-10 relative rounded-sm">
            <button onClick={() => { setShowVisitModal(false); setVisitSent(false); }} className="absolute top-4 right-4"><X size={20} /></button>
            {!visitSent ? (
              <div className="space-y-6">
                <h3 className="text-2xl  font-black uppercase">Planifier une Visite</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-black text-muted tracking-widest">Date Souhaitée</label>
                    <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} className="w-full border-b border-black/20 focus:border-black py-2 outline-none text-sm font-bold" />
                  </div>
                  <button onClick={handleVisitConfirm} className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest">Confirmer la Demande</button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-6">
                <Check size={40} className="mx-auto text-green-500" />
                <p className=" font-black uppercase">Demande Envoyée</p>
                <button onClick={() => setShowVisitModal(false)} className="text-[9px] font-black uppercase underline">Fermer</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Purchase Modal (Re-integrated) */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-6 text-black">
          <div className="bg-white max-w-lg w-full p-14 relative border-t-8 border-black">
            <button onClick={() => { setShowPurchaseModal(false); setPurchaseStep(1); }} className="absolute top-6 right-6"><X size={24} /></button>
            {purchaseStep === 1 ? (
              <div className="space-y-8">
                <h2 className="text-4xl  font-black text-center">ACQUISITION</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Nom Complet" value={buyerFullName} onChange={e => setBuyerFullName(e.target.value)} className="w-full border-b-2 border-black/10 py-3 outline-none" />
                  <input type="tel" placeholder="+237 6XX XXX XXX" value={buyerContact} onChange={e => setBuyerContact(e.target.value)} className="w-full border-b-2 border-black/10 py-3 outline-none" />
                </div>
                <button onClick={handlePurchaseConfirm} className="w-full bg-black text-white py-5 font-black uppercase tracking-widest text-[10px]">Confirmer l&apos;Achat Direct</button>
              </div>
            ) : (
              <div className="text-center space-y-8">
                <ShieldCheck size={48} className="mx-auto text-green-500" />
                <h2 className="text-3xl  font-black">Transaction Réussie</h2>
                <button onClick={() => generatePDF()} className="border-2 border-black px-8 py-3 uppercase font-black text-[10px]">Télécharger mon reçu</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Virtual Tour Viewer (Full Screen) */}
      {showTourViewer && property && (() => {
        let parsedNodes: any[] = [];
        const rawJson = property.virtualTourNodesJson;

        if (rawJson) {
          try {
            if (typeof rawJson === 'string') {
              const parsed = JSON.parse(rawJson);
              parsedNodes = Array.isArray(parsed) ? parsed : (parsed.nodes || []);
            } else if (Array.isArray(rawJson)) {
              parsedNodes = rawJson;
            }
          } catch (e) { console.error('Invalid tour JSON:', e); }
        }

        // Fallback: Generate nodes from characteristicImages if no JSON
        if (parsedNodes.length === 0 && property.characteristicImages && property.characteristicImages.length > 0) {
          parsedNodes = property.characteristicImages.map((img: string, i: number) => ({
            nodeId: String(i),
            label: `Espace ${i + 1}`,
            panoramaUrl: img,
            connections: property.characteristicImages.length > 1 ? [String((i + 1) % property.characteristicImages.length)] : [],
            x: i * 100,
            y: 0
          }));
        }

        return parsedNodes.length > 0 ? (
          <div className="fixed inset-0 z-[600] bg-black">
            <button onClick={() => setShowTourViewer(false)} className="absolute top-8 right-8 z-[610] bg-white text-black p-4 rounded-full transition-all hover:rotate-90"><X size={28} /></button>
            <VirtualTourViewer nodes={parsedNodes} onClose={() => setShowTourViewer(false)} />
          </div>
        ) : (
          <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center">
            <div className="text-white text-center space-y-4">
              <p className="text-2xl ">Immersion non disponible pour ce bien</p>
              <button onClick={() => setShowTourViewer(false)} className="border border-white px-8 py-3 uppercase font-black text-[10px]">Retour</button>
            </div>
          </div>
        );
      })()}

      {/* Modal Payment (Tour) */}
      {showTourModal && tourPrice && (
        <div className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-6">
          <div className="bg-white max-w-sm w-full p-10 space-y-6 relative border-t-4 border-black">
            <button onClick={() => setShowTourModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
            <div className="text-center space-y-2">
              <h3 className="text-xl  font-black uppercase tracking-tight">Immersion 3D</h3>
              <p className="text-[10px] text-muted font-bold tracking-widest uppercase">Paiement Mobile Money</p>
            </div>
            <div className="p-6 bg-secondary/30 text-center text-2xl  font-black">{tourPrice.price.toLocaleString()} FCFA</div>
            <button onClick={handleTourPayment} disabled={processingTourPayment} className="w-full bg-black text-white py-5 font-black uppercase text-[10px] tracking-widest hover:bg-black/90 transition-all">
              {processingTourPayment ? "Traitement..." : "Payer & Découvrir"}
            </button>
          </div>
        </div>
      )}

      <div className="relative h-[50vh] bg-black">
        <img src={property.mainImageUrl} className="w-full h-full object-cover opacity-70" alt={property.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white bg-black px-4 py-2">{property.category}</span>
            <h1 className="text-4xl md:text-6xl  font-black text-black uppercase">{property.title}</h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-black  text-4xl font-black">{formatPrice(property.price)}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2">Description</h2>
            <p className="text-lg text-black/80 leading-relaxed ">{property.description}</p>

            {/* Price Estimator (Re-integrated) */}
            <div className="mt-8 bg-secondary/30 p-8 border border-black/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40">Estimateur de Valeur KSM</h3>
                <TrendingUp size={16} className="text-black/20" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <input type="range" min={20} max={2000} value={surface} onChange={e => setSurface(Number(e.target.value))} className="flex-1 accent-black" />
                  <span className=" font-black text-xl w-24 text-right">{surface} m²</span>
                </div>
                {(() => {
                  const pricePerM2 = PRICE_PER_M2[property.category] || 400000;
                  const estimate = pricePerM2 * surface;
                  const isAbove = property.price > estimate;
                  const diff = Math.abs(((property.price - estimate) / estimate) * 100).toFixed(1);
                  return (
                    <div className="flex justify-between items-end border-t border-black/10 pt-6">
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted mb-1">Valeur Estimée</p>
                        <p className="text-2xl  font-black">{estimate.toLocaleString()} FCFA</p>
                      </div>
                      <div className={`text-[10px] font-black px-3 py-1 ${isAbove ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                        {isAbove ? `+${diff}%` : `-${diff}%`} / Marché
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2">Les Pièces</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(property.characteristicImages || []).map((imgUrl: string, i: number) => {
                const labels = ["Salon", "Cuisine", "Salon TV", "Chambre", "Salle de bain", "Garage"];
                return (
                  <div key={i} className="group cursor-pointer relative aspect-square overflow-hidden bg-secondary" onClick={() => setCurrentGalleryIndex(i)}>
                    <img src={imgUrl} alt={labels[i % labels.length]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                    <div className="absolute bottom-3 left-3 text-white text-[9px] font-black uppercase tracking-widest drop-shadow-md">{labels[i % labels.length]}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2">Emplacement</h2>
            <div className="h-80 bg-secondary grayscale hover:grayscale-0 transition-all duration-700">
              <PropertyMap title={property.title} location={property.location} lat={(COORDS[property.neighborhood] || COORDS.default)[0]} lng={(COORDS[property.neighborhood] || COORDS.default)[1]} />
            </div>
          </section>

          <section className="space-y-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2">Commentaires ({comments.length})</h2>

            {/* Comment Form (Restored) */}
            {user ? (
              <div className="bg-secondary/20 p-8 border border-black/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Partagez votre avis</p>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Votre expérience avec ce bien..."
                  className="w-full h-32 bg-white border border-black/10 p-4 outline-none focus:border-black transition-all text-sm  "
                />
                <div className="flex justify-end">
                  <button
                    disabled={postingComment || !newComment.trim()}
                    onClick={handleCommentPost}
                    className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black/80 disabled:bg-black/20 transition-all"
                  >
                    {postingComment ? "Publication..." : "Publier"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-secondary/10 p-6 text-center border border-dashed border-black/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Connectez-vous pour laisser un commentaire</p>
              </div>
            )}

            <div className="space-y-8 pt-6">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-6 border-b border-black/5 pb-8 last:border-0">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xs shrink-0">{c.user?.fullName?.[0] || "U"}</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">{c.user?.fullName || "Utilisateur"} <span className="text-muted tracking-normal font-normal lowercase  text-[9px]">— {new Date(c.createdAt).toLocaleDateString()}</span></div>
                    <p className="text-base text-black/70  leading-relaxed ">&quot;{c.text}&quot;</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 h-fit lg:sticky lg:top-24 space-y-6">
          <div className="bg-black text-white p-8 space-y-8 shadow-xl">
            {/* Price */}
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Montant Immobilier</p>
              <div className="text-3xl  font-black">{formatPrice(property.price)}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="group flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full transition-all"
                  >
                    <Heart size={18} className="text-pink-500 group-hover:scale-125 transition-transform" />
                    <span className="text-pink-500 text-sm font-black tracking-tight">{property.hearts || 0}</span>
                  </button>
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest ">Coups de Coeur</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {alreadyBought ? (
                <div className="w-full bg-green-700 text-white py-4 font-black uppercase text-[10px] tracking-[0.2em] text-center">
                  Vous avez déjà acheté ce bien
                </div>
              ) : (
                <button onClick={() => requireAuth("purchase")} className="w-full bg-white text-black py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/90 transition-all">
                  Acquérir le Bien
                </button>
              )}
              <button onClick={() => requireAuth("visit")} className="w-full border border-white/20 text-white py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all">Réserver une Visite</button>
            </div>

            {/* 3D Tour with dynamic price */}
            {property.virtualTourNodesJson && (
              <div className="border-t border-white/10 pt-6 mt-2 space-y-3">
                {tourPrice && (
                  <div className="text-center">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1">Prix Immersion 3D</p>
                    <p className="text-2xl  font-black">{tourPrice.price.toLocaleString()} FCFA</p>
                    <p className="text-[8px] text-white/30 mt-1">5 000 - ({property.hearts || 0} ♥ × 500)</p>
                  </div>
                )}
                <button onClick={launchTour} className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-white/60 transition-all py-2">
                  <Play size={14} /> {tourPaid ? "Relancer Immersion 3D" : "Débloquer Immersion 3D"}
                </button>
              </div>
            )}
          </div>
          <div className="border border-black/10 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xs uppercase tracking-tighter shrink-0">{property.proprietorName?.[0] || property.ownerName?.[0] || "P"}</div>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted">Conseiller Dédié</p>
                <p className="font-black text-black truncate text-xs">{property.proprietorName || property.ownerName || "KSM Real Estate"}</p>
                <p className="text-[10px] font-bold text-muted">{property.proprietorPhone || property.ownerPhone || "+237 6XX..."}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `Découvrez ce bien d'exception sur KSM Real Estate : ${property.title} - ${url}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="w-full bg-[#25D366] text-white hover:brightness-90 transition-all py-3 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest cursor-pointer">
                <Share2 size={12} /> WhatsApp
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  const subject = `KSM Real Estate - ${property.title}`;
                  const body = `Bonjour, je souhaite partager ce bien avec vous : ${property.title}. \n\nConsultez les détails ici : ${url}`;
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] text-white hover:brightness-90 transition-all py-3 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest cursor-pointer">
                <Mail size={12} /> Gmail
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>

  );
}
