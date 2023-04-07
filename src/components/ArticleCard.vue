<script setup lang="ts">
interface IArticle {
  id: string,
  text: string,
  time: string
}

const props = defineProps<IArticle>()
</script>

<template>
  <el-card shadow="hover" class="card">
    <el-text :title="props.text" class="text-section">{{ props.text }}</el-text>
    <el-divider v-if="props.time" />
    <div class="info-section">
      <el-text v-if="props.time" size="small" title="收录日期">{{ props.time }}</el-text>
      <el-link>查看全文 »</el-link>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';

.info-section {
  display: flex;
  justify-content: space-between;
}

.text-section {
  @include multiLineTextOverflow(10);

  cursor: default;
  white-space: pre-wrap;
  line-height: 22px;
}
</style>
