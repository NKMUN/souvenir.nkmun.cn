import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Overview from '@/components/Overview'
import ProductDetail from '@/components/ProductDetail'
import OrderDetail from '@/components/OrderDetail'
import PreorderDetail from '@/components/PreorderDetail'
import Add from '@/components/Add'
import Sale from '@/components/Sale'
import Edit from '@/components/Edit'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Overview',
      component: Overview,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/productDetail/:id',
      name: 'productDetail',
      component: ProductDetail,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/orderDetail/:id',
      name: 'orderDetail',
      component: OrderDetail,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/preorderDetail/:id',
      name: 'preorderDetail',
      component: PreorderDetail,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/add',
      name: 'Add',
      component: Add,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/sale',
      name: 'Sale',
      component: Sale,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/edit/:id',
      name: 'Edit',
      component: Edit,
      meta: {
        requireAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (window.sessionStorage.getItem('role')) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export {router as default}
