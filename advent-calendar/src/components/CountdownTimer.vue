<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const targetDate = new Date('2025-12-01T00:00:00').getTime()
const timeRemaining = ref<TimeRemaining>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let intervalId: ReturnType<typeof setInterval> | null = null
const hoursCard = ref<HTMLElement | null>(null)
const minutesCard = ref<HTMLElement | null>(null)
const secondsCard = ref<HTMLElement | null>(null)

const calculateTimeRemaining = () => {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (intervalId) clearInterval(intervalId)
    return
  }

  // Calcular horas totales (incluyendo días convertidos a horas)
  const totalHours = Math.floor(distance / (1000 * 60 * 60))
  
  timeRemaining.value = {
    days: 0, // No lo usamos pero lo mantenemos en la interfaz
    hours: totalHours,
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  }
}

onMounted(() => {
  calculateTimeRemaining()
  intervalId = setInterval(calculateTimeRemaining, 1000)

  // Hacer las tarjetas arrastrables con física
  const cards = [hoursCard.value, minutesCard.value, secondsCard.value]
  
  let lastCollisionTime = 0
  
  cards.forEach((card, index) => {
    if (card) {
      Draggable.create(card, {
        type: 'x,y',
        inertia: true,
        bounds: window,
        edgeResistance: 1,
        throwResistance: 500,
        dragClickables: true,
        allowEventDefault: true,
        onDragStart: function() {
          // Hacer que el elemento no bloquee eventos del mouse
          this.target.style.pointerEvents = 'none'
          gsap.to(this.target, {
            scale: 1.05,
            zIndex: 1000,
            duration: 0.2,
            ease: 'power2.out'
          })
        },
        onDrag: function() {
          // Detectar colisiones mientras arrastra
          const now = Date.now()
          if (now - lastCollisionTime > 200) {
            cards.forEach((otherCard, otherIndex) => {
              if (otherCard && otherIndex !== index) {
                const rect1 = this.target.getBoundingClientRect()
                const rect2 = otherCard.getBoundingClientRect()
                
                if (!(rect1.right < rect2.left || 
                      rect1.left > rect2.right || 
                      rect1.bottom < rect2.top || 
                      rect1.top > rect2.bottom)) {
                  
                  lastCollisionTime = now
                  
                  const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2)
                  const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2)
                  const distance = Math.sqrt(dx * dx + dy * dy)
                  
                  if (distance > 0) {
                    const pushX = (dx / distance) * 150
                    const pushY = (dy / distance) * 150
                    
                    const tween = gsap.to(otherCard, {
                      x: `-=${pushX}`,
                      y: `-=${pushY}`,
                      duration: 1.5,
                      ease: 'power1.out',
                      onUpdate: function() {
                        // Verificar límites durante la animación y rebotar
                        const rect = otherCard.getBoundingClientRect()
                        const currentX = gsap.getProperty(otherCard, 'x') as number
                        const currentY = gsap.getProperty(otherCard, 'y') as number
                        
                        // Verificar colisión con otros elementos (sin sobreposición)
                        cards.forEach((checkCard, checkIndex) => {
                          if (checkCard && checkCard !== otherCard && checkIndex !== index) {
                            const checkRect = checkCard.getBoundingClientRect()
                            
                            // Detectar sobreposición
                            if (!(rect.right < checkRect.left || 
                                  rect.left > checkRect.right || 
                                  rect.bottom < checkRect.top || 
                                  rect.top > checkRect.bottom)) {
                              
                              // Calcular separación necesaria
                              const overlapX = Math.min(rect.right - checkRect.left, checkRect.right - rect.left)
                              const overlapY = Math.min(rect.bottom - checkRect.top, checkRect.bottom - rect.top)
                              
                              // Separar en la dirección de menor sobreposición
                              if (overlapX < overlapY) {
                                if (rect.left < checkRect.left) {
                                  gsap.set(otherCard, { x: currentX - overlapX - 1 })
                                } else {
                                  gsap.set(otherCard, { x: currentX + overlapX + 1 })
                                }
                              } else {
                                if (rect.top < checkRect.top) {
                                  gsap.set(otherCard, { y: currentY - overlapY - 1 })
                                } else {
                                  gsap.set(otherCard, { y: currentY + overlapY + 1 })
                                }
                              }
                              tween.kill()
                            }
                          }
                        })
                        
                        if (rect.left < 0) {
                          tween.kill()
                          gsap.set(otherCard, { x: currentX - rect.left })
                          gsap.to(otherCard, { x: `+=${Math.abs(pushX) * 0.5}`, duration: 0.6, ease: 'power2.out' })
                        }
                        if (rect.right > window.innerWidth) {
                          tween.kill()
                          gsap.set(otherCard, { x: currentX - (rect.right - window.innerWidth) })
                          gsap.to(otherCard, { x: `-=${Math.abs(pushX) * 0.5}`, duration: 0.6, ease: 'power2.out' })
                        }
                        if (rect.top < 0) {
                          tween.kill()
                          gsap.set(otherCard, { y: currentY - rect.top })
                          gsap.to(otherCard, { y: `+=${Math.abs(pushY) * 0.5}`, duration: 0.6, ease: 'power2.out' })
                        }
                        if (rect.bottom > window.innerHeight) {
                          tween.kill()
                          gsap.set(otherCard, { y: currentY - (rect.bottom - window.innerHeight) })
                          gsap.to(otherCard, { y: `-=${Math.abs(pushY) * 0.5}`, duration: 0.6, ease: 'power2.out' })
                        }
                      }
                    })
                  }
                }
              }
            })
          }
        },
        onDragEnd: function() {
          // Restaurar pointer-events
          this.target.style.pointerEvents = 'auto'
          gsap.to(this.target, {
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)'
          })
        },
        onThrowUpdate: function() {
          const rect = this.target.getBoundingClientRect()
          const margin = 0
          
          // Detectar colisión con bordes y rebotar
          if (rect.left <= margin && this.tween) {
            this.tween.kill()
            gsap.to(this.target, {
              x: margin + 10,
              duration: 0.5,
              ease: 'bounce.out'
            })
          }
          
          if (rect.right >= window.innerWidth - margin && this.tween) {
            this.tween.kill()
            gsap.to(this.target, {
              x: window.innerWidth - rect.width - margin - 10,
              duration: 0.5,
              ease: 'bounce.out'
            })
          }
          
          if (rect.top <= margin && this.tween) {
            this.tween.kill()
            gsap.to(this.target, {
              y: margin + 10,
              duration: 0.5,
              ease: 'bounce.out'
            })
          }
          
          if (rect.bottom >= window.innerHeight - margin && this.tween) {
            this.tween.kill()
            gsap.to(this.target, {
              y: window.innerHeight - rect.height - margin - 10,
              duration: 0.5,
              ease: 'bounce.out'
            })
          }
          
          // Colisiones durante el lanzamiento
          const now = Date.now()
          if (now - lastCollisionTime > 150) {
            cards.forEach((otherCard, otherIndex) => {
              if (otherCard && otherIndex !== index) {
                const rect1 = this.target.getBoundingClientRect()
                const rect2 = otherCard.getBoundingClientRect()
                
                if (!(rect1.right < rect2.left || 
                      rect1.left > rect2.right || 
                      rect1.bottom < rect2.top || 
                      rect1.top > rect2.bottom)) {
                  
                  lastCollisionTime = now
                  
                  const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2)
                  const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2)
                  const distance = Math.sqrt(dx * dx + dy * dy)
                  
                  if (distance > 0) {
                    const force = 500
                    const pushX = (dx / distance) * force
                    const pushY = (dy / distance) * force
                    
                    const tween = gsap.to(otherCard, {
                      x: `-=${pushX}`,
                      y: `-=${pushY}`,
                      duration: 2,
                      ease: 'power1.out',
                      onUpdate: function() {
                        // Verificar límites durante la animación y rebotar
                        const rect = otherCard.getBoundingClientRect()
                        const currentX = gsap.getProperty(otherCard, 'x') as number
                        const currentY = gsap.getProperty(otherCard, 'y') as number
                        
                        // Verificar colisión con otros elementos (sin sobreposición)
                        cards.forEach((checkCard, checkIndex) => {
                          if (checkCard && checkCard !== otherCard && checkIndex !== index) {
                            const checkRect = checkCard.getBoundingClientRect()
                            
                            // Detectar sobreposición
                            if (!(rect.right < checkRect.left || 
                                  rect.left > checkRect.right || 
                                  rect.bottom < checkRect.top || 
                                  rect.top > checkRect.bottom)) {
                              
                              // Calcular separación necesaria
                              const overlapX = Math.min(rect.right - checkRect.left, checkRect.right - rect.left)
                              const overlapY = Math.min(rect.bottom - checkRect.top, checkRect.bottom - rect.top)
                              
                              // Separar en la dirección de menor sobreposición
                              if (overlapX < overlapY) {
                                if (rect.left < checkRect.left) {
                                  gsap.set(otherCard, { x: currentX - overlapX - 1 })
                                } else {
                                  gsap.set(otherCard, { x: currentX + overlapX + 1 })
                                }
                              } else {
                                if (rect.top < checkRect.top) {
                                  gsap.set(otherCard, { y: currentY - overlapY - 1 })
                                } else {
                                  gsap.set(otherCard, { y: currentY + overlapY + 1 })
                                }
                              }
                              tween.kill()
                            }
                          }
                        })
                        
                        if (rect.left < 0) {
                          tween.kill()
                          gsap.set(otherCard, { x: currentX - rect.left })
                          gsap.to(otherCard, { x: `+=${Math.abs(pushX) * 0.5}`, duration: 0.8, ease: 'power2.out' })
                        }
                        if (rect.right > window.innerWidth) {
                          tween.kill()
                          gsap.set(otherCard, { x: currentX - (rect.right - window.innerWidth) })
                          gsap.to(otherCard, { x: `-=${Math.abs(pushX) * 0.5}`, duration: 0.8, ease: 'power2.out' })
                        }
                        if (rect.top < 0) {
                          tween.kill()
                          gsap.set(otherCard, { y: currentY - rect.top })
                          gsap.to(otherCard, { y: `+=${Math.abs(pushY) * 0.5}`, duration: 0.8, ease: 'power2.out' })
                        }
                        if (rect.bottom > window.innerHeight) {
                          tween.kill()
                          gsap.set(otherCard, { y: currentY - (rect.bottom - window.innerHeight) })
                          gsap.to(otherCard, { y: `-=${Math.abs(pushY) * 0.5}`, duration: 0.8, ease: 'power2.out' })
                        }
                      }
                    })
                  }
                }
              }
            })
          }
        }
      })
    }
  })
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
    <!-- Horas -->
    <div 
      ref="hoursCard"
      class="draggable-card absolute bg-white rounded-2xl px-10 py-5 md:px-16 md:py-7 border-4 border-christmas-green shadow-[8px_8px_0px_0px_rgba(42,157,143,0.3)] cursor-grab active:cursor-grabbing min-w-[140px] md:min-w-[180px]"
      style="left: 20%; top: 45%; transform: translate(-50%, -50%);"
    >
      <div class="text-5xl md:text-6xl font-black text-christmas-green mb-2 text-center select-none whitespace-nowrap">
        {{ formatNumber(timeRemaining.hours) }}
      </div>
      <div class="text-xs md:text-sm text-christmas-dark uppercase tracking-wider text-center font-bold select-none whitespace-nowrap">
        Horas
      </div>
    </div>

    <!-- Minutos -->
    <div 
      ref="minutesCard"
      class="draggable-card absolute bg-white rounded-2xl px-10 py-5 md:px-16 md:py-7 border-4 border-christmas-gold shadow-[8px_8px_0px_0px_rgba(244,162,97,0.3)] cursor-grab active:cursor-grabbing min-w-[140px] md:min-w-[180px]"
      style="left: 50%; top: 45%; transform: translate(-50%, -50%);"
    >
      <div class="text-5xl md:text-6xl font-black text-christmas-gold mb-2 text-center select-none whitespace-nowrap">
        {{ formatNumber(timeRemaining.minutes) }}
      </div>
      <div class="text-xs md:text-sm text-christmas-dark uppercase tracking-wider text-center font-bold select-none whitespace-nowrap">
        Minutos
      </div>
    </div>

    <!-- Segundos -->
    <div 
      ref="secondsCard"
      class="draggable-card absolute bg-white rounded-2xl px-10 py-5 md:px-16 md:py-7 border-4 border-soft-blue shadow-[8px_8px_0px_0px_rgba(116,192,252,0.3)] cursor-grab active:cursor-grabbing min-w-[140px] md:min-w-[180px]"
      style="left: 80%; top: 45%; transform: translate(-50%, -50%);"
    >
      <div class="text-5xl md:text-6xl font-black text-soft-blue mb-2 text-center select-none whitespace-nowrap">
        {{ formatNumber(timeRemaining.seconds) }}
      </div>
      <div class="text-xs md:text-sm text-christmas-dark uppercase tracking-wider text-center font-bold select-none whitespace-nowrap">
        Segundos
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
