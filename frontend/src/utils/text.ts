/**
 * Raccourcit un nom d'article pour les cartes (le nom complet reste sur la fiche article).
 * Coupe à `max` caractères sans laisser d'espace avant les points de suspension.
 */
export const shortName = (name: string | undefined | null, max = 25): string => {
  const n = String(name || '').trim();
  return n.length > max ? `${n.slice(0, max).trimEnd()}…` : n;
};
