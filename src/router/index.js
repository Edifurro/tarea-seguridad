import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Formulario from '../views/Formulario.vue'
import Dashboard from '../views/Dashboard.vue'  // Importamos la nueva vista
import { auth } from '../firebase'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/formulario',
    name: 'Formulario',
    component: Formulario,
    meta: { requiresAuth: true }
  },
  // Nueva ruta para el Dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = auth.currentUser

  if (requiresAuth && !user) {
    next('/')
  } else {
    next()
  }
})

export default router