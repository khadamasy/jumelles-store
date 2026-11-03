<template>
  <svg
    viewBox="0 0 64 64"
    :class="className"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Fond Carré Orange Officiel -->
    <rect width="64" height="64" rx="16" fill="#FF7900" />
    
    <!-- Cercle extérieur blanc Orange Money -->
    <circle cx="32" cy="32" r="19" stroke="#FFFFFF" stroke-width="4.5" fill="none" />
    
    <!-- Anneau interne et pastille blanche -->
    <circle cx="32" cy="32" r="9" fill="#FFFFFF" />
    
    <!-- Signature OM texte stylisé -->
    <text
      x="32"
      y="56"
      text-anchor="middle"
      fill="#FFFFFF"
      font-size="9"
      font-weight="900"
      font-family="system-ui, -apple-system, sans-serif"
      letter-spacing="0.5"
    >
      MONEY
    </text>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>

