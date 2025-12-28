<script setup lang="ts">
import { ref, onMounted } from 'vue'
import puzzleImage from '@/assets/resources/puzzle_31/Captura de pantalla 2025-12-28 013413.png'

const puzzleCompleted = ref(false)

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_31_solved') === 'true'
})

const completePuzzle = () => {
  localStorage.setItem('puzzle_31_solved', 'true')
  puzzleCompleted.value = true
}

const retryPuzzle = () => {
  puzzleCompleted.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(220, 38, 38, 0.3);">
      
      <div v-if="!puzzleCompleted">
        <!-- Header -->
        <div class="text-center pt-10 pb-8 px-10">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 31 - Fin de Año 🎆</span>
          <h1 class="text-2xl font-black text-gray-800 mt-3">
            Una nota final
          </h1>
        </div>
        
        <!-- Imagen -->
        <div class="px-10 pb-6">
          <img 
            :src="puzzleImage" 
            alt="Fin de año" 
            class="w-full rounded-2xl border-2 border-gray-200"
          />
        </div>
        
        <!-- Mensaje -->
        <div class="px-10 pb-6">
          <div class="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Parece que hemos llegado al final del 2025 jejeje. Como pudiste notar, intenté recopilar momentos tanto físicos como emocionales vividos a lo largo de este año.
            </p>

            <p>
              Quisiera decirte que este año estuvo lleno de muchas sorpresas, cosas que no vi venir en lo absoluto pero que <span class="font-semibold">me gustaron mucho</span> jejejej.
            </p>

            <p>
              He puesto esta canción al final porque quisiera hacer una referencia al baile parecido al vals que hacen las parejas con ella. Porque si lees la letra detenidamente, puede parecer que idealiza el amor, pero en realidad es <span class="font-semibold">el amor de pareja que se alcanza luego de bastante tiempo y baches en el camino</span>, en los que al final aprendemos a caminar juntos al mismo ritmo, tal que podemos hacerlo tan bien que hasta bailando lo podemos hacer.
            </p>

            <p>
              Quisiera desearte un <span class="font-semibold text-gray-800">feliz 2026</span>. Espero me puedas seguir regalando momentos tan felices y que este 2025 se vaya con tantos sentimientos descubiertos en pareja juntos.
            </p>

            <p class="text-center font-semibold text-gray-800 text-lg pt-4">
              Te amo, Azurita 💕
            </p>

            <p class="text-center italic text-gray-500 text-sm pt-2">
              P.D: Te veo en el altar 💍
            </p>
          </div>
        </div>
        
        <!-- Separador -->
        <div class="border-t-2 border-gray-100"></div>
        
        <!-- Botón -->
        <div class="p-10">
          <button
            @click="completePuzzle"
            class="w-full py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            🎆 Feliz 2026 🎆
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
          <div class="text-6xl mb-4">🎆🎉</div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">¡Feliz 2026!</h2>
          <p class="text-gray-500 text-sm italic">Gracias por este año juntos</p>
        </div>

        <div class="border-t-2 border-gray-100 my-6"></div>

        <div class="text-center space-y-4 text-gray-700 leading-relaxed">
          <p class="text-xl font-semibold text-gray-800">
            ¡Has completado todos los días del calendario!
          </p>
          
          <p>
            Espero que cada puzzle te haya traído recuerdos hermosos de nuestro 2025 juntos 💕
          </p>

          <p class="text-gray-800 font-semibold pt-6">
            Que este 2026 esté lleno de más amor, risas y momentos inolvidables
          </p>

          <p class="text-2xl pt-4">
            💕✨🎆
          </p>
        </div>

        <div class="border-t-2 border-gray-100 mt-8 pt-6"></div>

        <div class="flex gap-4 justify-center">
          <button
            @click="retryPuzzle"
            class="px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] bg-gray-100 hover:bg-gray-200"
            style="border: 3px solid #000;"
          >
            🔄 Volver a leer
          </button>
          <router-link
            to="/"
            class="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Volver al inicio →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
