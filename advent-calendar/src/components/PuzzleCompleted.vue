<script setup lang="ts">
defineProps<{
  emoji: string
  title: string
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="text-center p-16">
    <div class="text-7xl mb-8">{{ emoji }}</div>
    <h2 class="text-3xl font-black text-gray-800 mb-4">{{ title }}</h2>
    <p class="text-gray-500 text-lg mb-10">{{ message }}</p>
    
    <div class="flex gap-4 justify-center">
      <button
        @click="$emit('retry')"
        class="px-10 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] bg-gray-100 hover:bg-gray-200"
        style="border: 3px solid #000;"
      >
        🔄 Reintentar
      </button>
      <router-link
        to="/"
        class="inline-block px-10 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
        style="background-color: #a8e6cf; border: 3px solid #000;"
      >
        Continuar →
      </router-link>
    </div>
  </div>
</template>
