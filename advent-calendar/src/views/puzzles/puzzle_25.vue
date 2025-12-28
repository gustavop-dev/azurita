<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import puzzleImage from '@/assets/resources/puzzle_25/Captura de pantalla 2025-12-27 232326.png'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_25_solved') === 'true'
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
    .replace(/[.,;:¿?¡!]/g, '')
    .replace(/\s+/g, ' ')
}

const checkAnswer = () => {
  const normalized = normalizeText(answer.value)
  const correctAnswer = 'me hiciste ser mejor me queda agradecer'
  
  if (normalized.includes(normalizeText(correctAnswer))) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_25_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Esa no es la frase correcta. Piensa en la canción 🎵'
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
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 25 - Navidad 🎄</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            ¿Qué dice la canción?
          </h1>
        </div>
        
        <!-- Imagen -->
        <div class="px-10 pb-6">
          <img 
            :src="puzzleImage" 
            alt="Canción especial" 
            class="w-full rounded-2xl border-2 border-gray-200"
          />
        </div>
        
        <!-- Pregunta -->
        <div class="px-10 pb-4">
          <p class="text-gray-600 text-center mb-4">
            Escribe la frase de la canción
          </p>
          <input
            v-model="answer"
            @keyup.enter="checkAnswer"
            type="text"
            placeholder="Escribe la frase aquí..."
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
      <div v-else class="px-10 py-12">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🎄💕</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Correcto!</h2>
          <p class="text-gray-500 text-sm italic">"Me hiciste ser mejor, me queda agradecer"</p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <div class="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Nunca supe cómo se sentía ese <span class="font-semibold">amor en pareja</span>. Tenía mucho miedo de tener una relación juntos y aunque la deseaba con muchas ansias, no sabía exactamente qué había del otro lado.
          </p>

          <p>
            Aún así me llené de expectativas y mucha felicidad. Por eso la canción dice <span class="italic">"no me imaginé que funcionaba así, no buscaba amor y un día te encontré..."</span>
          </p>

          <p>
            Porque es <span class="font-semibold">más hermoso de lo que pensé</span>. Conocerte fue haber conocido un nuevo mundo, un jardín tan puro y hermoso que solo me daba ganas de sentarme en él, admirarlo y empezar a construir mi casita y todo sobre él de la manera más hermosa posible.
          </p>

          <p class="text-center font-semibold text-gray-800 pt-4">
            Me hiciste ser mejor 🎄💕
          </p>
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
