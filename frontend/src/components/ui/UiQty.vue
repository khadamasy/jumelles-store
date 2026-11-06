<template>
  <div class="qty" :class="`q-${size}`" role="group" :aria-label="label">
    <button
      type="button"
      :aria-label="minusLabel"
      :disabled="modelValue <= min && !allowRemove"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <Trash2 v-if="allowRemove && modelValue <= min" aria-hidden="true" />
      <Minus v-else aria-hidden="true" />
    </button>
    <span class="tnum" aria-live="polite">{{ modelValue }}</span>
    <button
      type="button"
      aria-label="Augmenter la quantité"
      :disabled="modelValue >= max"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      <Plus aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Minus, Plus, Trash2 } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    size?: 'sm' | 'md';
    label?: string;
    /** Au minimum, le bouton « − » devient « Retirer » (panier) */
    allowRemove?: boolean;
  }>(),
  { min: 1, max: 99, size: 'md', label: 'Quantité', allowRemove: false }
);

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>();

const minusLabel = computed(() =>
  props.allowRemove && props.modelValue <= props.min ? 'Retirer l’article' : 'Diminuer la quantité'
);
</script>

<style scoped>
.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  background: var(--surface);
  overflow: hidden;
}
.qty button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 46px;
  border: 0;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background-color var(--dur-2) var(--ease-out), transform var(--dur-1);
}
.qty button:hover:not(:disabled) {
  background: var(--bg-sunken);
}
.qty button:active:not(:disabled) {
  transform: scale(0.9);
}
.qty button:disabled {
  color: var(--text-faint);
  opacity: 0.5;
  cursor: not-allowed;
}
.qty svg {
  width: 16px;
  height: 16px;
}
.qty span {
  min-width: 28px;
  text-align: center;
  font-weight: 700;
}
.q-sm {
  border-radius: var(--r-sm);
}
.q-sm button {
  width: 40px;
  height: 40px;
}
.q-sm span {
  min-width: 22px;
  font-size: var(--fs-sm);
}
</style>
