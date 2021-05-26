<template>
  <div class="blacklist">
    <div class="blacklist-head">
      <div class="blacklist-btn">
        <div
          class="blacklist-per"
          :class="{ 'left-btn': idper ? 'left-btn' : '' }"
          @click="isDepClick(true)"
        >
          <img v-if="idper" src="~@/assets/images/hmd-ry.png" alt="">
          <img v-else src="~@/assets/images/hmd-ry-wxz.png" alt="">
          黑名单人员
        </div>
        <div
          class="blacklist-vehicle"
          :class="{ 'right-btn': idper ? '' : 'right-btn' }"
          @click="isDepClick(false)"
        >
          <img v-if="idper" src="~@/assets/images/hmd-ry-wxz.png" alt="">
          <img v-else src="~@/assets/images/hmd-ry.png" alt="">
          车辆黑名单
        </div>
      </div>
      <van-search
        v-model="value"
        :placeholder="idper ? '请输入姓名/身份证' : '请输入车牌号'"
        @search="onSearch"
      />
    </div>
    <template v-if="idper">
      <div class="per">
        <van-pull-refresh v-model="isPerLoading" @refresh="onRefresh">
          <van-list
            v-model="perLoading"
            :finished="perLoading"
            finished-text="没有更多了"
            :offset="offsetPer"
            class="content"
            @load="onLoading"
          >
            <template v-if="perData.length">
              <van-cell
                v-for="(item, index) in perData"
                :key="index"
                class="list-item"
              >
                <div class="vehicle-infor">
                  <div class="vehicle-name">
                    姓名: {{ item.name }}
                  </div>
                  <div class="vehicle-plate">
                    身份证: {{ item.blackValue }}
                  </div>
                  <div class="vehicle-time">
                    {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}
                  </div>
                </div>
                <div class="noot-btns" @click="notClick(item)">
                  移除
                </div>
              </van-cell>
            </template>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="add-btn" @click="AddClick">
        添加
      </div>
    </template>
    <template v-else>
      <div class="vehicle">
        <van-pull-refresh v-model="isLoading" @refresh="onVehicle">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="offset"
            class="content"
            @load="onLoad"
          >
            <template v-if="VehicleData.length">
              <van-cell
                v-for="(item, index) in VehicleData"
                :key="index"
                class="list-item"
              >
                <div class="vehicle-infor">
                  <div class="vehicle-name">
                    姓名: {{ item.name }}
                  </div>
                  <div class="vehicle-plate">
                    车牌号: {{ item.blackValue }}
                  </div>
                  <div class="vehicle-time">
                    {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}
                  </div>
                </div>
                <div class="noot-btns" @click="notClick(item)">
                  移除
                </div>
              </van-cell>
            </template>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="add-btn" @click="AddClick">
        添加
      </div>
    </template>
  </div>
</template>

<script>
import Server from '../../API/common'
import { httpPost } from '../../common/request'
import { Toast } from 'vant'
import des from './des'
import add from './add'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    des,
    // eslint-disable-next-line vue/no-unused-components
    add
  },
  data () {
    return {
      dayjs: '',
      place: '请输入姓名/身份证', // 提示语
      idper: true,
      value: '',
      itemList: {},
      // 车辆
      isLoading: false,
      loading: false,
      finished: false,
      // 人员
      isPerLoading: false,
      perLoading: false,
      perFinished: false,
      offset: 30,
      offsetPer: 30,
      desData: {}, // 详情
      // 黑名单人员
      datas: {
        pageSize: 5,
        page: 1,
        blackValue: '',
        name: '',
        status: '0'
      },
      // 黑名单车辆
      vedatas: {
        pageSize: 5,
        page: 1,
        blackValue: '',
        name: '',
        status: '0'
      },
      perData: [],
      VehicleData: [],
      total: 0,
      totalPer: 0
    }
  },
  async created () {
    await this.getAPPDate()
    await this.sendMsg()
    if (this.$route.query.idper) {
      this.idper = this.$route.query.idper === 'true'
    }
    this.dayjs = require('dayjs')
    setTimeout(() => {
      this.perFunc()
      this.VehicleFunc()
      // this.idper = this.$route.query.idper ? this.$route.query.idper : this.idper
      // this.idper = this.$route.query.idper === this.idper && this.$route.query.idper === 'true'
      // console.log(this.$route.query.idper, this.idper, '-*****-')
      // this.idper = this.$route.query.idper && this.$route.query.idper === 'true' ? true : this.idper
    }, 500)
  },
  methods: {
    getAPPDate () {
      this.$bridge.registerHandler(
        'networkState',
        (datas, responseCallback) => {
          const data = JSON.parse(datas)
          console.log(data, '-----------')
          if (data.sysPassword && data.sysUsername) {
            this.loginss(data.sysUsername, data.sysPassword)
          } else {
            this.flag = true
            this.$toast('获取用户名和密码失败')
            return false
          }
        }
      )
    },
    sendMsg () {
      const msg = '给我来一次111'
      this.$bridge.callHandler('dataTo', msg, (res) => {})
    },
    loginss (sysUsername, sysPassword) {
      const obj = {}
      // obj.username = sysUsername
      // obj.password = sysPassword
      obj.username = 'nacos'
      obj.password = '92d7ddd2a010c59511dc2905b7e14f64'
      Server.login(obj).then((data) => {
        if (data.code === 0) {
          this.flag = false
          // 登录成功
          const user = data.result.user
          console.log(user, '----888---')
          this.$localstore.set('admin_user', user)
          this.$localstore.set('admin_login', true)
          const data1 = {
            platformId: 1
          }
          httpPost(
            'api/user-server/user/getPlatformMenus',
            data1
          ).then((res) => {})
        } else {
          // this.flag = true
          // this.$toast(data.msg)
          // return false
        }
      })
    },
    getList (data) {
      this.perData = []
      this.VehicleData = []
      this.onRefresh()
      this.onVehicle()
      this.idper = data
    },
    /**
     * 添加
     */
    AddClick () {
      this.$router.push({
        path: '/add',
        query: {
          idper: this.idper
        }
      })
    },
    /**
     * 搜索功能
     */
    onSearch () {
      if (this.idper) {
        if (this.value.length === 15 || this.value.length === 18) {
          this.datas.page = 1
          this.datas.pageSize = 5
          this.datas.blackValue = this.value
          this.datas.name = ''
          this.perFunc()
          this.value = ''
        } else {
          this.datas.page = 1
          this.datas.pageSize = 5
          this.datas.blackValue = ''
          this.datas.name = this.value
          this.perFunc()
          this.value = ''
        }
      } else {
        this.vedatas.page = 1
        this.vedatas.pageSize = 5
        this.vedatas.blackValue = this.value
        this.vedatas.name = ''
        this.VehicleFunc()
        this.value = ''
      }
    },
    /**
     *判断是否展现查看页面
     */
    notClick (item) {
      this.$router.push({
        path: '/des',
        query: {
          id: item.id,
          idper: this.idper,
          item
        }
      })
    },
    // 黑名单人员加载
    onLoading () {
      if (this.perData.length >= this.totalPer) {
        this.perFinished = true
        return
      } else {
        this.perFunc()
      }
    },
    // 黑名单车辆加载
    onLoad () {
      if (this.VehicleData.length >= this.total) {
        this.finished = true
        return
      } else {
        this.VehicleFunc()
      }
    },
    // 黑名单人员刷新
    onRefresh () {
      this.datas = {
        pageSize: 5,
        page: 1,
        blackValue: '',
        name: '',
        status: '0'
      }
      this.perData = []
      this.perFunc()
      Toast('刷新成功')
      this.isLoading = false
    },
    // 黑名单车辆刷新
    onVehicle () {
      this.vedatas = {
        pageSize: 5,
        page: 1,
        blackValue: '',
        name: '',
        status: '0'
      }
      this.VehicleData = []
      Toast('刷新成功')
      this.VehicleFunc()
      this.isLoading = false
    },
    // 判断黑名单按钮选中
    isDepClick (bool) {
      this.idper = bool
    },
    // 黑名单人员获取
    perFunc () {
      httpPost('api/shihua-server/blackList/findBlackList', this.datas).then(
        (res) => {
          if (res.code === 0) {
            this.totalPer = res.result.totalCount
            if (this.datas.name || this.datas.blackValue) {
              this.perData = res.result.list
            } else {
              this.perData.push(...res.result.list)
            }
            // 加载状态结束
            this.perLoading = false
            this.isPerLoading = false
            this.datas.page = this.datas.page + 1
          }
        }
      )
    },
    // 黑名单车辆获取
    VehicleFunc () {
      httpPost(
        '/api/shihua-server/blackList/findCarBlackList',
        this.vedatas
      ).then((res) => {
        if (res.code === 0) {
          this.total = res.result.totalCount
          if (this.vedatas.blackValue) {
            this.VehicleData = res.result.list
          } else {
            this.VehicleData.push(...res.result.list)
          }
          // 加载状态结束
          this.loading = false
          this.isLoading = false
          this.vedatas.page = this.vedatas.page + 1
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.blacklist {
  position: fixed;
  width: 100%;
  min-height: 100%;
  background: #f2f2f2;
  width: 100%;
  height: 100%;
  .add-btn {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 30px;
    width: 90%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #3774ec;
    border-radius: 5px;
    color: #fff;
  }
  .blacklist-div {
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 10;
    margin: 0;
    width: 100%;
    height: 11px;
  }
  .per {
    // margin-top: 10px;
    position: relative;
    width: 100%;
    top: 125px;
    // height: 450px;
    height: 65%;

    .van-pull-refresh {
      overflow-y: scroll;
      height: 100%;
      .van-pull-refresh__track {
        height: 450px;
      }
    }
    .van-search {
      .van-search__content {
        background: #f2f2f2;
        border-radius: 20px;
      }
    }
    .content {
      background: #f2f2f2;
      .list-item {
        background: #f2f2f2;
        &.van-cell {
          padding: 5px 11px !important;
          &.van-cell::after {
            border-bottom: 0;
          }
        }
        .van-cell__value {
          display: flex;
          justify-content: space-between;
          box-shadow: 1px 5px 10px #eee;
          padding: 12px;
          border-radius: 5px;
          height: 85px;
          background: #fff;
        }
        .vehicle-infor {
          // .vehicle-name {
          //   margin-top: 10px;
          // }
          .vehicle-plate {
            margin-top: 10px;
          }
          .vehicle-time {
            margin-top: 10px;
          }
        }
        .noot-btns {
          transform: translateY(50%);
          color: #fff;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 50%;
          background: #3774ec;
        }
      }
    }
  }
  .vehicle {
    // margin-top: 10px;
    // margin: 10px 15px;
    height: 65%;
    position: relative;
    top: 125px;
    .van-pull-refresh {
      overflow-y: scroll;
      height: 100%;
      .van-pull-refresh__track {
        height: 450px;
      }
    }
    .content {
      height: 450px;
      background: #f2f2f2;
      .list-item {
        background: #f2f2f2;
        &.van-cell {
          padding: 5px 11px !important;
          &.van-cell::after {
            border-bottom: 0;
          }
        }
        .van-cell__value {
          background: #fff;
          display: flex;
          justify-content: space-between;
          box-shadow: 1px 5px 10px #eee;
          padding: 12px;
          border-radius: 5px;
          height: 85px;
        }
        .vehicle-infor {
          // .vehicle-name {
          //   margin-top: 10px;
          // }
          .vehicle-plate {
            margin-top: 10px;
          }
          .vehicle-time {
            margin-top: 10px;
          }
        }
        .noot-btns {
          transform: translateY(50%);
          color: #fff;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 50%;
          background: #3774ec;
        }
      }
    }
    .vehicle-list {
      display: flex;
      justify-content: space-between;
      box-shadow: 1px 5px 10px #eee;
      margin: 10px;
      padding: 10px;
      border-radius: 5px;
      height: 85px;
    }
  }
  .blacklist-head {
    position: fixed;
    width: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    background: #fff;
    .van-search {
      .van-search__content {
        border-radius: 20px;
        background: #f2f2f2;
      }
    }
    .blacklist-btn {
      display: flex;
      justify-content: space-around;
      margin: 15px auto 10px auto;
      width: 100%;
      height: 40px;
      font-size: 18px;
      line-height: 40px;
      background: #fff;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #4370e5;
      .blacklist-per {
        width: 170px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #4370e5;
        > img {
          width: 16px;
          height: 16px;
        }
      }
      .blacklist-vehicle {
        width: 170px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #4370e5;
        > img {
          width: 16px;
          height: 16px;
        }
      }
      .left-btn {
        background: #3774ec;
        color: #fff;
        // border-radius: 10px;
        // border-top-left-radius: 10px;
        // border-bottom-left-radius: 10px;
      }
      .right-btn {
        background: #3774ec;
        color: #fff;
        // border-top-right-radius: 10px;
        // border-bottom-right-radius: 10px;
      }
    }
  }
}
</style>
