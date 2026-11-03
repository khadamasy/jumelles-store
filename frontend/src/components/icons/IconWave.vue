<template>
  <svg
    viewBox="0 0 64 64"
    :class="className"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Fond officiel Cyan Wave -->
    <rect width="64" height="64" rx="16" fill="#1DC3F4" />
    
    <!-- Corps du Pingouin Wave -->
    <ellipse cx="32" cy="36" rx="16" ry="19" fill="#181B28" />
    
    <!-- Ventre blanc -->
    <ellipse cx="32" cy="38" rx="10" ry="14" fill="#FFFFFF" />
    
    <!-- Yeux -->
    <ellipse cx="27" cy="26" rx="2" ry="2.8" fill="#FFFFFF" />
    <ellipse cx="37" cy="26" rx="2" ry="2.8" fill="#FFFFFF" />
    <circle cx="27.5" cy="26.5" r="1.2" fill="#181B28" />
    <circle cx="36.5" cy="26.5" r="1.2" fill="#181B28" />
    
    <!-- Bec orange -->
    <polygon points="32,29 28,34 36,34" fill="#FF9F1C" />
    
    <!-- Ailerons latéraux -->
    <path d="M16 35 C12 37 12 43 18 45 C17 41 16 38 16 35 Z" fill="#181B28" />
    <path d="M48 35 C52 37 52 43 46 45 C47 41 48 38 48 35 Z" fill="#181B28" />
    
    <!-- Pattes orange -->
    <ellipse cx="26" cy="54" rx="4.5" ry="2" fill="#FF9F1C" />
    <ellipse cx="38" cy="54" rx="4.5" ry="2" fill="#FF9F1C" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>

