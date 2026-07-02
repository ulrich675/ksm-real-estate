const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const path = require("path");

// Color palette inspired by the template (dark navy + yellow accent + blue/green)
const C = {
    navy: "0D1B2A",   // deep dark navy background
    navyMid: "1A2B3C",  // slightly lighter navy
    navyCard: "162232",  // card background
    yellow: "F5C518",  // accent yellow (from slides labels)
    blue: "2B6CB0",  // blue accent
    blueLight: "3B82F6", // lighter blue
    white: "FFFFFF",
    lightGray: "E2E8F0",
    gray: "94A3B8",
    darkCard: "111827",
    accent: "F5C518",  // yellow
    green: "22C55E",
};

// Image paths - UPDATED TO LOCAL PATHS
const IMGS = {
    logo: path.join(__dirname, "imgs/logo.png"),
    slide1: path.join(__dirname, "imgs/slide1.png"),
    slide2: path.join(__dirname, "imgs/slide2.png"),
    slide3: path.join(__dirname, "imgs/slide3.png"),
    slide4: path.join(__dirname, "imgs/slide4.png"),
    slide6: path.join(__dirname, "imgs/slide6.png"),
    slide15: path.join(__dirname, "imgs/slide15.png"),
    diagram: path.join(__dirname, "imgs/slide6.png"), // Reusing slide 6 for diagram as it shows the network
};

// Helper: add small Team Orion logo top-right on each slide
function addLogo(slide) {
    slide.addImage({ path: IMGS.logo, x: 9.1, y: 0.1, w: 0.75, h: 0.75 });
}

// Helper: add slide number bottom-right
function addSlideNum(slide, num) {
    slide.addText(`${num}`, {
        x: 9.5, y: 5.3, w: 0.4, h: 0.25,
        fontSize: 9, color: C.gray, align: "right"
    });
}

// Helper: section tag
function sectionTag(slide, label, x, y) {
    slide.addShape("rect", { x, y, w: 2.2, h: 0.32, fill: { color: C.yellow }, line: { color: C.yellow } });
    slide.addText(label, { x, y, w: 2.2, h: 0.32, fontSize: 10, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0 });
}

async function main() {
    let pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";
    pres.title = "Supercalculateur Local – ENSPY";

    // ─── SLIDE 1 : Contexte – Steve ───────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 1);
        sectionTag(sl, "CONTEXTE", 0.5, 0.2);
        sl.addText("Steve, un étudiant passionné d'IA", {
            x: 0.5, y: 0.65, w: 5.2, h: 0.7,
            fontSize: 22, bold: true, color: C.white, fontFace: "Calibri"
        });
        sl.addText(
            "Steve est étudiant à l'ENSPY en génie informatique. Passionné par l'intelligence artificielle, il entraîne constamment ses modèles et réalise des simulations complexes sur des serveurs en ligne.",
            { x: 0.5, y: 1.45, w: 5.2, h: 1.6, fontSize: 14, color: C.lightGray, fontFace: "Calibri", paraSpaceAfter: 6 }
        );
        // Tag character name
        sl.addShape("rect", { x: 0.5, y: 3.15, w: 1.3, h: 0.3, fill: { color: C.yellow }, line: { color: C.yellow } });
        sl.addText("STEVE", { x: 0.5, y: 3.15, w: 1.3, h: 0.3, fontSize: 10, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0 });
        // Image right
        sl.addImage({
            path: IMGS.slide1, x: 5.9, y: 0.5, w: 3.9, h: 4.8,
            sizing: { type: "cover", w: 3.9, h: 4.8 }
        });
        // Decorative line
        sl.addShape("rect", { x: 5.8, y: 0.5, w: 0.08, h: 4.8, fill: { color: C.yellow }, line: { color: C.yellow } });
    }

    // ─── SLIDE 2 : Problème ───────────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 2);
        sectionTag(sl, "PROBLÈME", 0.5, 0.2);
        sl.addText("Un obstacle de taille…", {
            x: 0.5, y: 0.65, w: 5.2, h: 0.7,
            fontSize: 22, bold: true, color: C.white, fontFace: "Calibri"
        });
        // Two issue cards
        const issues = [
            { icon: "💸", title: "Contraintes financières", desc: "Steve manque de ressources pour payer régulièrement les serveurs cloud." },
            { icon: "📡", title: "Connexion instable", desc: "La connexion internet est instable la plupart du temps, rendant le travail difficile." },
        ];
        issues.forEach((issue, i) => {
            const y = 1.5 + i * 1.55;
            sl.addShape("rect", {
                x: 0.5, y, w: 5.0, h: 1.35,
                fill: { color: C.navyCard }, line: { color: C.blueLight, width: 1 }
            });
            sl.addText(issue.icon + "  " + issue.title, { x: 0.7, y: y + 0.12, w: 4.6, h: 0.38, fontSize: 14, bold: true, color: C.yellow, fontFace: "Calibri" });
            sl.addText(issue.desc, { x: 0.7, y: y + 0.52, w: 4.6, h: 0.72, fontSize: 12, color: C.lightGray, fontFace: "Calibri" });
        });
        sl.addImage({
            path: IMGS.slide2, x: 5.9, y: 0.5, w: 3.9, h: 4.8,
            sizing: { type: "cover", w: 3.9, h: 4.8 }
        });
        sl.addShape("rect", { x: 5.8, y: 0.5, w: 0.08, h: 4.8, fill: { color: C.yellow }, line: { color: C.yellow } });
    }

    // ─── SLIDE 3 : Constat & Problématique ───────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 3);
        sectionTag(sl, "CONSTAT & PROBLÉMATIQUE", 0.5, 0.2);
        sl.addText("Une découverte prometteuse", {
            x: 0.5, y: 0.65, w: 5.2, h: 0.65,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        sl.addText(
            "En se baladant dans son département, Steve remarque que l'école possède plusieurs machines délaissées et inexploitées.",
            { x: 0.5, y: 1.35, w: 5.0, h: 1.0, fontSize: 13, color: C.lightGray, fontFace: "Calibri" }
        );
        // Question box
        sl.addShape("rect", {
            x: 0.5, y: 2.45, w: 5.0, h: 1.6,
            fill: { color: C.darkCard }, line: { color: C.yellow, width: 2 }
        });
        sl.addShape("rect", { x: 0.5, y: 2.45, w: 0.12, h: 1.6, fill: { color: C.yellow }, line: { color: C.yellow } });
        sl.addText("❓ La Question", { x: 0.72, y: 2.55, w: 4.6, h: 0.38, fontSize: 12, bold: true, color: C.yellow });
        sl.addText(
            "Comment unir ces machines inexploitées de façon à fournir une puissance de calcul élevée pour entraîner des modèles d'IA ?",
            { x: 0.72, y: 2.95, w: 4.6, h: 1.0, fontSize: 12, color: C.white, fontFace: "Calibri", italic: true }
        );
        sl.addImage({
            path: IMGS.slide3, x: 5.9, y: 0.5, w: 3.9, h: 4.8,
            sizing: { type: "cover", w: 3.9, h: 4.8 }
        });
        sl.addShape("rect", { x: 5.8, y: 0.5, w: 0.08, h: 4.8, fill: { color: C.yellow }, line: { color: C.yellow } });
    }

    // ─── SLIDE 4 : Solution – Supercalculateur Local ──────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 4);
        sectionTag(sl, "SOLUTION", 0.5, 0.2);
        sl.addText("Supercalculateur Local", {
            x: 0.5, y: 0.65, w: 5.2, h: 0.75,
            fontSize: 26, bold: true, color: C.yellow, fontFace: "Calibri"
        });
        sl.addText(
            "En deux mots : Supercalculateur local. L'espoir renaît — Steve retrouve le sourire ! Il construira un cluster de machines pour obtenir la puissance de calcul dont il a besoin.",
            { x: 0.5, y: 1.5, w: 5.0, h: 1.5, fontSize: 13, color: C.lightGray, fontFace: "Calibri" }
        );
        // Highlight stat
        sl.addShape("rect", {
            x: 0.5, y: 3.1, w: 5.0, h: 0.9,
            fill: { color: C.yellow }, line: { color: C.yellow }
        });
        sl.addText("🎯  Cluster de machines locales = Zéro coût cloud · Zéro dépendance réseau", {
            x: 0.6, y: 3.1, w: 4.8, h: 0.9, fontSize: 13, bold: true, color: C.navy, align: "center", valign: "middle"
        });
        sl.addImage({
            path: IMGS.slide4, x: 5.9, y: 0.5, w: 3.9, h: 4.8,
            sizing: { type: "cover", w: 3.9, h: 4.8 }
        });
        sl.addShape("rect", { x: 5.8, y: 0.5, w: 0.08, h: 4.8, fill: { color: C.yellow }, line: { color: C.yellow } });
    }

    // ─── SLIDE 5 : Objectifs ──────────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 5);
        sectionTag(sl, "OBJECTIFS", 0.5, 0.2);
        sl.addText("Ce que nous voulons accomplir", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 22, bold: true, color: C.white, fontFace: "Calibri"
        });
        const objectives = [
            { num: "01", title: "Construire un cluster", desc: "Exploiter les machines délaissées de l'ENSPY afin de constituer un supercalculateur local." },
            { num: "02", title: "Exécution distribuée", desc: "Permettre l'exécution distribuée des calculs des chercheurs via un système d'annotations." },
            { num: "03", title: "Documentation complète", desc: "Fournir une documentation permettant aux chercheurs de soumettre leurs programmes de façon adéquate." },
        ];
        objectives.forEach((obj, i) => {
            const x = 0.4 + i * 3.15;
            sl.addShape("rect", {
                x, y: 1.45, w: 2.9, h: 3.6,
                fill: { color: C.navyCard }, line: { color: C.blueLight, width: 1 }
            });
            sl.addShape("rect", { x, y: 1.45, w: 2.9, h: 0.55, fill: { color: C.yellow }, line: { color: C.yellow } });
            sl.addText(obj.num, { x, y: 1.45, w: 2.9, h: 0.55, fontSize: 20, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0 });
            sl.addText(obj.title, { x: x + 0.15, y: 2.1, w: 2.6, h: 0.5, fontSize: 13, bold: true, color: C.yellow, fontFace: "Calibri" });
            sl.addText(obj.desc, { x: x + 0.15, y: 2.65, w: 2.6, h: 2.2, fontSize: 11.5, color: C.lightGray, fontFace: "Calibri" });
        });
    }

    // ─── SLIDE 6 : Méthodologie ───────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 6);
        sectionTag(sl, "MÉTHODOLOGIE", 0.5, 0.2);
        sl.addText("Deux axes d'intervention", {
            x: 0.5, y: 0.65, w: 5.2, h: 0.6,
            fontSize: 22, bold: true, color: C.white, fontFace: "Calibri"
        });
        // Axe 1
        sl.addShape("rect", {
            x: 0.5, y: 1.4, w: 5.0, h: 1.45,
            fill: { color: C.navyCard }, line: { color: C.yellow, width: 1.5 }
        });
        sl.addShape("rect", { x: 0.5, y: 1.4, w: 1.2, h: 1.45, fill: { color: C.yellow }, line: { color: C.yellow } });
        sl.addText("AXE\nPHYSIQUE", { x: 0.5, y: 1.4, w: 1.2, h: 1.45, fontSize: 11, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0 });
        sl.addText("Interconnecter les machines", { x: 1.8, y: 1.55, w: 3.6, h: 0.4, fontSize: 13, bold: true, color: C.yellow });
        sl.addText("Mise en réseau physique des machines délaissées de l'ENSPY via un switch pour constituer le cluster.", { x: 1.8, y: 2.0, w: 3.6, h: 0.75, fontSize: 11.5, color: C.lightGray });
        // Axe 2
        sl.addShape("rect", {
            x: 0.5, y: 3.0, w: 5.0, h: 1.75,
            fill: { color: C.navyCard }, line: { color: C.blueLight, width: 1.5 }
        });
        sl.addShape("rect", { x: 0.5, y: 3.0, w: 1.2, h: 1.75, fill: { color: C.blueLight }, line: { color: C.blueLight } });
        sl.addText("AXE\nLOGIQUE", { x: 0.5, y: 3.0, w: 1.2, h: 1.75, fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
        sl.addText("Développement & Documentation", { x: 1.8, y: 3.12, w: 3.6, h: 0.4, fontSize: 13, bold: true, color: C.blueLight });
        sl.addText([
            { text: "• Développement de l'architecture du système\n", options: { color: C.lightGray } },
            { text: "• Documentation du système", options: { color: C.lightGray } },
        ], { x: 1.8, y: 3.55, w: 3.6, h: 1.1, fontSize: 11.5, fontFace: "Calibri" });
        // Image right
        sl.addImage({
            path: IMGS.slide6, x: 5.9, y: 0.5, w: 3.9, h: 4.8,
            sizing: { type: "cover", w: 3.9, h: 4.8 }
        });
        sl.addShape("rect", { x: 5.8, y: 0.5, w: 0.08, h: 4.8, fill: { color: C.yellow }, line: { color: C.yellow } });
    }

    // ─── SLIDE 7 : Généralités ────────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 7);
        sectionTag(sl, "GÉNÉRALITÉS", 0.5, 0.2);
        sl.addText("Concepts clés", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 22, bold: true, color: C.white, fontFace: "Calibri"
        });
        const concepts = [
            { term: "Calcul distribué", def: "Répartition des calculs sur plusieurs machines." },
            { term: "Parallélisme", def: "Exécution simultanée de plusieurs tâches." },
            { term: "Agent / SMA", def: "Entité autonome ; ensemble d'agents coopérants." },
            { term: "Master", def: "Nœud principal qui orchestre les calculs." },
            { term: "Worker", def: "Nœud esclave qui exécute les sous-calculs." },
            { term: "Orchestrateur", def: "Distribue les sous-tâches aux workers." },
            { term: "Contrôleur", def: "Supervise l'état du réseau et des agents." },
            { term: "Remplaçant", def: "Worker prêt à devenir master ou contrôleur." },
            { term: "Heartbeat", def: "Signal périodique prouvant qu'un nœud est vivant." },
            { term: "Broadcast", def: "Envoi d'un message à tous les nœuds." },
            { term: "Nœud", def: "Machine participant au cluster." },
            { term: "Réceptionniste", def: "Reçoit les soumissions des chercheurs." },
        ];
        const cols = 3, rows = 4;
        const cw = 2.95, ch = 0.95, startX = 0.5, startY = 1.4;
        concepts.forEach((c, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cw + 0.15);
            const y = startY + row * (ch + 0.1);
            sl.addShape("rect", {
                x, y, w: cw, h: ch,
                fill: { color: C.navyCard }, line: { color: C.blueLight, width: 0.75 }
            });
            sl.addShape("rect", { x, y, w: 0.08, h: ch, fill: { color: C.yellow }, line: { color: C.yellow } });
            sl.addText(c.term, { x: x + 0.18, y: y + 0.08, w: cw - 0.25, h: 0.35, fontSize: 11, bold: true, color: C.yellow });
            sl.addText(c.def, { x: x + 0.18, y: y + 0.45, w: cw - 0.25, h: 0.4, fontSize: 10, color: C.lightGray });
        });
    }

    // ─── SLIDE 8 : État de l'art ──────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 8);
        sectionTag(sl, "ÉTAT DE L'ART", 0.5, 0.2);
        sl.addText("Solutions recensées & Positionnement", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });

        // Table header
        const hdr = [
            [
                { text: "Critères", options: { bold: true, color: C.navy, fill: { color: C.yellow }, align: "center" } },
                { text: "SETI@home", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
                { text: "AWS Snowball", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
                { text: "EC2 Spot", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
                { text: "HTCondor", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
            ],
            [
                { text: "Réduction du coût", options: { color: C.white, fill: { color: C.navyCard } } },
                { text: "✓", options: { color: C.green, fill: { color: C.navyCard }, align: "center" } },
                { text: "✗", options: { color: "EF4444", fill: { color: C.navyCard }, align: "center" } },
                { text: "✓", options: { color: C.green, fill: { color: C.navyCard }, align: "center" } },
                { text: "✓", options: { color: C.green, fill: { color: C.navyCard }, align: "center" } },
            ],
            [
                { text: "Faible dépen. réseau", options: { color: C.white, fill: { color: C.navy } } },
                { text: "✗", options: { color: "EF4444", fill: { color: C.navy }, align: "center" } },
                { text: "✓", options: { color: C.green, fill: { color: C.navy }, align: "center" } },
                { text: "✗", options: { color: "EF4444", fill: { color: C.navy }, align: "center" } },
                { text: "✓", options: { color: C.green, fill: { color: C.navy }, align: "center" } },
            ],
            [
                { text: "Exploitation locale", options: { color: C.white, fill: { color: C.navyCard } } },
                { text: "✗", options: { color: "EF4444", fill: { color: C.navyCard }, align: "center" } },
                { text: "✗", options: { color: "EF4444", fill: { color: C.navyCard }, align: "center" } },
                { text: "✗", options: { color: "EF4444", fill: { color: C.navyCard }, align: "center" } },
                { text: "✓", options: { color: C.green, fill: { color: C.navyCard }, align: "center" } },
            ],
        ];
        sl.addTable(hdr, {
            x: 0.5, y: 1.4, w: 9.0, rowH: 0.52,
            border: { pt: 1, color: "2D3748" },
            fontFace: "Calibri", fontSize: 12,
            colW: [2.6, 1.6, 1.6, 1.6, 1.6],
        });

        // Positionnement
        sl.addShape("rect", {
            x: 0.5, y: 3.75, w: 9.0, h: 1.5,
            fill: { color: C.darkCard }, line: { color: C.yellow, width: 1.5 }
        });
        sl.addShape("rect", { x: 0.5, y: 3.75, w: 0.12, h: 1.5, fill: { color: C.yellow }, line: { color: C.yellow } });
        sl.addText("🎯  Notre positionnement", { x: 0.75, y: 3.85, w: 8.6, h: 0.38, fontSize: 12, bold: true, color: C.yellow });
        sl.addText(
            "Exploiter les machines locales sous-utilisées de l'ENSPY pour construire un cluster de calcul distribué autonome et à faible coût — sans dépendance au cloud ni à une connexion stable.",
            { x: 0.75, y: 4.25, w: 8.5, h: 0.9, fontSize: 11.5, color: C.lightGray, fontFace: "Calibri" }
        );
    }

    // ─── SLIDE 9 : Analyse matérielle ────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 9);
        sectionTag(sl, "ANALYSE MATÉRIELLE", 0.5, 0.2);
        sl.addText("Caractéristiques des machines retenues", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });

        const tableData = [
            [
                { text: "Caractéristiques", options: { bold: true, color: C.navy, fill: { color: C.yellow }, align: "center" } },
                { text: "DELL OptiPlex 380 — M1", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
                { text: "DELL OptiPlex 380 — M2", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
                { text: "DELL System 360 — M3", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
                { text: "Tiny Client Wyse", options: { bold: true, color: C.white, fill: { color: C.blueLight }, align: "center" } },
            ],
            [
                { text: "CPU", options: { bold: true, color: C.yellow, fill: { color: C.navyCard } } },
                { text: "Intel Core 2 Duo E7500", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
                { text: "Intel Core 2 Duo E7500", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
                { text: "Intel Core 2 Duo E7400", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
                { text: "Non visible", options: { color: C.gray, fill: { color: C.navyCard }, align: "center", italic: true } },
            ],
            [
                { text: "Fréquence", options: { bold: true, color: C.yellow, fill: { color: C.navy } } },
                { text: "2,933 GHz", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
                { text: "2,933 GHz", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
                { text: "2,80 GHz", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
                { text: "1 GHz", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
            ],
            [
                { text: "RAM", options: { bold: true, color: C.yellow, fill: { color: C.navyCard } } },
                { text: "4 GB DDR3", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
                { text: "2 GB DDR3", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
                { text: "2 GB DDR2", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
                { text: "64 MB", options: { color: C.white, fill: { color: C.navyCard }, align: "center" } },
            ],
            [
                { text: "Stockage", options: { bold: true, color: C.yellow, fill: { color: C.navy } } },
                { text: "500 GB", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
                { text: "500 GB", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
                { text: "500 GB", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
                { text: "64 MB Flash", options: { color: C.white, fill: { color: C.navy }, align: "center" } },
            ],
            [
                { text: "OS", options: { bold: true, color: C.yellow, fill: { color: C.navyCard } } },
                { text: "Ubuntu Server 18", options: { color: C.lightGray, fill: { color: C.navyCard }, align: "center" } },
                { text: "Ubuntu Server 18", options: { color: C.lightGray, fill: { color: C.navyCard }, align: "center" } },
                { text: "Ubuntu Server 18", options: { color: C.lightGray, fill: { color: C.navyCard }, align: "center" } },
                { text: "VMware", options: { color: C.lightGray, fill: { color: C.navyCard }, align: "center" } },
            ],
        ];

        sl.addTable(tableData, {
            x: 0.4, y: 1.35, w: 9.2, rowH: 0.5,
            border: { pt: 1, color: "2D3748" },
            fontFace: "Calibri", fontSize: 11,
            colW: [1.9, 1.9, 1.9, 1.9, 1.6],
        });
    }

    // ─── SLIDE 10 : Limites matérielles ──────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 10);
        sectionTag(sl, "LIMITES MATÉRIELLES", 0.5, 0.2);
        sl.addText("Contraintes identifiées", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        const limits = [
            { icon: "⚡", title: "Puissance limitée", desc: "Les machines DELL sont des Core 2 Duo d'ancienne génération, avec peu de RAM et de puissance de calcul." },
            { icon: "🔀", title: "Hétérogénéité des machines", desc: "Les différences de RAM et de CPU imposent une gestion pondérée des ressources pour équilibrer la charge." },
            { icon: "🌐", title: "Infrastructure réseau", desc: "Le switch à 5 ports limite l'extensibilité du cluster et constitue un point unique de défaillance." },
            { icon: "🖥️", title: "Mini PCs exclus du calcul", desc: "Trop limités en ressources, les mini PCs ne participent pas aux calculs. Le Wyse sert uniquement de passerelle." },
        ];
        limits.forEach((lim, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const x = 0.4 + col * 4.7;
            const y = 1.45 + row * 1.7;
            sl.addShape("rect", {
                x, y, w: 4.4, h: 1.5,
                fill: { color: C.navyCard }, line: { color: i < 2 ? C.yellow : C.blueLight, width: 1 }
            });
            sl.addText(lim.icon + "  " + lim.title, { x: x + 0.2, y: y + 0.12, w: 4.0, h: 0.4, fontSize: 13, bold: true, color: C.yellow });
            sl.addText(lim.desc, { x: x + 0.2, y: y + 0.55, w: 4.0, h: 0.85, fontSize: 11, color: C.lightGray, fontFace: "Calibri" });
        });
    }

    // ─── SLIDE 11 : Analyse logicielle ───────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 11);
        sectionTag(sl, "ANALYSE LOGICIELLE", 0.5, 0.2);
        sl.addText("Acteurs & Exigences fonctionnelles", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        // Chercheur
        sl.addShape("rect", {
            x: 0.5, y: 1.45, w: 4.3, h: 3.3,
            fill: { color: C.navyCard }, line: { color: C.yellow, width: 1.5 }
        });
        sl.addShape("rect", { x: 0.5, y: 1.45, w: 4.3, h: 0.55, fill: { color: C.yellow }, line: { color: C.yellow } });
        sl.addText("👨‍🔬  Chercheur", { x: 0.5, y: 1.45, w: 4.3, h: 0.55, fontSize: 14, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0 });
        sl.addText([
            { text: "Soumission des programmes", options: { bullet: true, breakLine: true } },
            { text: "Exécution distribuée des tâches", options: { bullet: true, breakLine: true } },
            { text: "Consultation des résultats via interface", options: { bullet: true } },
        ], { x: 0.7, y: 2.1, w: 3.9, h: 2.5, fontSize: 12, color: C.lightGray, fontFace: "Calibri", paraSpaceAfter: 8 });
        // Gestionnaire
        sl.addShape("rect", {
            x: 5.2, y: 1.45, w: 4.3, h: 3.3,
            fill: { color: C.navyCard }, line: { color: C.blueLight, width: 1.5 }
        });
        sl.addShape("rect", { x: 5.2, y: 1.45, w: 4.3, h: 0.55, fill: { color: C.blueLight }, line: { color: C.blueLight } });
        sl.addText("🛠️  Gestionnaire du cluster", { x: 5.2, y: 1.45, w: 4.3, h: 0.55, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
        sl.addText([
            { text: "Supervision en temps réel de l'état des nœuds", options: { bullet: true, breakLine: true } },
            { text: "Gestion via interface web dédiée", options: { bullet: true, breakLine: true } },
            { text: "Ajout et retrait de machines du cluster", options: { bullet: true } },
        ], { x: 5.4, y: 2.1, w: 3.9, h: 2.5, fontSize: 12, color: C.lightGray, fontFace: "Calibri", paraSpaceAfter: 8 });
    }

    // ─── SLIDE 12 : Conception ────────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 12);
        sectionTag(sl, "CONCEPTION", 0.5, 0.2);
        sl.addText("Vue d'ensemble du système", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        sl.addText(
            "Notre système permet aux chercheurs d'effectuer des calculs de simulation en s'appuyant sur des machines récupérées au sein de l'ENSPY. Ces machines sont mises en réseau et combinées afin de résoudre efficacement les problèmes soumis.",
            { x: 0.5, y: 1.35, w: 9.0, h: 1.2, fontSize: 12.5, color: C.lightGray, fontFace: "Calibri" }
        );
        // Process steps
        const steps = [
            { num: "1", label: "Soumission", desc: "Le chercheur soumet son calcul depuis une machine dédiée." },
            { num: "2", label: "Découpage", desc: "Les tâches sont découpées en sous-calculs." },
            { num: "3", label: "Distribution", desc: "Les sous-calculs sont envoyés aux machines du réseau." },
            { num: "4", label: "Exécution", desc: "Chaque machine exécute sa partie et renvoie le résultat." },
            { num: "5", label: "Agrégation", desc: "Le master agrège tous les résultats en un résultat final." },
        ];
        steps.forEach((s, i) => {
            const x = 0.4 + i * 1.85;
            sl.addShape("rect", {
                x, y: 2.7, w: 1.65, h: 2.5,
                fill: { color: C.navyCard }, line: { color: i === 4 ? C.yellow : C.blueLight, width: 1 }
            });
            sl.addShape("oval", { x: x + 0.58, y: 2.78, w: 0.5, h: 0.5, fill: { color: C.yellow }, line: { color: C.yellow } });
            sl.addText(s.num, { x: x + 0.58, y: 2.78, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0 });
            sl.addText(s.label, { x: x + 0.1, y: 3.38, w: 1.45, h: 0.4, fontSize: 11, bold: true, color: C.yellow, align: "center" });
            sl.addText(s.desc, { x: x + 0.1, y: 3.82, w: 1.45, h: 1.25, fontSize: 10, color: C.lightGray, align: "center", fontFace: "Calibri" });
            // Arrow between steps
            if (i < 4) {
                sl.addShape("rect", { x: x + 1.65, y: 3.93, w: 0.2, h: 0.05, fill: { color: C.gray }, line: { color: C.gray } });
            }
        });
        // SMA note
        sl.addShape("rect", {
            x: 0.5, y: 5.1, w: 9.0, h: 0.35,
            fill: { color: C.yellow }, line: { color: C.yellow }
        });
        sl.addText("Chaque machine est un agent autonome → Modélisation comme Système Multi-Agents (SMA)", {
            x: 0.6, y: 5.1, w: 8.8, h: 0.35, fontSize: 11, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0
        });
    }

    // ─── SLIDE 13 : Modélisation agentique ───────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 13);
        sectionTag(sl, "MODÉLISATION AGENTIQUE", 0.5, 0.2);
        sl.addText("Diagramme du Monde Agentique", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        // Insert diagram
        sl.addImage({
            path: IMGS.diagram, x: 0.5, y: 1.35, w: 9.0, h: 4.1,
            sizing: { type: "contain", w: 9.0, h: 4.1 }
        });
    }

    // ─── SLIDE 14 : Agents spéciaux ───────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 14);
        sectionTag(sl, "RÉSILIENCE DU SYSTÈME", 0.5, 0.2);
        sl.addText("Agents de tolérance aux pannes", {
            x: 0.5, y: 0.65, w: 9.0, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        const agents = [
            {
                title: "🏆  Agent Master Secondaire",
                color: C.yellow,
                tcolor: C.navy,
                desc: "Worker qui devient master si le master principal tombe en panne. Assure la continuité des opérations de coordination.",
            },
            {
                title: "🔄  Agent Remplaçant",
                color: C.blueLight,
                tcolor: C.white,
                desc: "Worker qui remplace le master secondaire ou le contrôleur si l'un d'eux tombe en panne.",
            },
            {
                title: "⚡  Processus d'Élection",
                color: "22C55E",
                tcolor: C.white,
                desc: "Déclenché automatiquement pour désigner un nouveau remplaçant. Garantit qu'il y a toujours un agent de secours disponible.",
            },
        ];
        agents.forEach((ag, i) => {
            const x = 0.4 + i * 3.15;
            sl.addShape("rect", {
                x, y: 1.45, w: 2.9, h: 3.5,
                fill: { color: C.navyCard }, line: { color: ag.color, width: 2 }
            });
            sl.addShape("rect", { x, y: 1.45, w: 2.9, h: 0.58, fill: { color: ag.color }, line: { color: ag.color } });
            sl.addText(ag.title, { x: x + 0.1, y: 1.45, w: 2.7, h: 0.58, fontSize: 11, bold: true, color: ag.tcolor, valign: "middle", margin: 0 });
            sl.addText(ag.desc, { x: x + 0.15, y: 2.15, w: 2.6, h: 2.65, fontSize: 11.5, color: C.lightGray, fontFace: "Calibri" });
        });
        // Resilience chain
        sl.addShape("rect", {
            x: 0.5, y: 5.05, w: 9.0, h: 0.38,
            fill: { color: C.darkCard }, line: { color: C.yellow, width: 1 }
        });
        sl.addText("Chaîne de résilience : Master → Master Secondaire → Remplaçant → Élection", {
            x: 0.6, y: 5.05, w: 8.8, h: 0.38, fontSize: 11, color: C.yellow, align: "center", valign: "middle", margin: 0
        });
    }

    // ─── SLIDE 15 : Algorithme d'élection ────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        addLogo(sl);
        addSlideNum(sl, 15);
        sectionTag(sl, "ALGORITHME D'ÉLECTION", 0.5, 0.2);
        sl.addText("Sélection du nœud remplaçant", {
            x: 0.5, y: 0.65, w: 5.2, h: 0.6,
            fontSize: 20, bold: true, color: C.white, fontFace: "Calibri"
        });
        sl.addText(
            "Chaque nœud calcule son score selon la formule ci-dessous. Celui avec le score le plus élevé est élu agent remplaçant.",
            { x: 0.5, y: 1.35, w: 5.2, h: 0.8, fontSize: 12.5, color: C.lightGray, fontFace: "Calibri" }
        );
        // Formula box
        sl.addShape("rect", {
            x: 0.5, y: 2.25, w: 5.2, h: 1.0,
            fill: { color: C.darkCard }, line: { color: C.yellow, width: 2 }
        });
        sl.addText("score(i) = a·(CPU_libre·CPU_total / CPU_max²) · b·(RAM_libre·RAM_total / RAM_max²) · c·(LATENCE_min / LATENCE_i) · d·(freq_i / freq_max)", {
            x: 0.65, y: 2.3, w: 4.9, h: 0.9, fontSize: 10, color: C.yellow, italic: true, fontFace: "Courier New", valign: "middle"
        });
        // Factors
        const factors = [
            { letter: "a", desc: "Poids CPU libre & total" },
            { letter: "b", desc: "Poids RAM libre & total" },
            { letter: "c", desc: "Poids latence minimale" },
            { letter: "d", desc: "Poids fréquence CPU" },
        ];
        factors.forEach((f, i) => {
            const x = 0.5 + i * 1.3;
            sl.addShape("rect", {
                x, y: 3.4, w: 1.1, h: 0.9,
                fill: { color: C.navyCard }, line: { color: C.blueLight, width: 1 }
            });
            sl.addText(f.letter, { x, y: 3.4, w: 1.1, h: 0.38, fontSize: 16, bold: true, color: C.yellow, align: "center", valign: "middle", margin: 0 });
            sl.addText(f.desc, { x, y: 3.8, w: 1.1, h: 0.5, fontSize: 8.5, color: C.lightGray, align: "center", fontFace: "Calibri" });
        });
        sl.addText("Propriété : le nœud élu dispose toujours des meilleures ressources disponibles au moment de l'élection.", {
            x: 0.5, y: 4.45, w: 5.2, h: 0.7, fontSize: 11, color: C.lightGray, italic: true, fontFace: "Calibri"
        });
        // Image right
        sl.addImage({
            path: IMGS.slide15, x: 5.9, y: 0.5, w: 3.9, h: 4.8,
            sizing: { type: "cover", w: 3.9, h: 4.8 }
        });
        sl.addShape("rect", { x: 5.8, y: 0.5, w: 0.08, h: 4.8, fill: { color: C.yellow }, line: { color: C.yellow } });
    }

    // ─── SLIDE 16 : Merci / Fin ───────────────────────────────────────────────
    {
        let sl = pres.addSlide();
        sl.background = { color: C.navy };
        // Large logo centered
        sl.addImage({ path: IMGS.logo, x: 3.75, y: 0.5, w: 2.5, h: 2.5 });
        sl.addText("TEAM ORION", {
            x: 0.5, y: 3.1, w: 9.0, h: 0.7,
            fontSize: 28, bold: true, color: C.yellow, align: "center", fontFace: "Calibri"
        });
        sl.addText("Merci pour votre attention", {
            x: 0.5, y: 3.85, w: 9.0, h: 0.7,
            fontSize: 22, color: C.white, align: "center", fontFace: "Calibri"
        });
        sl.addShape("rect", { x: 3.5, y: 4.65, w: 3.0, h: 0.05, fill: { color: C.yellow }, line: { color: C.yellow } });
        sl.addText("ENSPY – Génie Informatique  •  Supercalculateur Local", {
            x: 0.5, y: 4.8, w: 9.0, h: 0.45,
            fontSize: 12, color: C.gray, align: "center", fontFace: "Calibri"
        });
    }

    await pres.writeFile({ fileName: "supercalculateur_enspy.pptx" });
    console.log("✅ PowerPoint créé : supercalculateur_enspy.pptx");
}

main().catch(console.error);
