import Vue from 'vue'
import VueRouter from 'vue-router'
import ManagerLogin from '../views/ManagerLogin'
import ViewInvDrug from '../views/ViewInvDrug'
import BuyDrug from '../views/BuyDrug'
import SupplierDrug from '../views/SupplierDrug'
import BuyOrderList from '../views/BuyOrderList'
import SaleOrderList from '../views/SaleOrderList'
import DetailBuyOrder from '../views/DetailBuyOrder'
import DetailSaleOrder from '../views/DetailSaleOrder'
import Drug from '../views/Drug'
import Employees from '../views/Employees'
import EmployeeSale from '../views/EmployeeSale'
import Customers from '../views/Customers'
import CustomerSale from '../views/CustomerSale'
import Manager from '../views/Manager'
import ShowData from '../views/ShowData'
import RegisterEmployee from '../views/RegisterEmployee'

Vue.use(VueRouter)

const routes = [
  {
    path: '/mlogin',
    name: 'ManagerLogin',
    component: ManagerLogin
  },
  {
    path: '/viewInvDrug',
    name: 'ViewInvDrug',
    component: ViewInvDrug
  },
  {
    path: '/buyDrug',
    name: 'BuyDrug',
    component: BuyDrug
  },
  {
    path: '/supplierDrug/:id',
    name: 'SupplierDrug',
    component: SupplierDrug
  },
  {
    path: '/buyOrderList',
    name: 'BuyOrderList',
    component: BuyOrderList
  },
  {
    path: '/saleOrderList',
    name: 'SaleOrderList',
    component: SaleOrderList
  },
  {
    path: '/detailBuyOrder/:id',
    name: 'DetailBuyOrder',
    component: DetailBuyOrder
  },
  {
    path: '/detailSaleOrder/:id',
    name: 'DetailSaleOrder',
    component: DetailSaleOrder
  },
  {
    path: '/drug/:id',
    name: 'Drug',
    component: Drug
  },
  {
    path: '/employees',
    name: 'Employees',
    component: Employees
  },
  {
    path: '/employeeSale/:id',
    name: 'EmployeeSale',
    component: EmployeeSale
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers
  },
  {
    path: '/customerSale/:id',
    name: 'CustomerSale',
    component: CustomerSale
  },
  {
    path: '/manager',
    name: 'Manager',
    component: Manager
  },
  {
    path: '/showData',
    name: 'ShowData',
    component: ShowData
  },
  {
    path: '/registerEmployee',
    name: 'RegisterEmployee',
    component: RegisterEmployee
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
