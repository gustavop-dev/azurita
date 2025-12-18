<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import puzzleImage from '@/assets/resources/puzzle_14/ma Meilleure.png'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_14_solved') === 'true'
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
  const correctAnswers = [
    'la peor de las bendiciones la maldicion mas hermosa',
    'la maldicion mas hermosa la peor de las bendiciones',
    'peor de las bendiciones maldicion mas hermosa'
  ]
  
  if (correctAnswers.some(correct => normalized.includes(normalizeText(correct)))) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_14_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Esa no es la frase correcta. Recuerda escuchar la canción y buscar la traducción en letras.com 🎵'
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
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 14 🎵</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Ma Meilleure Ennemie
          </h1>
          <p class="text-gray-500 text-sm mt-2">Stromae & Pomme</p>
        </div>
        
        <!-- Advertencia -->
        <div class="mx-10 mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p class="text-sm text-blue-800 leading-relaxed">
            <span class="font-bold">📌 Nota:</span> Cada canción de estos puzzles representa un momento o época especial de nuestro año juntos, con respecto a nuestros sentimientos. Escucha la canción y encuentra la frase que te he mencionado. Independientemente del idioma original, debes escribir la respuesta <span class="font-semibold">en español</span>. Usa la traducción de <a href="https://www.letras.com/" target="_blank" class="underline">letras.com</a> como referencia.
          </p>
        </div>
        
        <!-- Imagen -->
        <div class="px-10 pb-6">
          <img 
            :src="puzzleImage" 
            alt="Ma Meilleure Ennemie" 
            class="w-full rounded-2xl border-2 border-gray-200"
          />
        </div>
        
        <!-- Pregunta -->
        <div class="px-10 pb-4">
          <p class="text-gray-700 text-center mb-4">
            ¿Cuál es la frase de esta canción que te mencioné?
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
          <div class="text-6xl mb-4">🎵💕</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Correcto!</h2>
          <p class="text-gray-500 text-sm">"La peor de las bendiciones, la maldición más hermosa"</p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <div class="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Al inicio sentía <span class="font-semibold">demasiado revuelo con mis sentimientos</span>. Sentía tanto, pero tenía miedo. Miedo de que tal vez no debí conocerte, como dice la canción. Pero al mismo tiempo era <span class="font-semibold">lo más hermoso que me había pasado</span>.
          </p>

          <p>
            El tiempo juntos era tan mágico que simplemente... <span class="font-semibold">mi enemiga más querida eres tú</span>. No podía dejar de pensar en ti. Me daba emoción solo esperar al fin de semana para invitarte a salir, para conocerte más.
          </p>

          <p>
            Cada vez sentía más por ti. No quería parar. <span class="font-semibold">Me desbordaba de ganas de estar juntos</span>. La referencia de la canción no es porque fueras mala, sino porque simplemente no podía sacarte de mi mente.
          </p>

          <p class="text-center font-semibold text-gray-800 pt-4">
            Estaba loco... loco por ti 💙
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
