import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

// css引入
import './common/style/icon.css'
import './common/style/base.css'


Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
]

const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
})

var eventHub = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router
})

router.push('/goods')
