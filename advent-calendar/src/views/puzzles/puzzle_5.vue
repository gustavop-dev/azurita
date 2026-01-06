<script setup lang="ts">
import { ref, onMounted } from 'vue'
import puzzleImage from '@/assets/resources/puzzle_5/IMG-20250406-WA0007.jpg'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_5_solved') === 'true'
})

const checkAnswer = () => {
  const normalizedAnswer = answer.value.toLowerCase().trim()
  if (normalizedAnswer === 'mío' || normalizedAnswer === 'mio') {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_5_solved', 'true')
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
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(220, 38, 38, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 5</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            ¿De quién?
          </h1>
        </div>
        
        <!-- Imagen -->
        <div class="px-10 pb-10">
          <img 
            :src="puzzleImage" 
            alt="Pista" 
            class="w-full rounded-2xl"
          />
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Form -->
        <div class="p-10">
          <label class="block text-sm font-semibold text-gray-500 mb-4">Tu respuesta</label>
          
          <input
            v-model="answer"
            type="text"
            placeholder="Escribe aquí..."
            @keyup.enter="checkAnswer"
            class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all mb-6"
          />
          
          <p v-if="error" class="text-red-500 text-center font-medium py-3 bg-red-50 rounded-xl mb-6">
            {{ error }}
          </p>
          
          <button
            @click="checkAnswer"
            class="w-full py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Comprobar
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
        <div class="text-7xl mb-8">❤️</div>
        <h2 class="text-3xl font-black text-gray-800 mb-4">¡Correcto!</h2>
        <p class="text-gray-500 text-lg mb-10">Mío, siempre mío 💕</p>
        
        <div class="flex gap-4 justify-center">
          <button
            @click="retryPuzzle"
            class="px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] bg-gray-100 hover:bg-gray-200"
            style="border: 3px solid #000;"
          >
            🔄 Reintentar
          </button>
          <router-link
            to="/"
            class="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Continuar →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
