import { serialize } from '@/util/util'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from '@/router/router'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store' // progress bar style
import { getStore } from '@/util/store'
axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const TENANT_ID = getStore({ name: 'tenantId' })
  const isToken = (config.headers || {}).isToken === false
  const token = store.getters.access_token
  // 请求渠道 运营平台专用
  config.headers['Client'] = 'WEB'
  config.headers['Platform'] = 'operation'
  config.headers['VERSION'] = '1.0-SNAPSHOT'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  config.headers['timeZone'] = timezone
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }

  if (typeof TENANT_ID === 'number' && !isNaN(TENANT_ID)) {
    config.headers['TENANT-ID'] = TENANT_ID // 租户ID
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }

  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      if (params.email) {
        return qs.stringify(params, { arrayFormat: 'repeat', encode: false })
      }
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401 || status === 403) {
    Message({
      message: message,
      type: 'error'
    })
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }
  // console.log(res)
  if (status !== 200 || res.data.code === 1) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }
  if (res.data && res.data.code && res.data.code !== 200) {

    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
