<script setup lang="ts">
import { ref, onMounted } from 'vue'
import puzzleImage1 from '@/assets/resources/puzzle_8/IMG-20250723-WA0022.jpg'
import puzzleImage2 from '@/assets/resources/puzzle_8/IMG-20250726-WA0020.jpg'

const puzzleCompleted = ref(false)
const answer = ref('')
const userResponse = ref('')

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_8_solved') === 'true'
  userResponse.value = localStorage.getItem('puzzle_8_response') || ''
})

const saveAnswer = () => {
  if (answer.value.trim().length > 0) {
    puzzleCompleted.value = true
    localStorage.setItem('puzzle_8_solved', 'true')
    localStorage.setItem('puzzle_8_response', answer.value)
    userResponse.value = answer.value
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(116, 192, 252, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 8</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Esta vez fue como si nos casáramos...
          </h1>
          <p class="text-gray-600 mt-2">¿Qué sentiste?</p>
        </div>
        
        <!-- Imágenes -->
        <div class="px-10 pb-10 space-y-4">
          <img 
            :src="puzzleImage1" 
            alt="Momento especial 1" 
            class="w-full rounded-2xl"
          />
          <img 
            :src="puzzleImage2" 
            alt="Momento especial 2" 
            class="w-full rounded-2xl"
          />
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Form -->
        <div class="p-10">
          <label class="block text-sm font-semibold text-gray-500 mb-4">Escribe lo que sentiste</label>
          
          <textarea
            v-model="answer"
            placeholder="Comparte tus sentimientos..."
            rows="6"
            class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all mb-6 resize-none"
          ></textarea>
          
          <button
            @click="saveAnswer"
            :disabled="answer.trim().length === 0"
            class="w-full py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Guardar
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
      <div v-else class="p-16">
        <div class="text-center mb-8">
          <div class="text-7xl mb-6">💍</div>
          <h2 class="text-3xl font-black text-gray-800 mb-4">Guardado</h2>
        </div>
        
        <div class="bg-gray-50 rounded-2xl p-6 mb-8">
          <p class="text-gray-700 italic leading-relaxed">{{ userResponse }}</p>
        </div>
        
        <router-link
          to="/"
          class="block text-center px-10 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
          style="background-color: #a8e6cf; border: 3px solid #000;"
        >
          Continuar →
        </router-link>
      </div>
    </div>
  </div>
</template>
