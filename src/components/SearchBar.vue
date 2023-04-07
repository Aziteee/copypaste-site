<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ArticleSortDirection, ArticleSortType } from '@/types'

const router = useRouter()

const inputText = ref('')
const selected = ref('')

watch(selected, (value) => {
  if (value === 'clear') {
    selected.value = ''
  }
})

function search() {
  router.push({ name: 'search', query: { kw: inputText.value, sort: ArticleSortType.TIME, direction: ArticleSortDirection.DESC } })
}
</script>

<template>
  <el-input v-model="inputText" placeholder="搜索..." @keyup.enter="search">
    <template #prepend>
      <el-button :icon="Search" @click="search" />
    </template>
    <template #append>
      <el-select v-model="selected" placeholder="搜索范围" style="width: 100px">
        <el-option label="原神" value="genshin" />
        <el-option label="永雏塔菲" value="taffy" />
        <el-option label="东雪莲" value="dxl" />
        <el-divider style="margin: 5px 0;" />
        <el-option label="清除选择" value="clear" />
      </el-select>
    </template>
  </el-input>
</template>
