import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import router from './router/router'
import store from './store'
import { loadStyle, downBlobFile } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import './styles/iconfont/iconfont.css'
import basicContainer from './components/basic-container/main'
import VueI18n from 'vue-i18n'
import loadMessages from './lang'
// 添加事件管理者‘passive’，来阻止‘touchstart’事件，解决chrome下的warning问题
import 'default-passive-events'

// 挂载常用的全局方法
Vue.prototype.validatenull = validatenull
Vue.prototype.downBlobFile = downBlobFile

// 全局注入dataV
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: window.localStorage.getItem('mewooo-language') || 'zh',
  fallbackLocale: 'zh',
  messages: loadMessages()
})
// 插件 json 展示
Vue.use(router)

Vue.use(VueAxios, axios)

Vue.use(ElementUI, {
  size: 'mini',
  menuType: 'text',
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(window.AVUE, {
  size: 'mini',
  menuType: 'text'
})

// 注册全局容器
Vue.component('BasicContainer', basicContainer)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

import BaiduMap from 'vue-baidu-map'
import { validatenull } from './util/validate'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'MM5gObNLeHDMfAqgnGIYGmsyiQZPBY0i'
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
