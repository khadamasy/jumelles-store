<template>
  <Teleport to="body">
    <Transition :name="`ui-${variant}`" @after-leave="afterLeave">
      <div v-if="open" class="ui-ov" :class="`v-${variant}`" @mousedown.self="onBackdrop">
        <div
          ref="panelRef"
          class="ui-pn"
          :class="[`s-${size}`, `t-${tone}`, panelClass]"
          role="dialog"
          aria-modal="true"
          :aria-label="labelledby ? undefined : label"
          :aria-labelledby="labelledby"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <div v-if="variant === 'sheet'" class="ui-grip" aria-hidden="true"></div>

          <header v-if="title || $slots.header" class="ui-hd">
            <slot name="header">
              <div class="ui-hd-t">
                <h2 :id="titleId" class="ui-title">{{ title }}</h2>
                <p v-if="subtitle" class="ui-sub">{{ subtitle }}</p>
              </div>
            </slot>
            <button v-if="closable" type="button" class="ib ui-x" :aria-label="closeLabel" @click="emit('close')">
              <X aria-hidden="true" />
            </button>
          </header>
          <button
            v-else-if="closable"
            type="button"
            class="ib ui-x ui-x-float"
            :aria-label="closeLabel"
            @click="emit('close')"
          >
            <X aria-hidden="true" />
          </button>

          <div class="ui-bd" :class="{ flush }">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ui-ft">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
// Pile partagée : Échap et le piège de focus ne concernent que la fenêtre du dessus
const stack: symbol[] = [];
let uid = 0;
</script>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { lockScroll, unlockScroll } from '../../composables/useScrollLock';

const props = withDefaults(
  defineProps<{
    open: boolean;
    /** center : au milieu · sheet : monte du bas sur téléphone, centrée sur ordinateur · drawer : panneau à droite · side : panneau à gauche (menu) */
    variant?: 'center' | 'sheet' | 'drawer' | 'side';
    tone?: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    subtitle?: string;
    /** Nom lu par les lecteurs d'écran quand il n'y a pas de titre visible */
    label?: string;
    closable?: boolean;
    closeLabel?: string;
    /** Clic sur le fond : ferme la fenêtre */
    dismissible?: boolean;
    /** Contenu sans marges internes (images pleine largeur, listes) */
    flush?: boolean;
    panelClass?: string;
  }>(),
  {
    variant: 'center',
    tone: 'light',
    size: 'md',
    closable: true,
    closeLabel: 'Fermer',
    dismissible: true,
    flush: false,
  }
);

const emit = defineEmits<{ (e: 'close'): void }>();

const id = Symbol('modal');
const titleId = `ui-modal-title-${++uid}`;
const labelledby = computed(() => (props.title ? titleId : undefined));
const panelRef = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;
let locked = false;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const isTop = () => stack[stack.length - 1] === id;

const onDocKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isTop() && props.closable) {
    e.stopPropagation();
    emit('close');
  }
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Tab' || !panelRef.value || !isTop()) return;
  const items = Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null
  );
  if (items.length === 0) {
    e.preventDefault();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.value)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

const onBackdrop = () => {
  if (props.dismissible && props.closable) emit('close');
};

const activate = async () => {
  previouslyFocused = document.activeElement as HTMLElement | null;
  stack.push(id);
  if (!locked) {
    lockScroll();
    locked = true;
  }
  document.addEventListener('keydown', onDocKey);
  await nextTick();
  const panel = panelRef.value;
  if (!panel) return;
  const auto = panel.querySelector<HTMLElement>('[autofocus]');
  (auto || panel).focus({ preventScroll: true });
};

const deactivate = () => {
  const i = stack.indexOf(id);
  if (i >= 0) stack.splice(i, 1);
  document.removeEventListener('keydown', onDocKey);
  if (locked) {
    unlockScroll();
    locked = false;
  }
};

const afterLeave = () => {
  if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true });
  previouslyFocused = null;
};

watch(
  () => props.open,
  (v) => (v ? activate() : deactivate()),
  { immediate: true }
);

onBeforeUnmount(deactivate);
</script>

<style scoped>
.ui-ov {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  background: var(--overlay);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: var(--s-4);
  overscroll-behavior: contain;
}
.ui-pn {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100dvh - 32px);
  background: var(--surface);
  color: var(--text);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-3);
  outline: none;
  overflow: hidden;
}

/* ----- Au centre ----- */
.v-center {
  align-items: center;
  justify-content: center;
}
.s-sm {
  max-width: 400px;
}
.s-md {
  max-width: 520px;
}
.s-lg {
  max-width: 720px;
}

/* ----- Monte du bas sur téléphone ----- */
.v-sheet {
  align-items: flex-end;
  padding: 0;
}
.v-sheet .ui-pn {
  max-width: none;
  max-height: 92dvh;
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.ui-grip {
  width: 40px;
  height: 4px;
  border-radius: 4px;
  background: var(--border-strong);
  margin: 10px auto -2px;
  flex: none;
}

/* ----- Panneau à droite ----- */
.v-drawer {
  justify-content: flex-end;
  padding: 0;
}
.v-drawer .ui-pn {
  height: 100dvh;
  max-height: none;
  max-width: 440px;
  border-radius: 0;
}

/* ----- Panneau à gauche (menu) ----- */
.v-side {
  justify-content: flex-start;
  padding: 0;
}
.v-side .ui-pn {
  height: 100dvh;
  max-height: none;
  max-width: 420px;
  border-radius: 0;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* ----- Version sombre ----- */
.t-dark {
  background: var(--ink);
  color: var(--on-ink);
}
.t-dark .ui-hd,
.t-dark .ui-ft {
  border-color: rgb(255 255 255 / 0.1);
  background: transparent;
}
.t-dark .ui-title {
  color: var(--on-ink);
}
.t-dark .ui-x {
  color: var(--on-ink-muted);
}
.t-dark .ui-x:hover {
  background: rgb(255 255 255 / 0.08);
  color: var(--on-ink);
}

/* ----- En-tête, contenu, pied ----- */
.ui-hd {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  padding: var(--s-5) var(--s-5) var(--s-4);
  border-bottom: 1px solid var(--border);
  flex: none;
}
.ui-hd-t {
  flex: 1;
  min-width: 0;
}
.ui-title {
  margin: 0;
  font-size: var(--fs-lg);
  line-height: var(--lh-snug);
}
.ui-sub {
  margin: 4px 0 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.ui-x {
  margin: -8px -8px 0 0;
  color: var(--text-muted);
}
/* Bouton flottant : lisible sur un en-tête sombre ou une photo */
.ui-x-float {
  position: absolute;
  top: 12px;
  right: 12px;
  margin: 0;
  z-index: 2;
  width: 38px;
  height: 38px;
  border-radius: var(--r-full);
  background: rgb(255 255 255 / 0.92);
  color: var(--ink);
  box-shadow: var(--sh-1);
}
.ui-x-float:hover {
  background: #fff;
}
.ui-x-float svg {
  width: 18px;
  height: 18px;
}
.v-sheet .ui-x-float {
  top: 18px;
}
.ui-bd {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--s-5);
  overscroll-behavior: contain;
}
.ui-bd.flush {
  padding: 0;
}
.ui-ft {
  flex: none;
  padding: var(--s-4) var(--s-5);
  border-top: 1px solid var(--border);
  background: var(--surface-2);
}

@media (min-width: 720px) {
  .ui-ov {
    padding: var(--s-8);
  }
  .v-sheet {
    align-items: center;
    justify-content: center;
    padding: var(--s-8);
  }
  .v-sheet .ui-pn {
    max-width: 520px;
    max-height: calc(100dvh - 64px);
    border-radius: var(--r-xl);
    padding-bottom: 0;
  }
  .v-sheet.ui-ov .s-lg {
    max-width: 720px;
  }
  .v-sheet .ui-grip {
    display: none;
  }
  .ui-hd {
    padding: var(--s-6) var(--s-6) var(--s-4);
  }
  .ui-bd {
    padding: var(--s-6);
  }
  .ui-bd.flush {
    padding: 0;
  }
  .ui-ft {
    padding: var(--s-4) var(--s-6);
  }
  .v-drawer,
  .v-side {
    padding: 0;
  }
}

/* ----- Animations ----- */
.ui-center-enter-active,
.ui-sheet-enter-active,
.ui-drawer-enter-active,
.ui-side-enter-active {
  transition: opacity var(--dur-3) var(--ease-out);
}
.ui-center-leave-active,
.ui-sheet-leave-active,
.ui-drawer-leave-active,
.ui-side-leave-active {
  transition: opacity var(--dur-2) var(--ease-out);
}
.ui-center-enter-from,
.ui-center-leave-to,
.ui-sheet-enter-from,
.ui-sheet-leave-to,
.ui-drawer-enter-from,
.ui-drawer-leave-to,
.ui-side-enter-from,
.ui-side-leave-to {
  opacity: 0;
}

.ui-center-enter-active .ui-pn {
  transition: transform var(--dur-3) var(--ease-spring);
}
.ui-center-leave-active .ui-pn {
  transition: transform var(--dur-2) var(--ease-out);
}
.ui-center-enter-from .ui-pn,
.ui-center-leave-to .ui-pn {
  transform: translateY(8px) scale(0.97);
}

.ui-sheet-enter-active .ui-pn {
  transition: transform var(--dur-3) var(--ease-out);
}
.ui-sheet-leave-active .ui-pn {
  transition: transform var(--dur-2) var(--ease-in-out);
}
.ui-sheet-enter-from .ui-pn,
.ui-sheet-leave-to .ui-pn {
  transform: translateY(100%);
}

.ui-drawer-enter-active .ui-pn {
  transition: transform var(--dur-3) var(--ease-out);
}
.ui-drawer-leave-active .ui-pn {
  transition: transform var(--dur-2) var(--ease-in-out);
}
.ui-drawer-enter-from .ui-pn,
.ui-drawer-leave-to .ui-pn {
  transform: translateX(100%);
}

.ui-side-enter-active .ui-pn {
  transition: transform var(--dur-3) var(--ease-out);
}
.ui-side-leave-active .ui-pn {
  transition: transform var(--dur-2) var(--ease-in-out);
}
.ui-side-enter-from .ui-pn,
.ui-side-leave-to .ui-pn {
  transform: translateX(-100%);
}

@media (min-width: 720px) {
  .ui-sheet-enter-from .ui-pn,
  .ui-sheet-leave-to .ui-pn {
    transform: translateY(8px) scale(0.97);
  }
  .ui-sheet-enter-active .ui-pn {
    transition: transform var(--dur-3) var(--ease-spring);
  }
}
</style>
