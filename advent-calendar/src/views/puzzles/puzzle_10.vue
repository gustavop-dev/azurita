<script setup lang="ts">
import { ref, onMounted } from 'vue'

const puzzleCompleted = ref(false)

onMounted(() => {
  puzzleCompleted.value = localStorage.getItem('puzzle_10_solved') === 'true'
})

const completePuzzle = () => {
  localStorage.setItem('puzzle_10_solved', 'true')
  puzzleCompleted.value = true
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border-4 border-christmas-red">
      <h1 class="text-4xl font-bold text-center mb-4 text-christmas-red">
        🎄 Puzzle 10 🎄
      </h1>
      <p class="text-center text-gray-600 mb-8">
        Décimo desafío del calendario de adviento
      </p>
      
      <div class="min-h-[300px] flex items-center justify-center">
        <div v-if="!puzzleCompleted" class="text-center">
          <p class="text-xl mb-6">¡Aquí va tu puzzle!</p>
          <button
            @click="completePuzzle"
            class="bg-christmas-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Resolver Puzzle
          </button>
        </div>
        
        <div v-else class="text-center">
          <p class="text-3xl mb-4">🎉 ¡Completado! 🎉</p>
          <router-link
            to="/"
            class="inline-block bg-christmas-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Volver al Inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
