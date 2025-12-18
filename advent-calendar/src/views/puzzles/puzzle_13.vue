<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showMessage = ref(false)

onMounted(() => {
  const alreadyViewed = localStorage.getItem('puzzle_13_solved') === 'true'
  if (alreadyViewed) {
    showMessage.value = true
  } else {
    setTimeout(() => {
      showMessage.value = true
      localStorage.setItem('puzzle_13_solved', 'true')
    }, 500)
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-christmas-cream">
    <div class="bg-white rounded-3xl w-full max-w-3xl border-4 border-black" style="box-shadow: 10px 10px 0px 0px rgba(42, 157, 143, 0.3);">
      
      <div v-if="showMessage" class="px-10 pt-10 pb-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-xs uppercase tracking-widest text-gray-400 font-medium">Día 13</span>
          <h1 class="text-3xl font-black text-gray-800 mt-3 leading-tight">
            Para Mi Azurita
          </h1>
          <p class="text-gray-600 font-semibold mt-2">Deysy Viviana Pasito Paez</p>
          <div class="text-5xl mt-4">💕</div>
        </div>

        <!-- Separador -->
        <div class="border-t-2 border-gray-100 mb-8"></div>

        <!-- Mensaje -->
        <div class="space-y-5 text-gray-700 leading-relaxed px-2">
          <p class="text-center text-gray-500 italic text-sm mb-6">
            Un año desde aquel día mágico...
          </p>

          <p>
            Hace exactamente un año, el 13 de diciembre, mi vida cambió para siempre. Ese día, en medio del caos universitario, <span class="font-semibold">te conocí</span>. Y aunque no lo sabía en ese momento, ese encuentro marcaría el inicio de la historia más hermosa que he vivido.
          </p>
          
          <p>
            Recuerdo perfectamente ese día. Irónicamente, fue el mismo día en que saqué 0.2 en ecuaciones 😅. Podría haberme dejado vencer por la frustración, pero el universo tenía otros planes. Porque ese mismo día que parecía tan oscuro, me regaló la luz más brillante: <span class="font-semibold">conocer a Deysy</span>, conocer a mi Azurita.
          </p>

          <p>
            Desde ese primer momento, me enseñaste algo que cambiaría mi perspectiva para siempre: que <span class="font-semibold">las adversidades no definen nuestro camino</span>, sino cómo decidimos enfrentarlas. Me mostraste, con tu ejemplo y tu apoyo, que mis límites estaban mucho más allá de lo que yo creía posible.
          </p>

          <p>
            Tu historia, tu dedicación, tu increíble capacidad de superación... todo eso me <span class="font-semibold">inspiró profundamente</span>. Te admiraba entonces y te admiro aún más ahora. Verte alcanzar tus metas académicas, verte brillar con ese talento único que tienes, me motivó a creer en mí mismo, a confiar en que yo también podía dar más.
          </p>

          <p>
            Me enseñaste que somos <span class="font-semibold">mucho más capaces</span> de lo que creemos. Que en lo académico, en lo profesional, en cada aspecto de nuestras vidas, siempre podemos superar nuestras propias expectativas. Pero sobre todo, me enseñaste algo que no tiene precio: <span class="font-semibold">el valor de compartir la vida con alguien especial</span>.
          </p>

          <p>
            Y esa persona especial, mi compañera, mi inspiración, mi todo... <span class="font-semibold">eres tú</span>.
          </p>

          <p class="text-xl font-bold text-center text-gray-800 mt-8 pt-6 border-t-2 border-gray-100">
            Gracias por ser mi Azurita 💙
          </p>

          <p class="text-center text-gray-600 italic">
            Por ser mi luz en los días oscuros, mi inspiración para ser mejor, mi apoyo incondicional y mi amor más puro.
          </p>

          <p class="text-center text-gray-500 text-sm mt-6">
            Te amo, hoy y siempre ❤️
          </p>
        </div>

        <!-- Separador -->
        <div class="border-t-2 border-gray-100 mt-8"></div>
        
        <!-- Botón -->
        <div class="p-10 text-center">
          <router-link
            to="/"
            class="inline-block px-10 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
            style="background-color: #a8e6cf; border: 3px solid #000;"
          >
            Con todo mi amor ❤️
          </router-link>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else class="p-16 text-center">
        <div class="text-5xl mb-4">💕</div>
        <p class="text-gray-500">Cargando...</p>
      </div>
      
    </div>
  </div>
</template>
