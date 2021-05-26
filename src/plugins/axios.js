import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import { Encrypt, Decrypt } from '../common/aes'

const baseURL = process.env.VUE_APP_BASE_URL || 'http://218.92.35.155:48888/'

const config = {
  baseURL: baseURL,
  timeout: 1000 * 60 // Timeout
}

const _axios = axios.create(config)

const WhiteUrl = ['/dict/findByParentId', '/estate/getStreetByArea', '/estate/getEstateByStreet']
// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const pending = []
const CancelToken = axios.CancelToken
const removePending = ever => {
  for (const p in pending) {
    // 当当前请求在数组中存在时执行函数体
    if (!WhiteUrl.includes(pending[p].u)) {
      if (pending[p].u === `${ever.url}&${ever.method}`) {
        // 执行取消操作
        pending[p].f()
        // 把这条记录从数组中移除
        pending.splice(p, 1)
      }
    }
  }
}

const encryptWhite = [
  '/api/common-server/file/upload',
  'api/shihua-server/common/upload',
  'api/shihua-server/blackList/export',
  'api/shihua-server/facedDiscern/uploadImage'
]
const decryptWhite = ['api/shihua-server/blackList/export']
const exportWhite = ['api/shihua-server/blackList/export']
// 请求前拦截
_axios.interceptors.request.use(
  function (request) {
    // 判断是否在加密白名单中
    if (request.method === 'post') {
      if (!encryptWhite.includes(request.url)) {
      // 对请求数据进行aes加密
        const params = {}
        params.param = Encrypt(JSON.stringify(request.data))
        request.data = params
      }
    }
    console.log('111', localStorage.getItem('admin_user'))

    // console.log(localStorage,'localStorage')
    // Do something before request is sent
    request.headers['token'] = localStorage.getItem('admin_user')
      ? JSON.parse(localStorage.getItem('admin_user')).token : ''
    console.log('token', request.headers['token'])
    request.headers['platformId'] = 1
    // 在一个ajax发送前执行一下取消操作
    removePending(request)
    request.cancelToken = new CancelToken(c => {
      pending.push({ u: `${request.url}&${request.method}`, f: c })
    })
    return request
  },
  function (error) {
    //  Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // 判断是否是文件导出
    if (exportWhite.includes(response.config.url.replace(baseURL, ''))) {
      return response
    }
    // 判断是否在解密白名单中
    if (!decryptWhite.includes(response.config.url.replace(baseURL, ''))) {
      // 对响应进行aes解密
      response.data = JSON.parse(Decrypt(response.data))
    }
    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    removePending(response.config)
    const { code } = response.data
    if (code === 0) {
      return Promise.resolve(response)
    } else if (code === 20000 || code === 20001 || code === 20002) {
      window.localStorage.removeItem('admin_login')
      // 20000：用户token为空 20001：用户信息为空 20002：登录失效，请重新登录
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      return Promise.reject(response.data.msg)
    } else {
      if (response.data.msg) {
        return Promise.reject(response.data.msg)
      }
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default { Plugin, baseURL }
