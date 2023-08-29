<script setup lang="ts">
import HeaderView from '@components/HeaderView.vue'
</script>

<template>
  <el-container>
    <header-view class="header" />
    <el-main class="main">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <div>
        <el-link href="https://github.com/Aziteee/copypaste-site">Github</el-link>
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

$header-height: 60px;
$footer-height: 75px;

.header {
  height: $header-height;
}

.main {
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
  border-top: 1px solid var(--el-border-color);
  margin-bottom: 0px;
  height: $footer-height;
}
</style>
