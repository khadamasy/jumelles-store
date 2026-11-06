<template>
  <div class="empty" :class="{ compact }">
    <div v-if="$slots.icon" class="empty-ic" aria-hidden="true">
      <slot name="icon" />
    </div>
    <component :is="headingTag" class="empty-t">{{ title }}</component>
    <p v-if="text" class="empty-p">{{ text }}</p>
    <div v-if="$slots.default" class="empty-a">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    text?: string;
    headingTag?: 'h1' | 'h2' | 'h3' | 'p';
    compact?: boolean;
  }>(),
  { headingTag: 'h2', compact: false }
);
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--s-2);
  padding: var(--s-12) var(--s-4);
  animation: rise-in var(--dur-4) var(--ease-out) both;
}
.empty.compact {
  padding: var(--s-8) var(--s-4);
}
.empty-ic {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--s-2);
  border-radius: var(--r-lg);
  background: var(--accent-soft);
  color: var(--accent-text);
  box-shadow: inset 0 0 0 1px rgb(var(--c-gold-200));
}
.empty-ic :deep(svg) {
  width: 28px;
  height: 28px;
  stroke-width: 1.6;
}
.empty-t {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 450;
  line-height: var(--lh-snug);
}
.empty-p {
  margin: 0;
  max-width: 34em;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}
.empty-a {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-3);
  margin-top: var(--s-4);
}
</style>
