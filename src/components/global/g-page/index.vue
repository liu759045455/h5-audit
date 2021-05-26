<template>
  <div class="mainContain">
    <div class="g-page">
      <div class="header">
        <g-header></g-header>
      </div>
      <div class="contentwrap sidebar">
        <!-- 左侧菜单 -->
        <div class="aside">
          <g-aside></g-aside>
        </div>
        <!-- 右侧 -->
        <div ref="content" class="content">
          <div class="toggle-button" @click="toggleCollapse">
            <i v-if="isCollapse" style="font-size:18px ;" class="el-icon-s-unfold"></i>
            <i v-if="!isCollapse" style="font-size:18px ;" class="el-icon-s-fold icon_b"></i>
          </div>
          <div class="toggle-button two" @click="backHome">
            <i style="font-size:18px ;" class="el-icon-s-home" />
          </div>
          <!-- 面包屑 -->
          <div class="breadcrumb">
            <g-breadcrumb></g-breadcrumb>
          </div>
          <!-- 路由内容 -->
          <div ref="main" class="main">
            <transition name="fade-transform" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GPage',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {},
  methods: {
    backHome () {
      this.$router.push({ path: '/homepage/homeIndex' })// 返回首页
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      this.resetSetItem('isCollapse', this.isCollapse ? '0' : '1')
      if (this.isCollapse) {
        this.$refs.main.style.width = 'calc(100% - 80px)'
        this.$refs.content.style.paddingLeft = '59px'
      } else {
        this.$refs.main.style.width = 'calc(100% - 216px)'
        this.$refs.content.style.paddingLeft = '195px'
      }
    }
  }
}
</script>

<style scoped lang="less">
.mainContain {
  display: flex;
  .g-page {
    min-width: 1366px;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    .header {
      height: 50px;
    }
    .contentwrap {
      flex-grow: 1;
      min-width: 1366px;
      display: flex;
      height: 100%;
      position: relative;
      .aside {
        max-width: 200px;
        /*position: absolute;*/
        top: 0;
        left: 0;
        bottom: 0;
        background: #fff;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    .sidebar {
      .content {
        background-color: #f3f4f7;
        padding-left: 195px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .toggle-button{
          cursor: pointer;
          font-size: 24px;
          width: 20px;
          height: auto;
          position: fixed;
          top: 53.5px;
          margin-left: 18px;
          color: #4C8CF8;
          z-index: 11;
        }
        .two{
          margin-left: 45px;
          color: #999;
          top: 51.5px;
          font-size: 25px;
        }
        .breadcrumb {
          width: 100%;
          position: fixed;
          top: 50px;
          color: #4C8CF8;
          z-index: 10;
        }
        .main {
          min-width: 1166px;
          width: calc(100% - 216px);
          flex-grow: 1;
          position: absolute;
          top: 40px;
          margin-left: 16px;
          max-height: calc(100% - 40px);
          overflow: hidden;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
