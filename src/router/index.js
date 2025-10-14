import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../pages/Home.vue');
const Poems = () => import('../pages/Poems.vue');
const PoemDetail = () => import('../pages/PoemDetail.vue');
const Profile = () => import('../pages/Profile.vue');

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/poems', name: 'poems', component: Poems },
  { path: '/poems/:id', name: 'poem-detail', component: PoemDetail, props: true },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;