<template>
  <UiModal :open="open" variant="full" label="Photos de l'article en grand" close-label="Fermer les photos" flush @close="emit('close')">
    <div class="lb">
      <!-- Compteur -->
      <p v-if="images.length > 1" class="lb-count tnum" aria-live="polite">{{ index + 1 }} / {{ images.length }}</p>

      <!-- Photos : glisser à gauche / à droite (défilement aimanté natif) -->
      <div ref="trackRef" class="lb-track" tabindex="0" aria-roledescription="carrousel" @scroll.passive="onScroll">
        <figure
          v-for="(img, i) in images"
          :key="img.src + i"
          class="lb-slide"
          :aria-label="`Photo ${i + 1} sur ${images.length}`"
          aria-roledescription="diapositive"
        >
          <img :src="img.src" :alt="img.alt" draggable="false" :loading="Math.abs(i - index) <= 1 ? 'eager' : 'lazy'" />
        </figure>
      </div>

      <!-- Flèches (ordinateur) -->
      <template v-if="images.length > 1">
        <button type="button" class="lb-nav prev" aria-label="Photo précédente" :disabled="index === 0" @click="go(index - 1)">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          class="lb-nav next"
          aria-label="Photo suivante"
          :disabled="index === images.length - 1"
          @click="go(index + 1)"
        >
          <ChevronRight aria-hidden="true" />
        </button>

        <!-- Miniatures -->
        <div class="lb-thumbs">
          <button
            v-for="(img, i) in images"
            :key="'t' + i"
            type="button"
            :aria-label="`Voir la photo ${i + 1}`"
            :aria-current="i === index ? 'true' : undefined"
            @click="go(i)"
          >
            <img :src="img.src" alt="" />
          </button>
        </div>
      </template>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import UiModal from './ui/UiModal.vue';

const props = defineProps<{
  open: boolean;
  images: Array<{ src: string; alt: string }>;
  startIndex: number;
}>();
const emit = defineEmits<{ (e: 'close'): void }>();

const trackRef = ref<HTMLElement | null>(null);
const index = ref(0);

const go = (i: number, smooth = true) => {
  const el = trackRef.value;
  if (!el) return;
  const target = Math.max(0, Math.min(props.images.length - 1, i));
  index.value = target;
  el.scrollTo({ left: target * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
};

const onScroll = () => {
  const el = trackRef.value;
  if (!el || !el.clientWidth) return;
  index.value = Math.round(el.scrollLeft / el.clientWidth);
};

// Flèches du clavier (écoutées sur la page : le focus est sur la fenêtre)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    go(index.value - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    go(index.value + 1);
  }
};
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));

// À l'ouverture : on arrive directement sur la photo cliquée, sans animation
watch(
  () => props.open,
  async (v) => {
    if (!v) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    document.addEventListener('keydown', onKey);
    index.value = props.startIndex;
    await nextTick();
    go(props.startIndex, false);
    trackRef.value?.focus({ preventScroll: true });
  }
);
</script>

<style scoped>
.lb {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--on-ink);
  outline: none;
}

.lb-count {
  position: absolute;
  top: 18px;
  left: 50%;
  z-index: 2;
  margin: 0;
  padding: 6px 12px;
  border-radius: var(--r-full);
  background: rgb(255 255 255 / 0.1);
  font-size: var(--fs-sm);
  font-weight: 600;
  transform: translateX(-50%);
}

.lb-track {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  outline: none;
}
.lb-track::-webkit-scrollbar {
  display: none;
}
.lb-slide {
  flex: 0 0 100%;
  margin: 0;
  display: grid;
  place-items: center;
  padding: 64px 12px 12px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
/* Photo entière, jamais recadrée */
.lb-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--r-sm);
  user-select: none;
  animation: lb-in var(--dur-4) var(--ease-out);
}

.lb-nav {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: none;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-top: -26px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.12);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background-color var(--dur-2), opacity var(--dur-2), transform var(--dur-1);
}
.lb-nav:hover:not(:disabled) {
  background: rgb(255 255 255 / 0.24);
}
.lb-nav:active:not(:disabled) {
  transform: scale(0.92);
}
.lb-nav:disabled {
  opacity: 0.25;
  cursor: default;
}
.lb-nav svg {
  width: 24px;
  height: 24px;
}
.prev {
  left: 20px;
}
.next {
  right: 20px;
}

.lb-thumbs {
  display: flex;
  justify-content: center;
  gap: var(--s-2);
  padding: var(--s-3) var(--s-4) calc(var(--s-4) + env(safe-area-inset-bottom, 0px));
  overflow-x: auto;
  scrollbar-width: none;
}
.lb-thumbs button {
  flex: none;
  width: 48px;
  height: 60px;
  padding: 0;
  border: 0;
  border-radius: var(--r-xs);
  overflow: hidden;
  background: rgb(255 255 255 / 0.06);
  opacity: 0.45;
  cursor: pointer;
  transition: opacity var(--dur-2), box-shadow var(--dur-2);
}
.lb-thumbs button:hover {
  opacity: 0.8;
}
.lb-thumbs button[aria-current='true'] {
  opacity: 1;
  box-shadow: 0 0 0 2px var(--accent-on-ink);
}
.lb-thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes lb-in {
  from {
    opacity: 0;
  }
}

@media (min-width: 720px) {
  .lb-slide {
    padding: 72px 96px 16px;
  }
  .lb-nav {
    display: grid;
  }
  .lb-thumbs button {
    width: 56px;
    height: 70px;
  }
}
</style>
