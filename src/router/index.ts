import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from "@/views/SignUpView.vue";
import ChatView from "@/views/ChatView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/sign-up',
    name: 'Sign up',
    component: SignUpView,
  },
  {
    path: '/chat/:uid',
    name: 'Chat',
    component: ChatView,
    props: true,
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
