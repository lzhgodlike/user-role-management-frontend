<template>
  <div class="app-container">
    <el-container v-if="showLayout">
      <el-header>
        <div class="header-content">
          <h1>用户角色管理系统</h1>
          <div class="nav-links">
            <router-link to="/user-roles">角色管理</router-link>
          </div>
          <div class="user-info" v-if="userStore.user">
            <span>欢迎，{{ userStore.user.username }}</span>
            <el-button type="text" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <p>© 2023 用户角色管理系统</p>
      </el-footer>
    </el-container>
    <router-view v-else />
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

export default {
  setup() {
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()

    // 是否显示布局（登录页和注册页不显示布局）
    const showLayout = computed(() => {
      return route.path !== '/login' && route.path !== '/register'
    })

    // 退出登录
    const handleLogout = () => {
      ElMessageBox.confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userStore.logout()
        router.push('/login')
      }).catch(() => {})
    }

    return {
      userStore,
      showLayout,
      handleLogout
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  height: 100vh;
}

.el-header {
  background-color: #409EFF;
  color: white;
  text-align: center;
  line-height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-links a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

.el-footer {
  background-color: #f8f8f8;
  color: #909399;
  text-align: center;
  line-height: 60px;
  font-size: 14px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 