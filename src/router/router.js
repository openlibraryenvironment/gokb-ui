import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home-view.vue'

import { HOME_ROUTE, PROFILE_ROUTE, TITLE_ROUTE, PACKAGE_ROUTE, PROVIDER_ROUTE, CREATE_PACKAGE_ROUTE, CREATE_TITLE_ROUTE,
  KBART_IMPORT_ROUTE, SEARCH_MAINTENANCE_ROUTE, SEARCH_PACKAGE_ROUTE, SEARCH_REVIEW_ROUTE, SEARCH_TITLE_ROUTE, SEARCH_PROVIDER_ROUTE,
  SEARCH_USER_ROUTE, ADD_USER_ROUTE
} from './route-names'

const COMPONENT_ROUTE_MAPPER = {
  Package: 'package',
  Org: 'provider',
  BookInstance: 'title',
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
      path: PROFILE_ROUTE,
      name: 'profile',
      component: () => import(/* webpackChunkName: "title" */ '../views/profile-view.vue')
    },
    {
      path: `${TITLE_ROUTE}/:id`,
      props: true,
      name: 'title',
      component: () => import(/* webpackChunkName: "title" */ '../views/title-view.vue')
    },
    {
      path: `${PACKAGE_ROUTE}/:id`,
      props: true,
      name: 'package',
      component: () => import(/* webpackChunkName: "package" */ '../views/package-view.vue')
    },
    {
      path: `${PROVIDER_ROUTE}/:id`,
      props: true,
      name: 'provider',
      component: () => import(/* webpackChunkName: "publisher" */ '../views/provider-view.vue')
    },

    {
      path: CREATE_PACKAGE_ROUTE,
      name: 'create-package',
      component: () => import(/* webpackChunkName: "createPackage" */ '../views/create/create-package-view.vue')
    },
    {
      path: CREATE_TITLE_ROUTE,
      name: 'create-title',
      component: () => import(/* webpackChunkName: "createTitle" */ '../views/create/create-title-view.vue')
    },
    {
      path: KBART_IMPORT_ROUTE,
      name: 'kbart-import',
      component: () => import(/* webpackChunkName: "KBARTImport" */ '../views/create/kbart-import-view.vue')
    },

    {
      path: SEARCH_MAINTENANCE_ROUTE,
      name: 'search-maintenance',
      component: () => import(/* webpackChunkName: "searchMaintenance" */ '../views/search/search-maintenance-view.vue')
    },
    {
      path: SEARCH_PACKAGE_ROUTE,
      name: 'search-package',
      component: () => import(/* webpackChunkName: "searchPackage" */ '../views/search/search-package-view.vue')
    },
    {
      path: SEARCH_REVIEW_ROUTE,
      name: 'search-review',
      component: () => import(/* webpackChunkName: "searchReview" */ '../views/search/search-review-view.vue')
    },
    {
      path: SEARCH_PROVIDER_ROUTE,
      name: 'search-provider',
      component: () => import(/* webpackChunkName: "searchProvider" */ '../views/search/search-provider-view.vue')
    },
    {
      path: SEARCH_TITLE_ROUTE,
      name: 'search-title',
      component: () => import(/* webpackChunkName: "searchTitle" */ '../views/search/search-title-view.vue')
    },
    {
      path: SEARCH_USER_ROUTE,
      name: 'search-user',
      component: () => import(/* webpackChunkName: "searchUser" */ '../views/search/search-user-view.vue')
    },
    {
      path: ADD_USER_ROUTE,
      name: 'add-user',
      component: () => import(/* webpackChunkName: "addUser" */ '../views/add/add-user-view.vue')
    },
  ]
})

const routeTo = (name, id) => {
  name = COMPONENT_ROUTE_MAPPER[name] || name
  console.log(`route to ${name} with id ${id}`)
  router.push({ name, params: { id } })
}

export {
  router,
  routeTo,
}
