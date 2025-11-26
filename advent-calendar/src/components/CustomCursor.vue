<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const cursorDot = ref<HTMLElement | null>(null)
const cursorOutline = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let currentX = 0
let currentY = 0
let outlineX = 0
let outlineY = 0

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

// Capturar movimiento del mouse incluso durante drag
const handleMouseMoveCapture = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

const animateCursor = () => {
  // Interpolar suavemente
  currentX += (mouseX - currentX) * 1
  currentY += (mouseY - currentY) * 1
  
  outlineX += (mouseX - outlineX) * 0.15
  outlineY += (mouseY - outlineY) * 0.15

  if (cursorDot.value) {
    cursorDot.value.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
  }

  if (cursorOutline.value) {
    cursorOutline.value.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`
  }

  requestAnimationFrame(animateCursor)
}

const handleMouseEnter = () => {
  if (cursorOutline.value) {
    gsap.to(cursorOutline.value, {
      scale: 1.5,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
}

const handleMouseLeave = () => {
  if (cursorOutline.value) {
    gsap.to(cursorOutline.value, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
}

onMounted(() => {
  // Usar capture phase para capturar eventos incluso durante drag
  document.addEventListener('mousemove', handleMouseMove, true)
  document.addEventListener('mousemove', handleMouseMoveCapture, { capture: true, passive: true })
  window.addEventListener('mousemove', handleMouseMoveCapture, { capture: true, passive: true })
  
  animateCursor()
  
  // Agregar eventos hover a elementos interactivos
  const interactiveElements = document.querySelectorAll('a, button, .draggable-card')
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove, true)
  document.removeEventListener('mousemove', handleMouseMoveCapture, true)
  window.removeEventListener('mousemove', handleMouseMoveCapture, true)
  
  const interactiveElements = document.querySelectorAll('a, button, .draggable-card')
  interactiveElements.forEach((el) => {
    el.removeEventListener('mouseenter', handleMouseEnter)
    el.removeEventListener('mouseleave', handleMouseLeave)
  })
})
</script>

<template>
  <div>
    <!-- Cursor dot -->
    <div
      ref="cursorDot"
      class="fixed top-0 left-0 w-2 h-2 bg-christmas-red rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style="z-index: 99999;"
    ></div>
    
    <!-- Cursor outline -->
    <div
      ref="cursorOutline"
      class="fixed top-0 left-0 w-8 h-8 border-2 border-christmas-red rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style="z-index: 99998;"
    ></div>
  </div>
</template>

<style scoped>
</style>
