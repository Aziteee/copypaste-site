<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Filter } from '@element-plus/icons-vue'
import { ArticleSortDirection, ArticleSortType } from '@/types'
import { debounce, isEmpty } from 'lodash'

const router = useRouter()

const inputText = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const search = debounce(() => {
  router.push({ name: 'search', query: { q: inputText.value, sort: ArticleSortType.TIME, direction: ArticleSortDirection.DESC } })
}, 300, {
  leading: true,
  trailing: false
})

function addFilter(text: string) {
  inputText.value += (isEmpty(inputText.value) ? '' : ' ') + text + ':'
  searchInput.value?.focus()
}
</script>

<template>
  <el-input v-model="inputText" placeholder="搜索..." @keyup.enter="search" ref="searchInput" class="search-input">
    <template #prepend>
      <el-button :icon="Search" @click="search" />
    </template>
    <template #append>
      <el-popover :width="100" trigger="click">
        <template #reference>
          <el-button title="搜索语句" :icon="Filter"></el-button>
        </template>
        <div class="filter-popover-list">
          <el-button text @click="() => addFilter('uploader')">上传者</el-button>
          <el-button text @click="() => addFilter('likes')">点赞数</el-button>
          <el-button text @click="() => addFilter('uploadTime')">上传时间</el-button>
        </div>
      </el-popover>
    </template>
  </el-input>
</template>

<style scoped lang="scss">
.el-popover {
  min-width: 10px !important;
}

.search-input .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.filter-popover-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;

  & > button {
    margin-left: 0px !important;
  }
}
</style>
