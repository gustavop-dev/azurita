<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'

const puzzleCompleted = ref(false)

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_25_solved') === 'true'
})

const completePuzzle = () => {
  localStorage.setItem('puzzle_25_solved', 'true')
  puzzleCompleted.value = true
}

const retryPuzzle = () => {
  puzzleCompleted.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(244, 162, 97, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 25 - Navidad</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            🎄 ¡Feliz Navidad! 🎄
          </h1>
        </div>
        
        <!-- Contenido -->
        <div class="px-10 pb-10 text-center">
          <p class="text-gray-600 text-lg">¡Aquí irá tu puzzle especial de Navidad!</p>
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Botón -->
        <div class="p-10">
          <button
            @click="completePuzzle"
            class="w-full py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Continuar
          </button>
        </div>
        
        <!-- Volver -->
        <div class="border-t-2 border-gray-100 py-6 text-center">
          <router-link to="/" class="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
            ← Volver al calendario
          </router-link>
        </div>
      </div>
      
      <!-- Completado -->
      <PuzzleCompleted
        v-else
        emoji="🎅"
        title="¡Navidad!"
        message="¡Feliz día de Navidad! 🎁"
        @retry="retryPuzzle"
      />
    </div>
  </div>
</template>
