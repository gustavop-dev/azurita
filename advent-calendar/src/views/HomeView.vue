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
  { number: 13, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-13') },
  { number: 14, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-14') },
  { number: 15, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-15') },
  { number: 16, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-16') },
  { number: 17, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-17') },
  { number: 18, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-18') },
  { number: 19, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-19') },
  { number: 20, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-20') },
  { number: 21, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-21') },
  { number: 22, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-22') },
  { number: 23, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-23') },
  { number: 24, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-24') },
  { number: 25, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-25') },
  { number: 26, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-26') },
  { number: 27, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-27') },
  { number: 28, color: 'soft-blue', shadowColor: 'rgba(116, 192, 252, 0.3)', unlockDate: new Date('2025-12-28') },
  { number: 29, color: 'christmas-red', shadowColor: 'rgba(220, 38, 38, 0.3)', unlockDate: new Date('2025-12-29') },
  { number: 30, color: 'christmas-green', shadowColor: 'rgba(42, 157, 143, 0.3)', unlockDate: new Date('2025-12-30') },
  { number: 31, color: 'christmas-gold', shadowColor: 'rgba(244, 162, 97, 0.3)', unlockDate: new Date('2025-12-31') }
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
  const now = new Date()
  // Normalizar las fechas a medianoche en zona horaria local
  const unlockDay = new Date(unlockDate.getFullYear(), unlockDate.getMonth(), unlockDate.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Usar > en lugar de >= para que solo se desbloquee cuando ya pasó el día
  const dateReached = today > unlockDay
  
  // El puzzle 1 solo necesita que la fecha haya llegado (o sea que ya pasó el día anterior)
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
    for (let i = 1; i <= 31; i++) {
      localStorage.removeItem(`puzzle_${i}_solved`)
      localStorage.removeItem(`puzzle_${i}_response`)
    }
    // Recargar la página para reflejar los cambios
    window.location.reload()
  }
}
</script>

<template>
  <div class="min-h-screen py-20 relative flex items-center justify-center">
    <!-- Botón de Restaurar -->
    <button
      @click="resetProgress"
      class="fixed top-8 right-8 px-10 py-3 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl border-3 border-black transition-all transform hover:scale-105 active:scale-95 z-20"
      style="box-shadow: 4px 4px 0px 0px rgba(220, 38, 38, 0.3);"
    >
      Restaurar
    </button>
    
    <!-- Grid de puzzles -->
    <div class="flex justify-center px-8 py-4">
      <div class="grid grid-cols-8 gap-6">
        <div
          v-for="puzzle in puzzles"
          :key="puzzle.number"
          @click="goToPuzzle(puzzle.number, puzzle.unlockDate)"
          :class="[
            'puzzle-card bg-white rounded-2xl px-12 py-6 border-4 transition-all flex flex-col items-center justify-center min-h-[140px] min-w-[160px]',
            `border-${puzzle.color}`,
            isPuzzleUnlocked(puzzle.number, puzzle.unlockDate) ? 'cursor-pointer hover:scale-105' : 'opacity-40 cursor-not-allowed grayscale',
            isPuzzleSolved(puzzle.number, puzzle.unlockDate) ? 'ring-4 ring-green-400' : ''
          ]"
          :style="`box-shadow: 8px 8px 0px 0px ${puzzle.shadowColor};`"
        >
          <div :class="`text-5xl font-black text-${puzzle.color} mb-2 text-center select-none`">
            {{ puzzle.number }}
          </div>
          <div class="text-xs text-christmas-dark uppercase tracking-wider text-center font-bold select-none">
            <span v-if="isPuzzleSolved(puzzle.number, puzzle.unlockDate)">✅ Completado</span>
            <span v-else-if="isPuzzleUnlocked(puzzle.number, puzzle.unlockDate)">Puzzle</span>
            <span v-else>🔒 Bloqueado</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
