import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Bars from '../views/Bars.vue'
import NewBar from '../views/NewBar.vue'
import MyHistory from '../views/MyHistory.vue'
import Notifications from '../views/Notifications.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/bars',
    name: 'bars',
    component: Bars
  },
  {
    path: '/newBar',
    name: 'newBar',
    component: NewBar
  },
  {
    path: '/myHistory',
    name: 'myHistory',
    component: MyHistory
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: Notifications
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
