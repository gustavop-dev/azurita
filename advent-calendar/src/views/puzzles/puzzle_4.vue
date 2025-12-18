<script setup lang="ts">
import { ref, onMounted } from 'vue'
import puzzleImage from '@/assets/resources/puzzle_4/IMG-20250412-WA0099.jpg'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_4_solved') === 'true'
})

const checkAnswer = () => {
  if (answer.value.toLowerCase().trim() === 'te amo') {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_4_solved', 'true')
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
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(116, 192, 252, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 4</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            ¿En qué mes fueron mis primeras hortensias?
          </h1>
        </div>
        
        <!-- Imagen -->
        <div class="px-10 pb-10">
          <img 
            :src="puzzleImage" 
            alt="Hortensias" 
            class="w-full rounded-2xl"
          />
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Form -->
        <div class="p-10">
          <label class="block text-sm font-semibold text-gray-500 mb-4">Escribe el mes</label>
          
          <input
            v-model="answer"
            type="text"
            placeholder="Escribe el mes..."
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
      <PuzzleCompleted
        v-else
        emoji="❤️"
        title="¡Correcto!"
        message="Te amo más que ayer pero menos que mañana 💕"
        @retry="retryPuzzle"
      />
    </div>
  </div>
</template>
