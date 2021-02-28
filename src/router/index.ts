import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import SignUpView from "@/views/SignUpView.vue";
import ChatView from "@/views/chat/ChatView.vue";
import ChatMessagesView from "@/views/chat/ChatMessagesView.vue";
import ChatImagesView from "@/views/chat/ChatImagesView.vue";
import ChatSettingsView from "@/views/chat/chatSettings/ChatSettingsView.vue";

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
    children: [
      {
        path: '',
        name: 'chat-messages',
        component: ChatMessagesView,
      },
      {
        path: 'images',
        name: 'chat-images',
        component: ChatImagesView,
      },
      {
        path: 'settings',
        name: 'chat-settings',
        component: ChatSettingsView,
      }
    ]
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
