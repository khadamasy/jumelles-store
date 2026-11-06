/**
 * Blocage du défilement de la page derrière un panneau ouvert.
 * Compteur partagé : plusieurs panneaux peuvent être ouverts en même temps,
 * le défilement ne revient que lorsque le dernier se ferme.
 */
let locks = 0;
let savedPaddingRight = '';

export function lockScroll() {
  if (typeof document === 'undefined') return;
  if (locks === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    savedPaddingRight = document.body.style.paddingRight;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.body.style.overflow = 'hidden';
  }
  locks++;
}

export function unlockScroll() {
  if (typeof document === 'undefined' || locks === 0) return;
  locks--;
  if (locks === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = savedPaddingRight;
  }
}
