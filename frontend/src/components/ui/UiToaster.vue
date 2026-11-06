<template>
  <Teleport to="body">
    <div class="toaster" role="status" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div v-for="t in toastStore.toasts" :key="t.id" class="toast" :class="t.tone">
          <component :is="iconFor(t.tone)" class="ic" aria-hidden="true" />
          <span>{{ t.message }}</span>
          <button type="button" class="tx" aria-label="Masquer le message" @click="toastStore.dismiss(t.id)">
            <X aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Check, AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next';
import { useToastStore, type ToastTone } from '../../stores/toast';

const toastStore = useToastStore();

const iconFor = (tone: ToastTone) =>
  tone === 'success' ? Check : tone === 'warning' ? AlertTriangle : tone === 'danger' ? AlertCircle : Info;
</script>

<style scoped>
.toaster {
  position: fixed;
  left: 50%;
  bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-2);
  width: min(92vw, 420px);
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--s-3);
  max-width: 100%;
  padding: 10px 8px 10px 14px;
  border-radius: var(--r-md);
  background: var(--ink);
  color: var(--on-ink);
  font-size: var(--fs-sm);
  font-weight: 500;
  box-shadow: var(--sh-3);
}
.toast span {
  flex: 1;
  min-width: 0;
}
.ic {
  width: 18px;
  height: 18px;
  flex: none;
  color: var(--accent-on-ink);
}
.toast.success .ic {
  color: rgb(var(--c-success-200));
}
.toast.warning .ic {
  color: rgb(var(--c-warning-200));
}
.toast.danger .ic {
  color: rgb(var(--c-danger-200));
}
.tx {
  flex: none;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--on-ink-muted);
  cursor: pointer;
}
.tx:hover {
  background: rgb(255 255 255 / 0.08);
  color: var(--on-ink);
}
.tx svg {
  width: 16px;
  height: 16px;
}

.toast-enter-active {
  transition: opacity var(--dur-2) var(--ease-out), transform var(--dur-3) var(--ease-spring);
}
.toast-leave-active {
  transition: opacity var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease-out);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.toast-move {
  transition: transform var(--dur-3) var(--ease-out);
}

@media (min-width: 720px) {
  .toaster {
    bottom: 28px;
  }
}
</style>
