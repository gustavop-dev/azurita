<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import puzzleImage from '@/assets/resources/puzzle_29/Captura de pantalla 2025-12-28 010331.png'

const puzzleCompleted = ref(false)
const answer = ref('')
const error = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_29_solved') === 'true'
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
  const correctAnswer = 'quiero amar sin pensar en que me haran que vea el alma y no los ojos tal vez volar sin ver si hay un puñal'
  
  if (normalized.includes(normalizeText(correctAnswer))) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_29_solved', 'true')
    error.value = ''
  } else {
    error.value = 'Ese no es el verso correcto. Piensa en la canción 🎵'
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
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 29 🎵</span>
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
            Escribe el verso de esta canción
          </p>
          <textarea
            v-model="answer"
            rows="3"
            placeholder="Escribe el verso aquí..."
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
          <div class="text-6xl mb-4">👶💕</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Correcto!</h2>
          <p class="text-gray-500 text-sm italic">"Quiero amar sin pensar en que me harán, que vea el alma y no los ojos, tal vez volar sin ver si hay un puñal"</p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <div class="space-y-4 text-gray-700 leading-relaxed text-sm">
          <p>
            Porque después de este año, creo que los dos somos dos seres que tenemos <span class="font-semibold">miedo de la vida</span>, de dar tanta vulnerabilidad al otro y que se pueda convertir eso en un puñal. Aunque deseamos profundamente amar, podemos dejarnos llevar por nuestros miedos y emociones.
          </p>

          <p>
            A veces pensamos que estaríamos mejor solos por el miedo a la felicidad. Sin embargo, me gusta ese verso porque al final, después de todo eso, me doy cuenta que del otro lado solo hay una niña con miedo y de este lado hay otro niño con miedo.
          </p>

          <p>
            Aunque seamos grandes, tal vez <span class="font-semibold">para el amor todas las personas son como niños</span>. Después de pensar en todo eso, es como cuando una vez mi abuelita me acompañó al primer día de kinder jejeje, de la mano y me dejó allí.
          </p>

          <p>
            Creo que tuve que tomar a mi niño, llevarlo de la mano a donde estás tú. Aunque cuando él está solo conmigo se pone revoltoso, se pone a llorar y hace de todo, cuando te ve se sonroja y se oculta detrás de mi pierna mientras ve tu niña pequeña jejeje.
          </p>

          <p>
            No sé cómo será tu niña interior, pero creo que el mío es algo revoltoso jejeje. Lo cierto es que yo de adulto también tenía miedo, pero tenía que ser el héroe de él, así que tenía que actuar como si no tuviera miedo.
          </p>

          <p>
            Al final lo llevé a tu lado y mostrarte que <span class="font-semibold">al final somos humanos, somos personas</span> jejeje, no somos perfectos y lo hermoso de la vida está en sus imperfecciones porque la hace mágica y hermosa.
          </p>

          <p>
            Así que creo que nuestros dos niños interiores hicieron las paces y se llevan bien ejejjeje. Ahora nuestras versiones adultas deberían tomarse de la mano.
          </p>

          <p class="text-center font-semibold text-gray-800 pt-4 italic">
            Esto es como si tú y yo estuviéramos sentados en la banca de un parque y viéramos a nuestras versiones pequeñas jugando en el parque jejeje 🌿💕
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
