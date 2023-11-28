<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{
  content: string
  showClose?: boolean
}>(), {
  showClose: false
})
</script>

<template>
  <el-card>
    <div class="banner__container">
      <el-text>{{ props.content }}</el-text>
      <div v-if="showClose" class="close-button" @click="$emit('close')">
        <el-icon><Close /></el-icon>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.close-button {
  cursor: pointer;
}

.banner__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
