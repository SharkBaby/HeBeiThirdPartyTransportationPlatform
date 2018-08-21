// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
// import VueSocketio from 'vue-socket.io'
// import socketio from 'socket.io-client';
import 'element-ui/lib/theme-chalk/index.css'
// 引入websocket常量
import wshost from '@/config/commonConfig'
// 因为需要实时监听websocket传输过来的数据，故引入vuex进行状态管理
import {store} from '@/vuex/store'
// 引入权限控制的文件
import { hasAccess } from '@/accessmanagement/accessmanagement'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
// Vue.use(VueSocketio, socketio('http://10.50.75.109:1819'));
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
