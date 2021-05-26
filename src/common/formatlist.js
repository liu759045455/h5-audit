/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function dealNullChildren (data) {
  function filter (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children && list[i].children.length) {
        filter(list[i].children)
      } else {
        delete list[i].children
      }
    }
  }
  filter(data)
  return data
}
