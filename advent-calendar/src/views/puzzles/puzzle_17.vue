<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_17_solved') === 'true'
})

const checkAnswer = () => {
  const normalized = answer.value.toLowerCase().trim()
  
  if (normalized.includes('dedo') || normalized.includes('mi dedo')) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_17_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Esa no es la respuesta correcta 🤔'
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
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(244, 162, 97, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 17 🩹</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Me ayudaste a curar...
          </h1>
        </div>
        
        <!-- Pregunta -->
        <div class="px-10 pb-4">
          <p class="text-gray-600 text-center mb-6">
            Completa la frase 😊
          </p>
          <input
            v-model="answer"
            @keyup.enter="checkAnswer"
            type="text"
            placeholder="Escribe tu respuesta..."
            class="w-full px-6 py-4 text-lg border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
          />
          <p v-if="error" class="text-red-500 text-sm mt-3 text-center">{{ error }}</p>
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
        emoji="🩹"
        title="¡Correcto!"
        message="¡Mi dedo! Me ayudaste a curarlo con tanto cariño 💕"
        @retry="retryPuzzle"
      />
    </div>
  </div>
</template>
