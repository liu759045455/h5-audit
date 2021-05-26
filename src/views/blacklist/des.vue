<template>
  <div class="des">
    <div class="des-check">
      <div class="label">
        <div class="des-label">
          姓名
        </div>
        <div class="des-datas">
          {{ items.name }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="des-check">
      <div class="label">
        <div class="des-label">
          {{ $route.query.idper ? "身份证" : "车牌号" }}
        </div>
        <div class="des-datas">
          {{ items.blackValue }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="des-check">
      <div class="label">
        <div class="des-label">
          理由
        </div>
        <div class="des-datas">
          {{ des.reason }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="des-check">
      <div class="label">
        <div class="des-label">
          图片
        </div>
        <div class="des-datas">
          <img :src="des.fileUrl" alt="" @click="imgClick">
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="des-check">
      <div class="label">
        <div class="des-label">
          拉黑时间
        </div>
        <div class="des-datas">
          {{ dayjs(des.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="add-btn" @click="deleteClick">
      移除
    </div>
  </div>
</template>

<script>
import { httpPost } from '../../common/request'
import { ImagePreview } from 'vant'

export default {
  // eslint-disable-next-line vue/require-prop-types
  data () {
    return {
      des: [],
      items: [],
      dayjs: ''
    }
  },
  created () {
    this.dayjs = require('dayjs')
    this.items = this.$route.query.item
    httpPost('/api/shihua-server/blackList/queryBlackStream', {
      id: this.$route.query.id
    }).then((res) => {
      if (res.code === 0) {
        this.des = res.result[0]
      }
    })
  },
  methods: {
    imgClick () {
      ImagePreview([this.des.fileUrl])
    },
    deleteClick () {
      httpPost('/api/shihua-server/blackList/deleteBlack', {
        id: this.items.id,
        reason: this.des.reason,
        createUserId: this.des.createUserId,
        fileUrlList: this.des.fileUrlList
      }).then((res) => {
        if (res.code === 0) {
          console.log(1, '--+++')
          if (this.$route.query.idper) {
            this.$router.push({
              path: '/index',
              query: {
                idper: 'true'
              }
            })
          } else {
            this.$router.push({
              path: '/index',
              query: {
                idper: 'false'
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/* 查看表格样式 */
.add-btn {
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  margin-top: 30px;
  // bottom: 200px;
  width: 90%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #3774ec;
  border-radius: 22px;
  color: #fff;
}
.des {
  .des-check {
    display: flex;
    flex-direction: column;
    margin-top: 18px;
    .label {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .des-label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #000000;
      }
      .des-datas {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        > img {
          width: 60px;
          height: 60px;
        }
      }
    }
    .line {
      margin: 18px auto 0 auto;
      width: 90%;
      height: 1px;
      background: #e4e4e4;
    }
  }
}

.s-detail-wrapper {
  padding: 10px 10px 20px 10px;
  table {
    &.s-ctl-check-table {
      border-collapse: collapse;
      width: 100%;
      box-sizing: border-box;
      > tbody {
        width: 146px;
        tr {
          &:not(last-child) {
            tr {
              border: #f3f8ff 1px solid;
            }
          }
          th {
            background-color: #eee;
            & > span {
              display: block;
              padding: 20px 30px;
              height: 100%;
              font-size: 15px;
              color: #333;
              text-align: right;
            }
          }
          td {
            padding: 20px 42px;
            word-break: break-all;
            text-align: justify;
            img {
              width: 100px;
              height: 100px;
            }
          }
        }
      }
      .s-check-img-wrapper {
        .s-img-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fill, 130px);
          grid-gap: 10px;
          .el-image {
            width: 130px;
            height: 130px;
            border: #fafafa 1px solid;
            //background-color: rgba(0,0,0,0.1);
          }
        }
      }
    }
  }
}
</style>
