<script setup lang="ts">
import HeaderView from '@components/HeaderView.vue'
import { useLogto } from '@logto/vue'
import { useAccessToken } from '@/composables/accessToken'
import * as consts from '@/consts'
import { ElMessage } from 'element-plus'

// import { ElNotification } from 'element-plus'
// import { onMounted } from 'vue'

// const notification = '由于服务器到期，本站将暂时关闭一段时间。待数据迁移到新服务器时开放（预计2~3周时间）'

// onMounted(() => {
//   if (localStorage.getItem('notification') !== notification) {
//     ElNotification({
//       title: '通知',
//       message: notification,
//       duration: 0,
//       onClose: () => {
//         localStorage.setItem('notification', notification)
//       }
//     })
//   }
// })

const { isAuthenticated, getAccessToken, signOut } = useLogto()
setTimeout(() => {
  if (isAuthenticated.value) {
    const { expired } = useAccessToken(getAccessToken)
    if (expired.value) {
      console.warn('TOKEN EXPIRED')
      ElMessage('登录信息过期，请重新登录')
      setTimeout(() => {
        signOut(consts.baseUrl)
      }, 1000)
    }
  }
}, 1000)

</script>

<template>
  <el-container>
    <HeaderView class="header" />
    <el-main class="main">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <div>
        <el-link href="https://api.azite.cn/doc/#/copypaste">API</el-link>
        <el-divider direction="vertical" />
        <el-link href="https://tieba.baidu.com/f?kw=%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4" target="_blank">百度贴吧 - 复制粘贴吧</el-link>
        <el-divider direction="vertical" />
        <el-link href="/disclaimer">公告</el-link>
      </div>
      <el-link href="https://beian.miit.gov.cn" size="small">浙ICP备2022031707号</el-link>
    </el-footer>
  </el-container>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';

$header-height: 80px;
$footer-height: 100px;

.main {
  // background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  min-height: calc(100vh - $header-height - $footer-height);
}

.footer {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  // border-top: 1px solid var(--el-border-color);
  // margin-bottom: 0px;
  height: $footer-height;
}
</style>
