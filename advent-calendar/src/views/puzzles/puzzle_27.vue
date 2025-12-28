<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_27_solved') === 'true'
})

const checkAnswer = () => {
  const normalized = answer.value.trim()
  
  if (normalized === '50') {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_27_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Ese no es el número correcto. Piensa bien 🎂'
  }
}

const retryPuzzle = () => {
  puzzleCompleted.value = false
  answer.value = ''
  error.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(220, 38, 38, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 27 🎂</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Nuestros cumpleaños
          </h1>
        </div>
        
        <!-- Pregunta -->
        <div class="px-10 pb-6">
          <div class="bg-gradient-to-r from-pink-50 to-red-50 border-2 border-pink-200 rounded-xl p-6">
            <p class="text-gray-800 text-lg text-center mb-6">
              ¿Cuál es la diferencia en días entre nuestros cumpleaños?
            </p>
            <div class="flex items-center justify-center gap-3">
              <input
                v-model="answer"
                @keyup.enter="checkAnswer"
                type="number"
                placeholder="#"
                class="w-24 px-6 py-4 text-lg text-center border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-200"
              />
              <span class="text-gray-600 text-lg font-medium">días</span>
            </div>
            <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
          </div>
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Botón -->
        <div class="p-10">
          <button
            @click="checkAnswer"
            class="w-full py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Verificar Respuesta
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
        emoji="🎂"
        title="¡Correcto!"
        message="50 días de diferencia entre nuestros cumpleaños 💕"
        @retry="retryPuzzle"
      />
    </div>
  </div>
</template>
