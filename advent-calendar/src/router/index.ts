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
    {
      path: '/puzzle/14',
      name: 'puzzle-14',
      component: () => import('../views/puzzles/puzzle_14.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-14') },
    },
    {
      path: '/puzzle/15',
      name: 'puzzle-15',
      component: () => import('../views/puzzles/puzzle_15.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-15') },
    },
    {
      path: '/puzzle/16',
      name: 'puzzle-16',
      component: () => import('../views/puzzles/puzzle_16.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-16') },
    },
    {
      path: '/puzzle/17',
      name: 'puzzle-17',
      component: () => import('../views/puzzles/puzzle_17.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-17') },
    },
    {
      path: '/puzzle/18',
      name: 'puzzle-18',
      component: () => import('../views/puzzles/puzzle_18.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-18') },
    },
    {
      path: '/puzzle/19',
      name: 'puzzle-19',
      component: () => import('../views/puzzles/puzzle_19.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-19') },
    },
    {
      path: '/puzzle/20',
      name: 'puzzle-20',
      component: () => import('../views/puzzles/puzzle_20.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-20') },
    },
    {
      path: '/puzzle/21',
      name: 'puzzle-21',
      component: () => import('../views/puzzles/puzzle_21.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-21') },
    },
    {
      path: '/puzzle/22',
      name: 'puzzle-22',
      component: () => import('../views/puzzles/puzzle_22.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-22') },
    },
    {
      path: '/puzzle/23',
      name: 'puzzle-23',
      component: () => import('../views/puzzles/puzzle_23.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-23') },
    },
    {
      path: '/puzzle/24',
      name: 'puzzle-24',
      component: () => import('../views/puzzles/puzzle_24.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-24') },
    },
    {
      path: '/puzzle/25',
      name: 'puzzle-25',
      component: () => import('../views/puzzles/puzzle_25.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-25') },
    },
    {
      path: '/puzzle/26',
      name: 'puzzle-26',
      component: () => import('../views/puzzles/puzzle_26.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-26') },
    },
    {
      path: '/puzzle/27',
      name: 'puzzle-27',
      component: () => import('../views/puzzles/puzzle_27.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-27') },
    },
    {
      path: '/puzzle/28',
      name: 'puzzle-28',
      component: () => import('../views/puzzles/puzzle_28.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-28') },
    },
    {
      path: '/puzzle/29',
      name: 'puzzle-29',
      component: () => import('../views/puzzles/puzzle_29.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-29') },
    },
    {
      path: '/puzzle/30',
      name: 'puzzle-30',
      component: () => import('../views/puzzles/puzzle_30.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-30') },
    },
    {
      path: '/puzzle/31',
      name: 'puzzle-31',
      component: () => import('../views/puzzles/puzzle_31.vue'),
      meta: { requiresAuth: true, unlockDate: new Date('2025-12-31') },
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
    const routeName = to.name.toString()
    const puzzlePart = routeName.split('-')[1]
    
    if (puzzlePart) {
      const puzzleNumber = parseInt(puzzlePart)
      
      if (!isPuzzleUnlocked(puzzleNumber, unlockDate)) {
        // Redirigir al home si intenta acceder a un puzzle bloqueado
        next('/')
        return
      }
    }
  }
  
  next()
})

export default router
