<template>
  <svg
    viewBox="0 0 24 24"
    :class="className"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.57 3.9c0-.55-.45-1-1-1H4.06c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 16.95 17.02.55 0 1-.45 1-1v-3.54c0-.55-.45-1-1-1z"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>

