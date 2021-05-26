<template>
  <div class="error404">
    <div class="container">
      <img class="bg" src="../../../static/images/404.png">
      <div class="footer">
        <el-button type="primary" class="w90" @click="backHome">
          返回首页
        </el-button>
        <el-button
          type="primary" plain class="w90"
          @click="backLastPage"
        >
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    backHome () {
      this.$router.push({ path: '/homepage/homeIndex' })// 返回首页
    },
    backLastPage () {
      this.$router.go(-1)// 返回上一层
    }
  }
}
</script>

<style lang="less">

  .footer {
    text-align: center;
    padding: 50px 0;
    .w90 {
      width: 150px;
    }
  }
  .container {
    max-width: 90%;
    margin: 0 auto;
    padding: 80px 0px;
  }
  img {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .bg {
    display: block;
    max-width: 100%;
    margin: 0px auto;
    margin: 40px auto;
  }
</style>
