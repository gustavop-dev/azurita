<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'

const puzzleCompleted = ref(false)
const word1 = ref('')
const word2 = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_22_solved') === 'true'
})

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
}

const checkAnswer = () => {
  const normalized1 = normalizeText(word1.value)
  const normalized2 = normalizeText(word2.value)
  
  if (normalized1.includes('mis ojos') && normalized2.includes('con la luz de tu mirada')) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_22_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Las palabras no son correctas. Piensa bien en la frase 💕'
  }
}

const retryPuzzle = () => {
  puzzleCompleted.value = false
  word1.value = ''
  word2.value = ''
  error.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(116, 192, 252, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 22 ✨</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Completa la frase
          </h1>
        </div>
        
        <!-- Frase -->
        <div class="px-10 pb-6">
          <div class="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <p class="text-gray-800 text-lg leading-relaxed text-center">
              Que siga teniendo la dicha de que
              <span class="inline-block mx-2">
                <input
                  v-model="word1"
                  type="text"
                  placeholder="-------"
                  class="w-32 px-3 py-1 text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </span>
              despierten un día más
              <span class="inline-block mx-2">
                <input
                  v-model="word2"
                  type="text"
                  placeholder="-------"
                  class="w-64 px-3 py-1 text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </span>
            </p>
          </div>
          <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
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
        emoji="✨"
        title="¡Correcto!"
        message="Que siga teniendo la dicha de que mis ojos despierten un día más con la luz de tu mirada 💕"
        @retry="retryPuzzle"
      />
    </div>
  </div>
</template>
