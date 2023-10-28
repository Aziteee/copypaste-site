<script setup lang="ts">
import TextTemplate from './TextTemplate.vue'

interface IArticle {
  id: string
  text: string
  time?: string
  showMoreButton?: boolean
  lineClamp?: number
}

const props = withDefaults(defineProps<IArticle>(), {
  lineClamp: 10,
  showMoreButton: true
})
</script>

<template>
  <el-card shadow="hover" class="card">
    <el-text class="text-section">
      <TextTemplate :text="props.text"></TextTemplate>
    </el-text>
    <el-divider v-if="props.time" />
    <div v-if="!props.time && props.showMoreButton === false" class="info-section">
      <el-text v-if="props.time" size="small" title="收录日期">{{ props.time }}</el-text>
      <el-link v-if="props.showMoreButton" >查看全文 »</el-link>
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
