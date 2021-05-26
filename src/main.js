// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
// 兼容ie
import 'babel-polyfill'
import Vuex from 'vuex'
import store from './store'
import './plugins/axios'
import './plugins/element'
import Moment from 'moment'
import 'element-ui/lib/theme-chalk/reset.css'
// 全局样式引入
import './assets/style/global.less'
// 全局组件引入
import './components/global'
import 'default-passive-events'
// 地址联动引入
import { pcaa } from 'area-data-vue'
import VueAreaLinkage from 'area-linkage-vue'
// 引入font-awesome
import 'font-awesome/css/font-awesome.css'
// localstore
import localstore from './utils/store'
// 引入图标
import iconPocker from 'vue-fontawesome-elementui-icon-picker'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
Vue.use(iconPocker)
Vue.use(Vant)
import basePath from '@/config/basePath'
import Bridge from '@/common/bridge.js'

import Vconsole from 'vconsole'
Vue.prototype.$vConsole = new Vconsole()

Vue.prototype.$bridge = Bridge
Vue.prototype.$basePath = basePath
Vue.prototype.$pcaa = pcaa
Vue.prototype.$localstore = localstore

// 改变table header的背景色
Vue.prototype.$tableHeaderColor = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0) {
    return 'background-color: #f3f8ff; height: 52px; color: #333; font-weight: bolder; font-size: 14px;'
  }
}

Vue.use(Vuex)
Vue.use(VueAreaLinkage)

// 全局时间转换字符串 YYYY-MM-DD HH:mm:ss
Vue.filter('formatDateToStr', function (val) {
  if (val === undefined) {
    return ''
  }
  const date = new Date(val)
  return Moment(date).format('YYYY-MM-DD HH:mm:ss')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
