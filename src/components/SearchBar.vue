<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ArticleSortDirection, ArticleSortType } from '@/types'
import { debounce } from 'lodash'

const router = useRouter()

const inputText = ref('')

const search = debounce(() => {
  router.push({ name: 'search', query: { kw: inputText.value, sort: ArticleSortType.TIME, direction: ArticleSortDirection.DESC } })
}, 300, {
  leading: true,
  trailing: false
})
</script>

<template>
  <el-input v-model="inputText" placeholder="搜索..." @keyup.enter="search" class="input">
    <template #prepend>
      <el-button :icon="Search" @click="search" />
    </template>
  </el-input>
</template>

<style>
.input .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
