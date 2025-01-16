import { createRouter, createWebHistory } from 'vue-router';
import UserAuth from '../components/UserAuth.vue';
import FileUpload from '../components/FileUpload.vue';

const routes = [
  { path: '/', component: UserAuth }, // Login or Register page
  { path: '/login', alias: '/', component: UserAuth }, // Alias for login page
  { path: '/upload', component: FileUpload, meta: { requiresAuth: true } }, // File upload page
];


const router = createRouter({
  history: createWebHistory(), // Removing process.env.BASE_URL
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login'); // Redirect to login if trying to access a protected route
  } else {
    next(); // Proceed to the route
  }
});

export default router;
