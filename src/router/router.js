import {
  HOME_ROUTE, PROFILE_ROUTE, TITLE_ROUTE, PACKAGE_ROUTE, PROVIDER_ROUTE, CREATE_PACKAGE_ROUTE, CREATE_TITLE_ROUTE,
  KBART_IMPORT_ROUTE, SEARCH_MAINTENANCE_ROUTE, SEARCH_PACKAGE_ROUTE, SEARCH_REVIEW_ROUTE, SEARCH_TITLE_ROUTE,
  SEARCH_PROVIDER_ROUTE, SEARCH_USER_ROUTE, ADD_USER_ROUTE, EDIT_USER_ROUTE, ERROR_ROUTE, EDIT_PACKAGE_ROUTE,
  EDIT_PROVIDER_ROUTE, ADD_PROVIDER_ROUTE
} from './route-paths'

const api = (log, errorModel, accountModel, Router, HomeView) => {
  const router = new Router({
    // mode: 'history', https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
    routes: [
      {
        path: HOME_ROUTE,
        name: HOME_ROUTE,
        alias: '/',
        component: HomeView
      },
      {
        path: ERROR_ROUTE,
        component: () => import('@/views/error-view.vue'),
      },
      {
        path: PROFILE_ROUTE,
        name: PROFILE_ROUTE,
        component: () => import('@/views/profile-view.vue')
      },
      {
        path: `${TITLE_ROUTE}/:id`,
        name: TITLE_ROUTE,
        component: () => import('@/views/title-view.vue')
      },
      {
        path: `${PACKAGE_ROUTE}/:id`,
        name: PACKAGE_ROUTE,
        component: () => import('@/views/package-view.vue')
      },
      {
        path: `${PROVIDER_ROUTE}/:id`,
        name: PROVIDER_ROUTE,
        component: () => import('@/views/provider-view.vue')
      },
      {
        path: CREATE_PACKAGE_ROUTE,
        name: CREATE_PACKAGE_ROUTE,
        component: () => import('@/views/create/create-package-view.vue')
      },
      {
        path: CREATE_TITLE_ROUTE,
        name: KBART_IMPORT_ROUTE,
        component: () => import('@/views/create/create-title-view.vue')
      },
      {
        path: KBART_IMPORT_ROUTE,
        component: () => import('@/views/create/kbart-import-view.vue')
      },

      {
        path: SEARCH_MAINTENANCE_ROUTE,
        name: SEARCH_MAINTENANCE_ROUTE,
        component: () => import('@/views/search/search-maintenance-view.vue')
      },
      {
        path: SEARCH_PACKAGE_ROUTE,
        name: SEARCH_PACKAGE_ROUTE,
        component: () => import('@/views/search/search-package-view.vue')
      },
      {
        path: `${EDIT_PACKAGE_ROUTE}/:id`,
        name: EDIT_PACKAGE_ROUTE,
        props: true,
        component: () => import('@/views/edit/edit-package-view.vue')
      },
      {
        path: SEARCH_REVIEW_ROUTE,
        name: SEARCH_REVIEW_ROUTE,
        component: () => import('@/views/search/search-review-view.vue')
      },

      {
        path: SEARCH_PROVIDER_ROUTE,
        name: SEARCH_TITLE_ROUTE,
        component: () => import('@/views/search/search-provider-view.vue')
      },
      {
        path: ADD_PROVIDER_ROUTE,
        name: ADD_PROVIDER_ROUTE,
        component: () => import('@/views/edit/edit-provider-view.vue')
      },
      {
        path: `${EDIT_PROVIDER_ROUTE}/:id`,
        name: EDIT_PROVIDER_ROUTE,
        props: true,
        component: () => import('@/views/edit/edit-provider-view.vue')
      },

      {
        path: SEARCH_TITLE_ROUTE,
        component: () => import('@/views/search/search-title-view.vue')
      },

      {
        path: SEARCH_USER_ROUTE,
        name: SEARCH_USER_ROUTE,
        component: () => import('@/views/search/search-user-view.vue')
      },
      {
        path: ADD_USER_ROUTE,
        name: ADD_USER_ROUTE,
        component: () => import('@/views/edit/edit-user-view.vue')
      },
      {
        path: `${EDIT_USER_ROUTE}/:id`,
        name: EDIT_USER_ROUTE,
        props: true,
        component: () => import('@/views/edit/edit-user-view.vue')
      },
      {
        path: '*',
        component: () => import('@/views/not-found-view.vue')
      }
    ]
  })

  router.beforeEach(async ({ path: toPath }, { path: fromPath }, next) => {
    log.debug(`navigation from ${fromPath} to path ${toPath}`)
    if (toPath !== ERROR_ROUTE) {
      if (!accountModel.isInitialized()) {
        try {
          await accountModel.initialize()
        } catch (exception) {
          errorModel.set(exception)
          next(ERROR_ROUTE)
        }
      }
    }
    next()
  })

  return router
}

export default api
