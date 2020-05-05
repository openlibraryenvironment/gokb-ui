import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home-view.vue'

import {
  HOME_ROUTE, PROFILE_ROUTE, TITLE_ROUTE, PACKAGE_ROUTE, PROVIDER_ROUTE, CREATE_PACKAGE_ROUTE, CREATE_TITLE_ROUTE,
  KBART_IMPORT_ROUTE, SEARCH_MAINTENANCE_ROUTE, SEARCH_PACKAGE_ROUTE, SEARCH_REVIEW_ROUTE, SEARCH_TITLE_ROUTE,
  SEARCH_PROVIDER_ROUTE, SEARCH_USER_ROUTE, ADD_USER_ROUTE, EDIT_USER_ROUTE
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
      path: `/${HOME_ROUTE}`,
      name: HOME_ROUTE,
      alias: '/',
      component: Home
    },
    {
      path: `/${PROFILE_ROUTE}`,
      name: PROFILE_ROUTE,
      component: () => import(/* webpackChunkName: "title" */ '../views/profile-view.vue')
    },
    {
      path: `/${TITLE_ROUTE}/:id`,
      props: true,
      name: TITLE_ROUTE,
      component: () => import(/* webpackChunkName: "title" */ '../views/title-view.vue')
    },
    {
      path: `/${PACKAGE_ROUTE}/:id`,
      props: true,
      name: PACKAGE_ROUTE,
      component: () => import(/* webpackChunkName: "package" */ '../views/package-view.vue')
    },
    {
      path: `/${PROVIDER_ROUTE}/:id`,
      props: true,
      name: PROVIDER_ROUTE,
      component: () => import(/* webpackChunkName: "publisher" */ '../views/provider-view.vue')
    },

    {
      path: `/${CREATE_PACKAGE_ROUTE}`,
      name: CREATE_PACKAGE_ROUTE,
      component: () => import(/* webpackChunkName: "createPackage" */ '../views/create/create-package-view.vue')
    },
    {
      path: `/${CREATE_TITLE_ROUTE}`,
      name: CREATE_TITLE_ROUTE,
      component: () => import(/* webpackChunkName: "createTitle" */ '../views/create/create-title-view.vue')
    },
    {
      path: `/${KBART_IMPORT_ROUTE}`,
      name: KBART_IMPORT_ROUTE,
      component: () => import(/* webpackChunkName: "KBARTImport" */ '../views/create/kbart-import-view.vue')
    },

    {
      path: `/${SEARCH_MAINTENANCE_ROUTE}`,
      name: SEARCH_MAINTENANCE_ROUTE,
      component: () => import(/* webpackChunkName: "searchMaintenance" */ '../views/search/search-maintenance-view.vue')
    },
    {
      path: `/${SEARCH_PACKAGE_ROUTE}`,
      name: SEARCH_PACKAGE_ROUTE,
      component: () => import(/* webpackChunkName: "searchPackage" */ '../views/search/search-package-view.vue')
    },
    {
      path: `/${SEARCH_REVIEW_ROUTE}`,
      name: SEARCH_REVIEW_ROUTE,
      component: () => import(/* webpackChunkName: "searchReview" */ '../views/search/search-review-view.vue')
    },
    {
      path: `/${SEARCH_PROVIDER_ROUTE}`,
      name: SEARCH_PROVIDER_ROUTE,
      component: () => import(/* webpackChunkName: "searchProvider" */ '../views/search/search-provider-view.vue')
    },
    {
      path: `/${SEARCH_TITLE_ROUTE}`,
      name: SEARCH_TITLE_ROUTE,
      component: () => import(/* webpackChunkName: "searchTitle" */ '../views/search/search-title-view.vue')
    },
    {
      path: `/${SEARCH_USER_ROUTE}`,
      name: SEARCH_USER_ROUTE,
      component: () => import(/* webpackChunkName: "searchUser" */ '../views/search/search-user-view.vue')
    },
    {
      path: `/${ADD_USER_ROUTE}`,
      name: ADD_USER_ROUTE,
      component: () => import(/* webpackChunkName: "addUser" */ '../views/add/add-user-view.vue')
    },
    {
      path: `/${EDIT_USER_ROUTE}/:id`,
      name: EDIT_USER_ROUTE,
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
