<script setup lang="ts">
import { RouterView } from 'vue-router'
import CustomCursor from './components/CustomCursor.vue'
</script>

<template>
  <div class="min-h-screen bg-christmas-cream relative overflow-hidden custom-cursor-container">
    <!-- Custom Cursor -->
    <CustomCursor />
    
    <!-- Decorative circles/ornaments in background -->
    <div class="absolute top-10 left-10 w-20 h-20 rounded-full bg-soft-red opacity-20"></div>
    <div class="absolute top-32 right-20 w-16 h-16 rounded-full bg-soft-green opacity-20"></div>
    <div class="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-soft-blue opacity-20"></div>
    <div class="absolute bottom-40 right-1/3 w-12 h-12 rounded-full bg-christmas-gold opacity-20"></div>
    
    <!-- Small dots scattered -->
    <div class="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-christmas-red opacity-30"></div>
    <div class="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-christmas-green opacity-30"></div>
    <div class="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-soft-blue opacity-30"></div>
    
    <RouterView />
  </div>
</template>

<style>
.custom-cursor-container,
.custom-cursor-container *,
.custom-cursor-container a,
.custom-cursor-container button,
.custom-cursor-container input,
.custom-cursor-container textarea,
.custom-cursor-container select {
  cursor: none !important;
}

body {
  cursor: none !important;
}

* {
  cursor: none !important;
}
</style>
