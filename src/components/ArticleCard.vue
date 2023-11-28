<script setup lang="ts">
import TextTemplate from './TextTemplate.vue'
import Like from '@/assets/icons/Like.vue'

import { toRefs } from 'vue'

interface IArticle {
  id: string
  text: string
  likes?: number
  lineClamp?: number
}

const props = withDefaults(defineProps<IArticle>(), {
  lineClamp: 10
})

const { lineClamp } = toRefs(props)
</script>

<template>
  <el-card shadow="always" class="card">
    <el-text class="text-section">
      <TextTemplate :text="props.text"></TextTemplate>
    </el-text>
    <div v-if="props.likes !== undefined" class="info-section">
      <div style="display: flex; gap: 5px; align-items: center;">
        <el-icon size="small" color="#C0C4CC">
          <Like />
        </el-icon>
        <el-text style="color: #C0C4CC;">{{ props.likes }}</el-text>
      </div>
      <div>
        <slot name="operation"></slot>
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
  justify-content: space-between;
  margin-top: 7px;
}

.text-section {
  @include multiLineTextOverflow(v-bind(lineClamp));
  cursor: default;
  white-space: pre-wrap;
  line-height: 22px;
}
</style>
