<template>
  <div class="ch">
    <svg class="ch-svg" viewBox="0 0 300 120" preserveAspectRatio="none" role="img" aria-label="Histogramme du chiffre d’affaires">
      <line v-for="g in [30, 60, 90]" :key="g" x1="0" x2="300" :y1="g" :y2="g" class="ch-grid" />
      <g :key="barsKey" class="ch-bars">
        <rect
          v-for="(bar, idx) in bars"
          :key="idx"
          :x="bar.x"
          :y="bar.y"
          :width="bar.w"
          :height="bar.h"
          rx="3"
          :class="{ zero: bar.value === 0 }"
          :style="{ animationDelay: `${idx * 30}ms` }"
        >
          <title>{{ bar.label }} : {{ formatMoney(bar.value) }}</title>
        </rect>
      </g>
    </svg>
    <div class="ch-lbls">
      <span>{{ bars[0]?.label || '' }}</span>
      <span>{{ bars[bars.length - 1]?.label || '' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatMoney } from '../../utils/adminOrders';

const props = defineProps<{
  bars: Array<{ x: number; y: number; w: number; h: number; value: number; label: string }>;
}>();

// Relance l'animation quand la période change
const barsKey = computed(() => props.bars.map((b) => `${b.label}:${b.value}`).join('|'));
</script>

<style scoped>
.ch-svg {
  display: block;
  width: 100%;
  height: 160px;
  overflow: visible;
}
.ch-grid {
  stroke: var(--border);
  stroke-width: 1;
  stroke-dasharray: 3 4;
  vector-effect: non-scaling-stroke;
}
.ch-bars rect {
  fill: var(--accent);
  transform-box: fill-box;
  transform-origin: bottom;
  animation: bar-grow 0.6s var(--ease-out) both;
  transition: fill var(--dur-2);
}
.ch-bars rect:hover {
  fill: var(--ink);
}
.ch-bars rect.zero {
  fill: var(--border-strong);
}
.ch-lbls {
  display: flex;
  justify-content: space-between;
  margin-top: var(--s-2);
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

@keyframes bar-grow {
  from {
    transform: scaleY(0);
  }
}
</style>
