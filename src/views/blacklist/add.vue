<template>
  <div class="add">
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.name"
        name="姓名"
        label="姓名"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请输入姓名' }]"
        :maxlength="50"
        required
        @input="nameInput"
      />
      <van-field
        v-model="form.blackValue"
        :name="codeName"
        :label="codeName"
        :placeholder="codePla"
        :rules="rule"
        :maxlength="$route.query.idper ? 18 : 8"
        required
        @input="paxIdNoInput"
      />
      <van-field
        v-model="form.reason"
        class="textUp"
        rows="2"
        autosize
        label="理由"
        type="textarea"
        maxlength="100"
        placeholder="请输入理由"
        show-word-limit
        :rules="[{ required: true, message: '请输入理由' }]"
        required
      />
      <van-field
        class="imgUp"
        name="uploader"
        label="图片"
        :rules="[{ required: true, message: '请选择图片' }]"
        required
      >
        <template #input>
          <van-uploader
            v-model="form.fileUrlList"
            :max-count="1"
            :after-read="afterRead"
          />
        </template>
      </van-field>
      <van-button
        round block type="info"
        native-type="submit"
      >
        保存
      </van-button>
    </van-form>

    <div v-if="loads" class="loading">
      <van-loading />
      图片上传中...
    </div>
  </div>
</template>

<script>
import { httpPost } from '../../common/request'
// import { Toast } from 'vant'

export default {
  data () {
    return {
      loads: false,
      form: {
        name: '',
        blackValue: '',
        enterpriseId: 1,
        reason: '',
        type: 0,
        fileUrlList: [],
        tokens: ''
      },
      fileUrl: '',
      codeName: '身份证',
      codePla: '请输入身份证',
      rule: [
        {
          required: true,
          message: this.$route.query.idper ? '请输入身份证' : '请输入车牌号'
        },
        {
          // 模式指的是正则表达式
          pattern: this.$route.query.idper
            ? /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
            : /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/,
          message: this.$route.query.idper ? '身份证格式不正确' : '车牌号格式不正确'
        }
      ]
    }
  },
  created () {
    this.tokens = localStorage.getItem('admin_user')
    console.log(this.tokens, 'token----')
    if (this.$route.query.idper) {
      this.form.type = 0
      this.codeName = '身份证'
      this.codePla = '请输入身份证'
      console.log('黑名单人员')
    } else {
      this.form.type = 1
      this.codeName = '车牌号'
      this.codePla = '请输入车牌号'
      console.log('黑名单车辆')
    }
  },
  methods: {
    paxIdNoInput () {
      this.form.blackValue = this.form.blackValue.trim()
    },
    nameInput () {
      this.form.name = this.form.name.trim()
    },
    afterRead (file) {
      // 此时可以自行将文件上传至服务器
      localStorage.setItem('admin_user', this.tokens)
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('folder', 'image')
      this.loads = true
      httpPost('/api/common-server/file/upload', formData).then((res) => {
        if (res.code === 0) {
          // Toast('图片添加成功')
          this.loads = false
          this.form.fileUrlList = [{ url: res.result.url }]
          this.fileUrl = res.result.url
        }
      })
    },
    onSubmit () {
      httpPost('/api/shihua-server/blackList/addBlack', {
        ...this.form,
        fileUrlList: [this.fileUrl]
      }).then((res) => {
        if (res.code === 0) {
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
        // else {
        //   this.$router.go(-1)
        // }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  height: 100%;
  .loading {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    text-align: center;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    // .van-loading {
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }
  }
  /deep/.van-form {
    width: 90%;
    margin: 0 auto;
    padding: 10px;
    border-radius: 10px;
    .van-cell {
      margin-bottom: 10px;
      margin-top: 10px;
      border-radius: 10px;
      &.imgUp {
        display: flex;
        flex-direction: column;
        .van-field__value {
          margin-top: 10px;
        }
      }
      &.textUp {
        display: flex;
        flex-direction: column;
        .van-cell__value {
          margin-top: 10px;
          .van-field__body {
            > textarea {
              width: 100%;
              height: 95px !important;
              background: #f2f2f2;
              border-radius: 5px;
              padding: 10px;
            }
            .van-field__control {
              text-align: left;
            }
          }
          .van-field__error-message {
            text-align: left;
            font-size: 14px;
          }
        }
      }
      .van-cell__value {
        .van-field__body {
          .van-field__control {
            text-align: right;
          }
        }
        .van-field__error-message {
          text-align: right;
          font-size: 14px;
        }
      }
    }
    .van-button {
      border-radius: 10px;
      background: #3774ec;
    }
  }
}
</style>
