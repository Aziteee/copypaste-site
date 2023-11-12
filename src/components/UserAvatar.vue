<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: number,
  src?: string,
  hoverShadow?: boolean
}>(), {
  size: 35,
  hoverShadow: false
})
</script>

<template>
<el-avatar class="avatar" :size="props.size" :src="props.src === '' ? 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' : props.src"></el-avatar>
</template>

<style scoped lang="scss">
.avatar {
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 6px;
  border: 1px solid var(--el-border-color);

  &:hover {
    cursor: pointer;
    // border-color: var(--el-color-primary-light-7);
    box-shadow: 0 5px 15px -10px var(--el-color-primary);
  }
}
</style>
