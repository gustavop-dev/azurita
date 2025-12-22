<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import puzzleImage from '@/assets/resources/puzzle_21/IMG-20250406-WA0028.jpg'

const puzzleCompleted = ref(false)
const word1 = ref('')
const word2 = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_21_solved') === 'true'
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
  
  if (normalized1.includes('fuegos artificiales') && normalized2.includes('enamoro')) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_21_solved', 'true')
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
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(244, 162, 97, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 21 🎆</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Completa la frase
          </h1>
        </div>
        
        <!-- Frase -->
        <div class="px-10 pb-6">
          <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <p class="text-gray-800 text-lg leading-relaxed text-center">
              Necesito que dejes de poner tantos
              <span class="inline-block mx-2">
                <input
                  v-model="word1"
                  type="text"
                  placeholder="-------"
                  class="w-48 px-3 py-1 text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </span>
              en mi corazón porque me
              <span class="inline-block mx-2">
                <input
                  v-model="word2"
                  type="text"
                  placeholder="-------"
                  class="w-32 px-3 py-1 text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </span>
              de ellos
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
      <div v-else class="px-10 py-12">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🎆💕</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Correcto!</h2>
          <p class="text-gray-600 text-lg italic mt-4">
            "Necesito que dejes de poner tantos fuegos artificiales en mi corazón porque me enamoro de ellos"
          </p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <!-- Imagen -->
        <div class="mb-6">
          <img 
            :src="puzzleImage" 
            alt="Momento especial" 
            class="w-full rounded-2xl border-2 border-gray-200"
          />
        </div>

        <div class="border-t-2 border-gray-100 mt-8 pt-6"></div>

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
