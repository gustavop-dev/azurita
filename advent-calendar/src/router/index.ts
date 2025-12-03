import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'countdown',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/puzzle/1',
      name: 'puzzle-1',
      component: () => import('../views/puzzles/puzzle_1.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-01') },
    },
    {
      path: '/puzzle/2',
      name: 'puzzle-2',
      component: () => import('../views/puzzles/puzzle_2.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-02') },
    },
    {
      path: '/puzzle/3',
      name: 'puzzle-3',
      component: () => import('../views/puzzles/puzzle_3.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-03') },
    },
    {
      path: '/puzzle/4',
      name: 'puzzle-4',
      component: () => import('../views/puzzles/puzzle_4.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-04') },
    },
    {
      path: '/puzzle/5',
      name: 'puzzle-5',
      component: () => import('../views/puzzles/puzzle_5.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-05') },
    },
    {
      path: '/puzzle/6',
      name: 'puzzle-6',
      component: () => import('../views/puzzles/puzzle_6.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-06') },
    },
    {
      path: '/puzzle/7',
      name: 'puzzle-7',
      component: () => import('../views/puzzles/puzzle_7.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-07') },
    },
    {
      path: '/puzzle/8',
      name: 'puzzle-8',
      component: () => import('../views/puzzles/puzzle_8.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-08') },
    },
    {
      path: '/puzzle/9',
      name: 'puzzle-9',
      component: () => import('../views/puzzles/puzzle_9.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-09') },
    },
    {
      path: '/puzzle/10',
      name: 'puzzle-10',
      component: () => import('../views/puzzles/puzzle_10.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-10') },
    },
    {
      path: '/puzzle/11',
      name: 'puzzle-11',
      component: () => import('../views/puzzles/puzzle_11.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-11') },
    },
    {
      path: '/puzzle/12',
      name: 'puzzle-12',
      component: () => import('../views/puzzles/puzzle_12.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-12') },
    },
    {
      path: '/puzzle/13',
      name: 'puzzle-13',
      component: () => import('../views/puzzles/puzzle_13.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-13') },
    },
  ],
})

// Función para verificar si un puzzle está resuelto
const isPuzzleSolved = (puzzleNumber: number) => {
  return localStorage.getItem(`puzzle_${puzzleNumber}_solved`) === 'true'
}

// Función para verificar si un puzzle está desbloqueado
const isPuzzleUnlocked = (puzzleNumber: number, unlockDate: Date) => {
  const now = new Date()
  const unlockDay = new Date(unlockDate.getFullYear(), unlockDate.getMonth(), unlockDate.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateReached = today >= unlockDay
  
  // El puzzle 1 solo necesita que la fecha haya llegado
  if (puzzleNumber === 1) {
    return dateReached
  }
  
  // Los demás puzzles necesitan que la fecha haya llegado Y que el anterior esté resuelto
  const previousSolved = isPuzzleSolved(puzzleNumber - 1)
  return dateReached && previousSolved
}

// Navigation guard para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true'
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // Redirigir si ya está autenticado e intenta ir al login
  if (to.path === '/login' && isAuthenticated) {
    next('/')
    return
  }
  
  // Verificar si el puzzle está desbloqueado por fecha y progresión
  if (to.meta.unlockDate && to.name) {
    const unlockDate = to.meta.unlockDate as Date
    const puzzleNumber = parseInt(to.name.toString().split('-')[1])
    
    if (!isPuzzleUnlocked(puzzleNumber, unlockDate)) {
      // Redirigir al home si intenta acceder a un puzzle bloqueado
      next('/')
      return
    }
  }
  
  next()
})

export default router
