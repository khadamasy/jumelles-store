<template>
  <svg
    viewBox="0 0 24 24"
    :class="className"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 8.48 5.98 6.3 6.3 0 0 0 4.2-5.98V8.9a8.18 8.18 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.33z"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>

