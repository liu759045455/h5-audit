<template>
  <div class="g-aside">
    <el-menu
      :default-active="currentRoute"
      :default-openeds="opens"
      class="el-menu-vertical-demo"
      router
      :collapse="isCollapse"
    >
      <template v-for="(item, index) in menuList">
        <el-submenu
          v-if="item.type==0"
          :key="`menu_${index}`"
          :index="`menu_${index}`"
        >
          <template v-if="item.type==0" slot="title">
            <i :class="item.css"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(subItem) in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >
            <i :class="subItem.css"></i>
            <span>{{ subItem.name }}</span>
          </el-menu-item>
        </el-submenu>
        <!-- 没有子菜单 -->
        <el-menu-item
          v-if="item.type==1 && item.parentId==-1"
          :key="`menu_${index}`"
          :index="item.path"
        >
          <i :class="item.css"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'GAside',
  data () {
    return {
      isCollapse: false,
      currentRoute: '',
      opens: [],
      menuList: []
    }
  },
  created: function () {
    window.addEventListener('setItem', () => {
      this.isCollapse = localStorage.getItem('isCollapse') === '0'
    })
    const menuList = JSON.parse(
      localStorage.getItem('admin_menus') || '[]'
    )
    this.menuList = menuList
    this.handleQuery()
  },
  methods: {
    handleQuery () {
      const route = this.$route.path
      // 后台首页不高亮菜单
      if (route === '/') {
        this.currentRoute = ''
      } else {
        this.currentRoute = route
      }
    }
  }
}
</script>

<style lang="less">
  .g-aside {
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 100;
    .el-menu {
      border-right: none;
      .el-submenu{
        .el-menu-item {
          padding-left: 55px !important;
          font-size: 14px;
          color: #666;
        }
        .el-menu-item.is-active,
        .el-submenu.is-active .el-submenu__title {
          color: #4c8cf8;
        }
      }
    }
    .el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
    .el-submenu.is-active .el-submenu__title {
      color: #4c8cf8;
    }
    .el-menu-item i,
    .el-submenu__title i{
      font-size: 14px;
      color: inherit;
    }
    .el-submenu__icon-arrow {
      margin-top: -6px;
    }
  }
</style>
