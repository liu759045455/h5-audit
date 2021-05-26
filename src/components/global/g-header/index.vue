<template>
  <div class="g-header">
    <div class="left">
      <img src="../../../../static/images/logo.png" class="img">
      <span class="logo">临时申报后台管理</span>
    </div>
    <div class="right">
      <!-- <img src="../../../../static/images/avatar.png" class="avatar"> -->
      <span class="name">{{ nickname }}</span>
      <div style="margin-left: 20px;">
        <el-dropdown trigger="click">
          <el-button type="info" style="background-color:transparent;border: 0;">
            个人中心<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="color:#409EFF">
            <el-dropdown-item style="color:#409EFF" @click.native="showEditDialog = true">
              修改密码
            </el-dropdown-item>
            <el-button
              style="margin-left: 19px;font-size: 14px;" type="text" size="mini"
              @click="logout"
            >
              退出
            </el-button>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-dialog
        :modal="false"
        title="修改密码" :visible.sync="showEditDialog" width="30%"
        left @close="resetForm('ruleForm')"
      >
        <div>
          <el-form
            ref="ruleForm" :model="ruleForm" status-icon
            :rules="rules" label-width="100px" class="demo-ruleForm"
          >
            <el-form-item label="旧密码" prop="passWord" required>
              <el-input v-model="ruleForm.passWord" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass" required>
              <el-input v-model="ruleForm.pass" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" required>
              <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="putUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :modal="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        title="请修改密码" :visible.sync="showEditDialog1" width="30%"
        left @close="resetForm('ruleForm')"
      >
        <div>
          <el-form
            ref="ruleForm" :model="ruleForm" status-icon
            :rules="rules" label-width="100px" class="demo-ruleForm"
          >
            <el-form-item label="旧密码" prop="passWord" required>
              <el-input v-model="ruleForm.passWord" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass" required>
              <el-input v-model="ruleForm.pass" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" required>
              <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="putUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Server from '../../../API/common'
import { httpPost } from '../../../common/request'
export default {
  name: 'GHeader',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showEditDialog1: false,
      ruleForm: {

        firstLogin: '',
        pass: '',
        checkPass: '',
        passWord: ''
      },
      activeIndex: '1',
      username: '',
      nickname: '',
      showEditDialog: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const user = this.$localstore.get('admin_user')
    if (user.username && user.nickname) {
      this.username = user.username
      this.nickname = user.nickname
    }
    const firstLogin = this.$localstore.get('user_firstLogin')
    if (firstLogin === 0) {
      this.firstLogin = firstLogin
      this.showEditDialog1 = true
    }
  },
  methods: {
    logout () {
      this.$confirm('退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 注销
          const obj = {}
          obj.id = this.$localstore.get('admin_user').id
          Server.logout(obj).then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              // 清空各种数据
              this.$localstore.set('admin_login', false)
              this.$localstore.set('admin_user', {})
              this.$router.push('/login')
            }
          })
        })
        .catch(() => {
        })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 修改密码
    putUser () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        const newPassword = this.ruleForm.checkPass
        const oldPassword = this.ruleForm.passWord
        const id = this.$localstore.get('admin_user').id
        const newWord = {
          newPassword,
          oldPassword,
          id
        }
        httpPost('api/user-server/user/editPassword', newWord).then(res => {
          this.showEditDialog = false
          if (res.code === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            // 注销
            const obj = {}
            obj.id = this.$localstore.get('admin_user').id
            Server.logout(obj).then(res => {
              if (res.code === 0) {
                // 清空各种数据 到时候H5
                this.$localstore.set('admin_login', false)
                this.$localstore.set('admin_user', {})
                // this.$localstore.set('admin_menus', {})
                // this.$localstore.set('permission', [])
                // this.$localstore.set('btnList', [])
                // this.$store.commit('user/user_Mutations', {})
                // this.$store.commit('menus/menus_Mutations', {})
                // this.$store.commit('common/login_Mutations', false)
                // this.$localstore.set('admin_username', '')
                // this.$localstore.set('admin_password', '')
                this.$router.push('/login')
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.g-header {
  position:fixed;

  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background: #4C8CF8;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: #fff;
  font-size: 16px;
  .left {
    float: left;
    width: 200px;
    height: 50px;
    line-height: 50px;
    .img {
      width: 20%;
      margin-top: 7px;
      margin-left: 6px;
    }
    .logo {
      font-weight: 600;
      margin-left: 13px;
      vertical-align: top;
    }
  }
  .right {
    display: flex;
    float: right;
    margin-right: 40px;
    height: 50px;
    line-height: 50px;
    .avatar {
      margin-top: 11px;
    }
    .name {
      vertical-align: top;
      font-size: 14px;
    }
    .logoutCon {
      margin-left: 40px;
      cursor: pointer;
      padding-top: 15px;
      .log {
        vertical-align: top;
        margin-top: 16.5px;
      }
      .logout {
        vertical-align: top;
        padding-left: 12px;
      }
    }
  }
}
.el-dialog__header{
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  border: 1px solid #e6e6e6;
  background-color: #f3f8ff;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
</style>
