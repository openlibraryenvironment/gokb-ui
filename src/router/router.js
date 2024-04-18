import {
  HOME_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE, CREATE_PACKAGE_ROUTE, CREATE_TITLE_ROUTE,
  SEARCH_MAINTENANCE_ROUTE, SEARCH_PACKAGE_ROUTE, SEARCH_REVIEW_ROUTE, SEARCH_TITLE_ROUTE,
  SEARCH_PROVIDER_ROUTE, SEARCH_USER_ROUTE, ADD_USER_ROUTE, EDIT_USER_ROUTE, ERROR_ROUTE, EDIT_PACKAGE_ROUTE,
  EDIT_PROVIDER_ROUTE, ADD_PROVIDER_ROUTE, EDIT_TITLE_ROUTE, NO_ACCESS_ROUTE, EDIT_TIPP_ROUTE, EDIT_REVIEW_ROUTE, VALIDATOR_ROUTE
} from './route-paths'

const api = (log, errorModel, accountModel, createRouter, HomeView, loading, createWebHistory) => {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: HOME_ROUTE,
        name: HOME_ROUTE,
        meta: {
          code: 'route.home'
        },
        alias: '/',
        component: HomeView
      },
      {
        path: ERROR_ROUTE,
        meta: {
          code: 'route.error'
        },
        component: () => import('@/views/error-view.vue'),
      },
      {
        path: PROFILE_ROUTE,
        name: PROFILE_ROUTE,
        meta: {
          code: 'route.profile'
        },
        component: () => import('@/views/profile-view.vue')
      },
      {
        path: REGISTER_ROUTE,
        name: REGISTER_ROUTE,
        meta: {
          code: 'route.register'
        },
        component: () => import('@/views/register-view.vue')
      },
      {
        path: CREATE_PACKAGE_ROUTE,
        name: CREATE_PACKAGE_ROUTE,
        meta: {
          code: 'route.package.create'
        },
        component: () => import('@/views/edit/edit-package-view.vue')
      },
      {
        path: CREATE_TITLE_ROUTE,
        name: CREATE_TITLE_ROUTE,
        meta: {
          code: 'route.title.create'
        },
        component: () => import('@/views/edit/edit-title-view.vue')
      },
      {
        path: SEARCH_MAINTENANCE_ROUTE,
        name: SEARCH_MAINTENANCE_ROUTE,
        meta: {
          code: 'route.maintenance.search'
        },
        component: () => import('@/views/search/search-maintenance-view.vue')
      },
      {
        path: SEARCH_PACKAGE_ROUTE,
        name: SEARCH_PACKAGE_ROUTE,
        meta: {
          code: 'route.package.search'
        },
        component: () => import('@/views/search/search-package-view.vue')
      },
      {
        path: `${EDIT_PACKAGE_ROUTE}/:id`,
        name: EDIT_PACKAGE_ROUTE,
        meta: {
          code: 'route.package.edit'
        },
        props: true,
        component: () => import('@/views/edit/edit-package-view.vue')
      },
      {
        path: SEARCH_REVIEW_ROUTE,
        name: SEARCH_REVIEW_ROUTE,
        meta: {
          code: 'route.review.search'
        },
        component: () => import('@/views/search/search-review-view.vue')
      },

      {
        path: SEARCH_PROVIDER_ROUTE,
        name: SEARCH_PROVIDER_ROUTE,
        meta: {
          code: 'route.provider.search'
        },
        component: () => import('@/views/search/search-provider-view.vue')
      },
      {
        path: ADD_PROVIDER_ROUTE,
        name: ADD_PROVIDER_ROUTE,
        meta: {
          code: 'route.provider.create'
        },
        component: () => import('@/views/edit/edit-provider-view.vue')
      },
      {
        path: `${EDIT_PROVIDER_ROUTE}/:id`,
        name: EDIT_PROVIDER_ROUTE,
        meta: {
          code: 'route.provider.edit'
        },
        props: true,
        component: () => import('@/views/edit/edit-provider-view.vue')
      },

      {
        path: SEARCH_TITLE_ROUTE,
        meta: {
          code: 'route.title.search'
        },
        component: () => import('@/views/search/search-title-view.vue')
      },
      {
        path: `${EDIT_TITLE_ROUTE}/:id`,
        name: EDIT_TITLE_ROUTE,
        meta: {
          code: 'route.title.edit'
        },
        props: true,
        component: () => import('@/views/edit/edit-title-view.vue')
      },
      {
        path: `${EDIT_TIPP_ROUTE}/:id`,
        name: EDIT_TIPP_ROUTE,
        meta: {
          code: 'route.tipp.edit'
        },
        props: true,
        component: () => import('@/views/edit/edit-tipp-view.vue')
      },
      {
        path: `${EDIT_REVIEW_ROUTE}/:id`,
        name: EDIT_REVIEW_ROUTE,
        meta: {
          code: 'route.review.edit'
        },
        props: true,
        component: () => import('@/views/edit/edit-review-view.vue')
      },
      {
        path: SEARCH_USER_ROUTE,
        name: SEARCH_USER_ROUTE,
        meta: {
          code: 'route.user.search'
        },
        component: () => import('@/views/search/search-user-view.vue')
      },
      {
        path: ADD_USER_ROUTE,
        name: ADD_USER_ROUTE,
        meta: {
          code: 'route.user.create'
        },
        component: () => import('@/views/edit/edit-user-view.vue')
      },
      {
        path: `${EDIT_USER_ROUTE}/:id`,
        name: EDIT_USER_ROUTE,
        meta: {
          code: 'route.user.edit'
        },
        props: true,
        component: () => import('@/views/edit/edit-user-view.vue')
      },
      {
        path: NO_ACCESS_ROUTE,
        meta: {
          code: 'route.noaccess'
        },
        component: () => import('@/views/no-access-view.vue')
      },
      {
        path: VALIDATOR_ROUTE,
        name: VALIDATOR_ROUTE,
        meta: {
          code: 'route.kbartValidator'
        },
        component: () => import('@/views/kbart-validator-view.vue')
      }
    ]
  })

  router.beforeEach(async ({ path: toPath }, { path: fromPath }, next) => {
    loading.startLoading()
    log.debug(`navigation from ${fromPath} to path ${toPath}`)
    if (toPath !== ERROR_ROUTE) {
      if (!accountModel.isInitialized()) {
        try {
          await accountModel.initialize()
        } catch (exception) {
          console.log(exception)
        }
      }
    }
    next()
    loading.stopLoading()
  })

  return router
}

export default api
