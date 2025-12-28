<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import puzzleImage from '@/assets/resources/puzzle_30/Captura de pantalla 2025-12-28 012103.png'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_30_solved') === 'true'
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
    .replace(/[\s-]/g, '')
}

const checkAnswer = () => {
  const normalized = normalizeText(answer.value)
  
  if (normalized.includes('stilllovingyou')) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_30_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Esa no es la canción correcta. Piensa bien 🎵'
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
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 30 🎵</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Una canción para ti
          </h1>
        </div>
        
        <!-- Pregunta -->
        <div class="px-10 pb-6">
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <p class="text-gray-800 text-lg text-center mb-6">
              ¿Cómo se llama la canción que te dedicaste?
            </p>
            <input
              v-model="answer"
              @keyup.enter="checkAnswer"
              type="text"
              placeholder="Escribe el nombre de la canción..."
              class="w-full px-6 py-4 text-lg border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200"
            />
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
      <div v-else class="px-10 py-12">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🎵💕</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Correcto!</h2>
          <p class="text-gray-500 text-sm italic">Still Loving You</p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <!-- Imagen -->
        <div class="mb-6">
          <img 
            :src="puzzleImage" 
            alt="Still Loving You" 
            class="w-full rounded-2xl border-2 border-gray-200"
          />
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <div class="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Esta canción me enseñó que en verdad, a pesar de cualquier cosa que suceda, <span class="font-semibold">en verdad siempre te seguiré amando</span>.
          </p>

          <p>
            Porque podemos enojarnos, pueden pasar muchas cosas, pero de las cosas más profundas que tiene el ser humano y puras es ese sentimiento de seguir amando aún, de seguir queriendo a esa persona.
          </p>

          <p>
            Escuchar esta canción me recuerda tanto que <span class="font-semibold">mi corazón siempre será tuyo</span>, que nunca te soltaría y que si te fueras nunca te olvidaría porque tu nombre está tatuado en mi corazón jejej.
          </p>

          <p>
            Es un sentimiento bello, algo tan profundo e intrínseco que es simplemente bello. <span class="font-semibold">Algo tan puro que será una marca de vida</span> con la que caminaré toda mi vida.
          </p>

          <p class="text-center font-semibold text-gray-800 pt-4">
            Still loving you 💕✨
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
