<template>
  <div class="vant_father">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad"
      >
        <div class="center">
          <div
            v-for="(item,index) in dataList" :key="index" class="center_data"
            @click="routerClick(item)"
          >
            <div style="border-bottom:1px solid #E5E5E5;margin-bottom:0.8rem;padding-bottom:0.5rem;color:#4370E5">
              <span style="margin-right:0.5rem">车牌号：</span>
              <span>{{ item.carNumber }}</span>
            </div>
            <div class="conter_father">
              <div class="center-left">
                <div class="aa-left-item">
                  <div class="aa-left-label">驾驶员：</div>
                  <div class="aa-left-con">{{ item.name }}</div>
                </div>
                <!-- end item -->

                <div class="aa-left-item">
                  <div class="aa-left-label">访问企业：</div>
                  <div class="aa-left-con">{{ item.enterprise }}</div>
                </div>
                <!-- end item -->

                <div class="aa-left-item">
                  <div class="aa-left-label">访问时间：</div>
                  <div class="aa-left-con">{{ item.createTime | dateFormat }}</div>
                </div>
                <!-- end item -->
              </div>
              <!-- end left -->
              <div class="center-right">
                <a :href="'tel:' + item.phone" @click.stop="stopRouter()">
                  <img src="../../../static/images/shenhezhong_phone.png" alt="">
                </a>
                <div style="color:#4370E5;">
                  审核中
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { httpPost } from '../../common/request'
export default {
  filters: {
    dateFormat: function (dataStr) {
      var time = new Date(dataStr)
      function timeAdd0 (str) {
        if (str < 10) {
          str = '0' + str
        }
        return str
      }
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return (
        y +
        '-' +
        timeAdd0(m) +
        '-' +
        timeAdd0(d) +
        ' ' +
        timeAdd0(h) +
        ':' +
        timeAdd0(mm) +
        ':' +
        timeAdd0(s)
      )
    }
  },
  data () {
    return {
      dataList: [],
      loading: false,
      finished: false,
      refreshing: false,
      // active: 1,
      pageNum: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      lastRefreshTime: null
    }
  },
  created () {
    this.getlist1()
  },
  methods: {
    getlist1 () {
      if (this.refreshing) {
        this.dataList = []
        this.refreshing = false
        this.pageNum.page = 1
      }
      if (this.pageNum.page === 1) {
        const time = Date.now()
        this.lastRefreshTime = time
      }
      const data = {
        page: this.pageNum.page,
        pageSize: this.pageNum.pageSize,
        lastRefreshTime: this.lastRefreshTime,
        property: 1
      }
      httpPost('api/shihua-server/car/findCarAuditingList', data).then((res) => {
        if (res.code === 0) {
          // 加载状态结束
          this.loading = false
          this.dataList = this.dataList.concat(res.result.list)
          this.pageNum.total = res.result.totalCount
        } else {
          this.$toast(res.msg)
        }
      })
    },
    onLoad () { // 若加载条到了底部
      this.pageNum.page = this.pageNum.page + 1
      this.getlist1()					// 调用上面方法,请求数据
      this.refreshing = false
      if (this.dataList.length >= this.pageNum.total) {
        this.finished = true
      }
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    // 为了阻止点击电话图标触发父行为
    stopRouter () {
      console.log('ni')
    },
    routerClick (item) {
      this.$router.push({ path: '/particularsCar',
        query: { data: item, num: 1, active: 1 }
      })
    }
  }
}
</script>

<style lang="less">
  .center {
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
  }
  .vant_father /deep/ .van-tabs__content {
    position: relative !important;
    /* top: 44px !important; */
  }
  .vant_father /deep/ .van-tabs__wrap {
    position: fixed !important;
    width: 100% !important;
    z-index: 999 !important;
  }

  .center_data {
    width: 90%;
    background-color: #fff;
    padding: 0.5rem 1rem;
    margin: 0 auto;
    margin-top: 0.5rem;
    }
    .conter_father {
    display: flex;
    justify-content: space-between;
    }
    .center-right {
      flex: 0 0 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .aa-left-item {
      display: flex;
      margin-bottom: 0.5rem;
      .aa-left-label {
        color: #999;
        flex: 0 0 70px;
      }
      .aa-left-con {
        flex: 1;
      }
    }
</style>
