<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PuzzleCompleted from '@/components/PuzzleCompleted.vue'
import audioFile from '@/assets/resources/puzzle_24/Ludovico Einaudi - Experience.mp3'

const puzzleCompleted = ref(false)
const audioEnded = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_24_solved') === 'true'
})

const onAudioEnded = () => {
  audioEnded.value = true
}

const completePuzzle = () => {
  localStorage.setItem('puzzle_24_solved', 'true')
  puzzleCompleted.value = true
}

const retryPuzzle = () => {
  puzzleCompleted.value = false
  audioEnded.value = false
  if (audioRef.value) {
    audioRef.value.currentTime = 0
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(42, 157, 143, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 24 - Nochebuena 🎄</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Una nota especial
          </h1>
        </div>
        
        <!-- Mensaje introductorio -->
        <div class="px-10 pb-8">
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <p class="text-gray-700 leading-relaxed mb-4">
              🎵 Antes de continuar, quiero que escuches esta pieza musical. Soy audió filo y en verdad es de las obras más hermosas que he escuchado.
            </p>
            <p class="text-gray-600 italic text-sm">
              La primera vez que la escuché, lloré 💕
            </p>
          </div>
        </div>

        <!-- Reproductor de audio -->
        <div class="px-10 pb-8">
          <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <audio 
              ref="audioRef"
              :src="audioFile" 
              controls 
              @ended="onAudioEnded"
              class="w-full"
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>

        <!-- Conversación (solo se muestra después de que el audio termine) -->
        <div v-if="audioEnded" class="px-10 pb-8">
          <div class="space-y-5">
            <!-- Mensaje 1 -->
            <div class="bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4">
              <p class="text-gray-800 leading-relaxed">
                Estoy muy seguro de que puedo hacerte feliz, y puedo hacerte feliz para siempre.
              </p>
            </div>

            <!-- Mensaje 2 -->
            <div class="bg-pink-100 border-l-4 border-pink-500 rounded-lg p-4">
              <p class="text-gray-800 leading-relaxed">
                ¿Pero por qué harías eso?
              </p>
            </div>

            <!-- Mensaje 3 -->
            <div class="bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4">
              <p class="text-gray-800 leading-relaxed font-semibold">
                Porque yo te amo profundamente 💕
              </p>
            </div>
          </div>
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Botón -->
        <div class="p-10">
          <button
            @click="completePuzzle"
            :disabled="!audioEnded"
            class="w-full py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            {{ audioEnded ? 'Continuar' : 'Escucha la pieza primero 🎵' }}
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
        emoji="💕"
        title="¡Nochebuena!"
        message="Porque yo te amo profundamente 🎄"
        @retry="retryPuzzle"
      />
    </div>
  </div>
</template>
