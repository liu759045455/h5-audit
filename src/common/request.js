import { Notification } from 'element-ui'
import localstore from '../utils/store'
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function httpGet (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        console.warn(err, 'WARN')
        reject(err)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function httpPost (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.__CANCEL__) {
          return
        }
        let title = '错误'
        if (err === '登录失效，请重新登录') {
          err = ''
          title = '登录失效，请重新登录'
        }
        Notification.error({
          title: title,
          message: err
        })
        reject(err)
      })
  })
}

/**
 * post方法，导出对应post
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function exportPost (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, { responseType: 'blob' })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (err.__CANCEL__) {
          return
        }
        let title = '错误'
        if (err === '登录失效，请重新登录') {
          err = ''
          title = '登录失效，请重新登录'
        }
        Notification.error({
          title: title,
          message: err
        })
        reject(err)
      })
  })
}

/**
 * 获取后台响应url
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function getUrl (name) {
  const btnList = localstore.get('btnList') || []
  for (let i = 0; i < btnList.length; i++) {
    if (name === btnList[i].identity) {
      return btnList[i].url
    }
  }
}
