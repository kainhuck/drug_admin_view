import Vue from 'vue'
import VueRouter from 'vue-router'
import CustomerLogin from '../views/CustomerLogin'
import Shopmall from '../views/Shopmall'
import Saleorder from '../views/Saleorder'
import Register from '../views/Register'
import Drug from '../views/Drug'
import DetailSaleOrder from '../views/DetailSaleOrder'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'CustomerLogin',
    component: CustomerLogin
  },
  {
    path: '/shopmall',
    name: 'Shopmall',
    component: Shopmall
  },
  {
    path: '/saleorder',
    name: 'Saleorder',
    component: Saleorder
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/drug/:id',
    name: 'Drug',
    component: Drug
  },
  {
    path: '/detailSaleOrder/:id',
    name: 'DetailSaleOrder',
    component: DetailSaleOrder
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
