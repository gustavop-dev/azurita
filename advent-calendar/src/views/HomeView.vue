<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const puzzles = [
  { number: 1, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-01') },
  { number: 2, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-02') },
  { number: 3, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-03') },
  { number: 4, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-04') },
  { number: 5, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-05') },
  { number: 6, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-06') },
  { number: 7, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-07') },
  { number: 8, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-08') },
  { number: 9, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-09') },
  { number: 10, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-10') },
  { number: 11, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-11') },
  { number: 12, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-12') },
  { number: 13, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-13') }
]

const isDateReached = (unlockDate: Date) => {
  const now = new Date()
  const unlockDay = new Date(unlockDate.getFullYear(), unlockDate.getMonth(), unlockDate.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return today >= unlockDay
}

const isPuzzleSolved = (puzzleNumber: number, unlockDate: Date) => {
  // Solo mostrar como resuelto si la fecha ya llegó Y está marcado en localStorage
  return isDateReached(unlockDate) && localStorage.getItem(`puzzle_${puzzleNumber}_solved`) === 'true'
}

const isPuzzleUnlocked = (puzzleNumber: number, unlockDate: Date) => {
  const dateReached = isDateReached(unlockDate)
  
  // El puzzle 1 solo necesita que la fecha haya llegado
  if (puzzleNumber === 1) {
    return dateReached
  }
  
  // Los demás puzzles necesitan que la fecha haya llegado Y que el anterior esté resuelto
  const previousSolved = localStorage.getItem(`puzzle_${puzzleNumber - 1}_solved`) === 'true'
  return dateReached && previousSolved
}

const goToPuzzle = (number: number, unlockDate: Date) => {
  if (isPuzzleUnlocked(number, unlockDate)) {
    router.push(`/puzzle/${number}`)
  }
}

const resetProgress = () => {
  if (confirm('¿Estás segura de que quieres reiniciar todo el progreso? Esto borrará todas las respuestas guardadas.')) {
    // Limpiar todos los puzzles
    for (let i = 1; i <= 13; i++) {
      localStorage.removeItem(`puzzle_${i}_solved`)
      localStorage.removeItem(`puzzle_${i}_response`)
    }
    // Recargar la página para reflejar los cambios
    window.location.reload()
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
    <!-- Botón de Restaurar -->
    <button
      @click="resetProgress"
      class="absolute top-8 right-8 px-10 py-3 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl border-3 border-black transition-all transform hover:scale-105 active:scale-95 z-20"
      style="box-shadow: 4px 4px 0px 0px rgba(220, 38, 38, 0.3);"
    >
      Restaurar
    </button>
    
    <div
      v-for="(puzzle, index) in puzzles"
      :key="puzzle.number"
      @click="goToPuzzle(puzzle.number, puzzle.unlockDate)"
      :class="[
        'puzzle-card absolute bg-white rounded-2xl px-10 py-5 md:px-16 md:py-7 border-4 min-w-[140px] md:min-w-[180px] transition-all',
        `border-${puzzle.color}`,
        isPuzzleUnlocked(puzzle.number, puzzle.unlockDate) ? 'cursor-pointer hover:scale-105' : 'opacity-40 cursor-not-allowed grayscale',
        isPuzzleSolved(puzzle.number, puzzle.unlockDate) ? 'ring-4 ring-green-400' : ''
      ]"
      :style="`left: ${15 + (index % 5) * 17}%; top: ${30 + Math.floor(index / 5) * 25}%; transform: translate(-50%, -50%); box-shadow: 8px 8px 0px 0px ${puzzle.shadowColor};`"
    >
      <div :class="`text-5xl md:text-6xl font-black text-${puzzle.color} mb-2 text-center select-none whitespace-nowrap`">
        {{ puzzle.number }}
      </div>
      <div class="text-xs md:text-sm text-christmas-dark uppercase tracking-wider text-center font-bold select-none whitespace-nowrap">
        <span v-if="isPuzzleSolved(puzzle.number, puzzle.unlockDate)">✅ Completado</span>
        <span v-else-if="isPuzzleUnlocked(puzzle.number, puzzle.unlockDate)">Puzzle</span>
        <span v-else>🔒 Bloqueado</span>
      </div>
    </div>
  </div>
</template>
