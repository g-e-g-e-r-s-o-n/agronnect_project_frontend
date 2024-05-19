import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/todos',
    name: 'Todos',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../components/Todos.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/todo/:id',
    name: 'Todo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../components/Todo.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/Register.vue')
  },
  {
    path: '/404',
    name: 'Not Found',
    component: () => import( '../components/errors/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  const token = window.$cookies.get('token');
  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      next('/login');
      localStorage.setItem('next-url', to.path)
    }
  }
  else {
    if (to.name === 'Login' && token === undefined)
    {
      next('/login')
    }
    else if (to.name === 'Register' && token === undefined)
    {
      next('/register')
    }
    else if(to.name === 'Login' && token)
    {
      next('/')
    }
    else if(to.name === 'Register' && token)
    {
      next('/')
    }
    else {
      next()
    }
  }

});

export default router
