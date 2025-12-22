<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import puzzleImage from '@/assets/resources/puzzle_20/Captura de pantalla 2025-12-22 161755.png'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_20_solved') === 'true'
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
  const correctAnswer = 'solo una cosa te pediria que si te doy mi corazon me lo cuides todos los dias'
  
  if (normalized.includes(normalizeText(correctAnswer))) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_20_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Esa no es la frase correcta. Recuerda la pregunta especial 💕'
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
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(42, 157, 143, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 20 💕</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Ya sabes cuál es la pregunta...
          </h1>
        </div>
        
        <!-- Imagen -->
        <div class="px-10 pb-6">
          <img 
            :src="puzzleImage" 
            alt="Pregunta especial" 
            class="w-full rounded-2xl border-2 border-gray-200"
          />
        </div>
        
        <!-- Pregunta -->
        <div class="px-10 pb-4">
          <p class="text-gray-600 text-center mb-4">
            Escribe la respuesta completa
          </p>
          <textarea
            v-model="answer"
            rows="3"
            placeholder="Escribe la frase aquí..."
            class="w-full px-6 py-4 text-lg border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 resize-none"
          ></textarea>
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
          <div class="text-6xl mb-4">💕</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Correcto!</h2>
          <p class="text-gray-500 text-sm italic">"Solo una cosa te pediría, que si te doy mi corazón me lo cuides todos los días"</p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <div class="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Esta canción representa una <span class="font-semibold">aceptación dentro de mí</span> en la que aceptaba que lo que sentía por ti era demasiado fuerte. Aunque a veces quisiera reprimirlo, era inevitable pasar algunas noches sobrepensando sobre ti, sentirme mal si no querías salir o incluso <span class="font-semibold">esperar con ansias un mensaje tuyo</span> jejeje.
          </p>

          <p>
            Sé que suena algo loco, pero en verdad estaba <span class="font-semibold">demasiado enamorado</span>. Quería verte en la U, quería salir contigo siempre, quería saber más sobre ti, siempre quería más. De repente me volví tan sensible a ti: cualquier cosa que hicieras o dijeras me importaba y pensaba en ello.
          </p>

          <p>
            Por esa época empecé a <span class="font-semibold">escribir demasiado acerca de ti</span>, y es que no paraba de divagar. Así que acepté que en verdad estaba enamorado y que no podía suprimirlo o ocultarlo.
          </p>

          <p>
            Por eso cuando te regalé las hortensias la primera vez te dije esa frase: porque sentía mucho miedo de que en medio de mi locura me pudieras lastimar. Sabía que al final <span class="font-semibold">mi corazón ya estaba en tus manos</span> sin que yo quisiera o tú me lo pidieras, simplemente sucedió así.
          </p>

          <p class="text-center font-semibold text-gray-800 pt-4">
            Solo me quedaba esperar que pudieras cuidarlo por mí 💖
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
