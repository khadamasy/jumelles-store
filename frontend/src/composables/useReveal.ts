import { onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue';

/**
 * Apparition douce des blocs `.rv` quand ils entrent à l'écran (ajoute la classe `.in`).
 * Sans IntersectionObserver (vieux navigateurs), tout est affiché directement.
 */
export function useReveal(root?: Ref<HTMLElement | null>) {
  let io: IntersectionObserver | null = null;

  const scan = () => {
    const scope: ParentNode = root?.value || document;
    const els = scope.querySelectorAll<HTMLElement>('.rv:not(.in)');
    if (!io) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    els.forEach((el) => io!.observe(el));
  };

  onMounted(async () => {
    if (typeof window === 'undefined') return;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
    }
    await nextTick();
    scan();
  });

  onBeforeUnmount(() => io?.disconnect());

  /** À rappeler après l'ajout de nouveaux blocs `.rv` (données chargées) */
  return { rescan: () => nextTick(scan) };
}
