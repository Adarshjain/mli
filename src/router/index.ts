import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/customers/new',
    name: 'NewCustomer',
    component: () => import(/* webpackChunkName: "NewCustomer" */ '../views/NewCustomer.vue')
  },
  {
    path: '/customers/:id',
    name: 'TransactionByCustomer',
    component: () => import(/* webpackChunkName: "TransactionByCustomer" */ '../views/TransactionByCustomer.vue')
  },
  {
    path: '/customers/:id/projects',
    name: 'ProjectsByCustomer',
    component: () => import(/* webpackChunkName: "ProjectsByCustomer" */ '../views/ProjectsByCustomer.vue')
  },
  {
    path: '/customers/:id/projects/new',
    name: 'NewProject',
    component: () => import(/* webpackChunkName: "NewProject" */ '../views/NewProject.vue')
  },
  {
    path: '/customers/:id/transaction/new',
    name: 'NewProject',
    component: () => import(/* webpackChunkName: "NewTransactionByCustomer" */ '../views/NewTransactionByCustomer.vue')
  },
  {
    path: '/customers/:id/projects/:projectId',
    name: 'ProjectTransactionByCustomerAndProjectId',
    component: () => import(/* webpackChunkName: "ProjectTransactionByCustomerAndProjectId" */ '../views/ProjectTransactionByCustomerAndProjectId.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
