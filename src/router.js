import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

const COMPONENT_ROUTE_MAPPER = {
  'Package': 'package',
  'Org': 'provider',
}

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "title" */ './views/ProfileComponent.vue')
    },
    {
      path: '/title/:id',
      props: true,
      name: 'title',
      component: () => import(/* webpackChunkName: "title" */ './views/TitleComponent.vue')
    },
    {
      path: '/package/:id',
      props: true,
      name: 'package',
      component: () => import(/* webpackChunkName: "package" */ './views/PackageComponent.vue')
    },
    {
      path: '/provider/:id',
      props: true,
      name: 'provider',
      component: () => import(/* webpackChunkName: "publisher" */ './views/ProviderComponent.vue')
    },

    {
      path: '/createPackage',
      name: 'createPackage',
      component: () => import(/* webpackChunkName: "createPackage" */ './views/create/CreatePackage.vue')
    },
    {
      path: '/createTitle',
      name: 'createTitle',
      component: () => import(/* webpackChunkName: "createTitle" */ './views/create/CreateTitle.vue')
    },
    {
      path: '/KBARTImport',
      name: 'KBARTImport',
      component: () => import(/* webpackChunkName: "KBARTImport" */ './views/create/KBARTImport.vue')
    },

    {
      path: '/searchMaintenance',
      name: 'searchMaintenance',
      component: () => import(/* webpackChunkName: "searchMaintenance" */ './views/search/SearchMaintenance.vue')
    },
    {
      path: '/searchPackage',
      name: 'searchPackage',
      component: () => import(/* webpackChunkName: "searchPackage" */ './views/search/SearchPackage.vue')
    },
    {
      path: '/searchReview',
      name: 'searchReview',
      component: () => import(/* webpackChunkName: "searchReview" */ './views/search/SearchReview.vue')
    },
    {
      path: '/searchTitle',
      name: 'searchTitle',
      component: () => import(/* webpackChunkName: "searchTitle" */ './views/search/SearchTitle.vue')
    },
    {
      path: '/searchUser',
      name: 'searchUser',
      component: () => import(/* webpackChunkName: "searchUser" */ './views/search/SearchUser.vue')
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
