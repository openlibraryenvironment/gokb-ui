import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/HomeView.vue'

import {
  HOME_ROUTE,
} from './route-names'

const COMPONENT_ROUTE_MAPPER = {
  'Package': 'package',
  'Org': 'provider',
}

Vue.use(Router)

const index = new Router({
  routes: [
    {
      path: HOME_ROUTE,
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "title" */ '../views/ProfileView.vue')
    },
    {
      path: '/title/:id',
      props: true,
      name: 'title',
      component: () => import(/* webpackChunkName: "title" */ '../views/TitleView.vue')
    },
    {
      path: '/package/:id',
      props: true,
      name: 'package',
      component: () => import(/* webpackChunkName: "package" */ '../views/PackageView.vue')
    },
    {
      path: '/provider/:id',
      props: true,
      name: 'provider',
      component: () => import(/* webpackChunkName: "publisher" */ '../views/ProviderView.vue')
    },

    {
      path: '/createPackage',
      name: 'createPackage',
      component: () => import(/* webpackChunkName: "createPackage" */ '../views/create/CreatePackageView.vue')
    },
    {
      path: '/createTitle',
      name: 'createTitle',
      component: () => import(/* webpackChunkName: "createTitle" */ '../views/create/CreateTitleView.vue')
    },
    {
      path: '/KBARTImport',
      name: 'KBARTImport',
      component: () => import(/* webpackChunkName: "KBARTImport" */ '../views/create/KBARTImportView.vue')
    },

    {
      path: '/searchMaintenance',
      name: 'searchMaintenance',
      component: () => import(/* webpackChunkName: "searchMaintenance" */ '../views/search/SearchMaintenanceView.vue')
    },
    {
      path: '/searchPackage',
      name: 'searchPackage',
      component: () => import(/* webpackChunkName: "searchPackage" */ '../views/search/SearchPackageView.vue')
    },
    {
      path: '/searchReview',
      name: 'searchReview',
      component: () => import(/* webpackChunkName: "searchReview" */ '../views/search/SearchReviewView.vue')
    },
    {
      path: '/searchTitle',
      name: 'searchTitle',
      component: () => import(/* webpackChunkName: "searchTitle" */ '../views/search/SearchTitleView.vue')
    },
    {
      path: '/searchUser',
      name: 'searchUser',
      component: () => import(/* webpackChunkName: "searchUser" */ '../views/search/SearchUserView.vue')
    },
  ]
})

const routeTo = (name, id) => {
  console.log(`route to ${name} with id ${id}`)
  name = COMPONENT_ROUTE_MAPPER[name]
  index.push({ name, params: { id } })
}

export {
  index,
  routeTo,
}
