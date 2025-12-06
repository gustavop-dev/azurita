<script setup lang="ts">
import { ref, onMounted } from 'vue'
import puzzleImage1 from '@/assets/resources/puzzle_9/IMG-20250808-WA0000.jpg'
import puzzleImage2 from '@/assets/resources/puzzle_9/IMG-20250814-WA0036.jpg'

const puzzleCompleted = ref(false)

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_9_solved') === 'true'
})

const completePuzzle = () => {
  localStorage.setItem('puzzle_9_solved', 'true')
  puzzleCompleted.value = true
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(220, 38, 38, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 9</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            ¿Alguna vez habías sido así de tierna?
          </h1>
        </div>
        
        <!-- Imágenes -->
        <div class="px-10 pb-10 space-y-4">
          <img 
            :src="puzzleImage1" 
            alt="Momento tierno 1" 
            class="w-full rounded-2xl"
          />
          <img 
            :src="puzzleImage2" 
            alt="Momento tierno 2" 
            class="w-full rounded-2xl"
          />
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
      <div v-else class="text-center p-16">
        <div class="text-7xl mb-8">🥰</div>
        <h2 class="text-3xl font-black text-gray-800 mb-4">Qué ternura</h2>
        <p class="text-gray-500 text-lg mb-10">Momentos que derriten el corazón 💕</p>
        
        <router-link
          to="/"
          class="inline-block px-10 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
          style="background-color: #a8e6cf; border: 3px solid #000;"
        >
          Continuar →
        </router-link>
      </div>
    </div>
  </div>
</template>
