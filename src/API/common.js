import { httpPost } from '../common/request'
class Services {
  /**
   *登录
   * @param {*} data
   * @returns
   * @memberof Services
   */
  login (data) {
    return httpPost('api/user-server/user/login', data)
  }
  /**
   *登出
   * @returns
   * @memberof Services
   */
  logout (data) {
    return httpPost('api/user-server/user/logout', data)
  }
  /**
   *获取企业信息
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getEnterPrise (data) {
    return httpPost('api/shihua-server/enterPrise/getEnterPriseInfo', data)
  }
}

export default new Services()
