/**
 * Form validation utilities for KSM Real Estate
 */

export const validateEmail = (email: string): boolean => {
    const allowedDomains = [
        "gmail.com", "outlook.com", "hotmail.com", "live.com",
        "yahoo.com", "yahoo.fr", "protonmail.com", "proton.me",
        "icloud.com", "mail.com", "gmx.com", "aol.com"
    ];
    const domain = email.toLowerCase().split("@")[1];
    return allowedDomains.includes(domain);
};

export const validatePhone = (phone: string): boolean => {
    // Regex for Cameroonian format: +237 followed by 9 digits (starting with 6)
    // Or simple 6 followed by 8 digits
    const camRegex = /^(\+237|237)?\s?6[25-9][0-9]{7}$/;
    return camRegex.test(phone.replace(/\s/g, ""));
};

export const validateVisitDate = (dateStr: string): string | null => {
    if (!dateStr) return "La date est obligatoire.";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Date invalide.";

    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-indexed

    // Basic integrity (Naturellement géré par l'objet Date en JS,
    // mais on peut ajouter des contraintes supplémentaires si besoin)
    // Par exemple, interdire les dates dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return "La date ne peut pas être dans le passé.";

    return null;
};
