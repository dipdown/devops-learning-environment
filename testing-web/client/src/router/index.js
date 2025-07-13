import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/Users.vue')
        },
        {
          path: '/products',
          name: 'products',
          component: () => import('@/views/Products.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('@/views/Orders.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/Profile.vue')
        }
      ]
    },
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue')
        }
      ]
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/Error.vue')
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('@/views/NotFound.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/notfound'
    }
  ]
});

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const publicPages = ['/auth/login', '/auth/register', '/error', '/notfound'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  // Redirect to login if not authenticated
  if (authRequired && !loggedIn) {
    return next('/auth/login');
  }

  // If logged in, redirect from auth pages to dashboard
  if (loggedIn && to.path.startsWith('/auth')) {
    return next('/');
  }

  next();
});

export default router;
