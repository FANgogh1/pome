import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../pages/Home.vue');
const Poems = () => import('../pages/Poems.vue');
const PoemDetail = () => import('../pages/PoemDetail.vue');
const Profile = () => import('../pages/Profile.vue');
const Login = () => import('../pages/Login.vue');
const Register = () => import('../pages/Register.vue');

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/poems', name: 'poems', component: Poems },
  { path: '/poems/:id', name: 'poem-detail', component: PoemDetail, props: true },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login, meta: { hideNav: true, hideFooter: true } },
  { path: '/register', name: 'register', component: Register, meta: { hideNav: true, hideFooter: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// 简单鉴权守卫
import { useAuthStore } from '../stores/auth';
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.ready) await auth.init();
  if (to.meta?.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
});

export default router;