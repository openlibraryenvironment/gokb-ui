import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home-view.vue'

import { HOME_ROUTE } from './route-names'

const COMPONENT_ROUTE_MAPPER = {
  'Package': 'package',
  'Org': 'provider',
}

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: HOME_ROUTE,
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "title" */ '../views/profile-view.vue')
    },
    {
      path: '/title/:id',
      props: true,
      name: 'title',
      component: () => import(/* webpackChunkName: "title" */ '../views/title-view.vue')
    },
    {
      path: '/package/:id',
      props: true,
      name: 'package',
      component: () => import(/* webpackChunkName: "package" */ '../views/package-view.vue')
    },
    {
      path: '/provider/:id',
      props: true,
      name: 'provider',
      component: () => import(/* webpackChunkName: "publisher" */ '../views/provider-view.vue')
    },

    {
      path: '/createPackage',
      name: 'createPackage',
      component: () => import(/* webpackChunkName: "createPackage" */ '../views/create/create-package-view.vue')
    },
    {
      path: '/createTitle',
      name: 'createTitle',
      component: () => import(/* webpackChunkName: "createTitle" */ '../views/create/create-title-view.vue')
    },
    {
      path: '/KBARTImport',
      name: 'KBARTImport',
      component: () => import(/* webpackChunkName: "KBARTImport" */ '../views/create/kbart-import-view.vue')
    },

    {
      path: '/searchMaintenance',
      name: 'searchMaintenance',
      component: () => import(/* webpackChunkName: "searchMaintenance" */ '../views/search/search-maintenance-view.vue')
    },
    {
      path: '/searchPackage',
      name: 'searchPackage',
      component: () => import(/* webpackChunkName: "searchPackage" */ '../views/search/search-package-view.vue')
    },
    {
      path: '/searchReview',
      name: 'searchReview',
      component: () => import(/* webpackChunkName: "searchReview" */ '../views/search/search-review-view.vue')
    },
    {
      path: '/searchTitle',
      name: 'searchTitle',
      component: () => import(/* webpackChunkName: "searchTitle" */ '../views/search/search-title-view.vue')
    },
    {
      path: '/searchUser',
      name: 'searchUser',
      component: () => import(/* webpackChunkName: "searchUser" */ '../views/search/search-user-view.vue')
    },
  ]
})

const routeTo = (name, id) => {
  console.log(`route to ${name} with id ${id}`)
  name = COMPONENT_ROUTE_MAPPER[name]
  router.push({ name, params: { id } })
}

export {
  router,
  routeTo,
}
