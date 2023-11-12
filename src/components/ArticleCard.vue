<script setup lang="ts">
import TextTemplate from './TextTemplate.vue'
import Like from '@/assets/icons/Like.vue'

interface IArticle {
  id: string
  text: string
  likes?: number
  lineClamp?: number
}

const props = withDefaults(defineProps<IArticle>(), {
  lineClamp: 10
})
</script>

<template>
  <el-card shadow="always" class="card">
    <el-text class="text-section" :line-clamp="props.lineClamp" :truncated="true">
      <TextTemplate :text="props.text"></TextTemplate>
    </el-text>
    <div v-if="props.likes" class="info-section">
      <div class="number-container">
        <el-icon>
          <Like />
        </el-icon>
        <span style="margin-left: 3px;">15</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';

.card:hover {
  background-color: var(--el-color-primary-light-9);
}

.info-section {
  display: flex;
  align-items: center;
}

.text-section {
  cursor: default;
  white-space: pre-wrap;
  line-height: 22px;
}
</style>
