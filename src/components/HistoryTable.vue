<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@stores/history'
import { IArticle } from '@/types'
import { Delete } from '@element-plus/icons-vue'

defineProps<{
  maxHeight: string,
  lineClamp: string
}>()

const router = useRouter()

const historyStore = useHistoryStore()

const emit = defineEmits(['cell-clicked'])

function handleCellClick(row: IArticle) {
  emit('cell-clicked')
  router.push({ name: 'article', params: { id: row.id } })
}
</script>

<template>
  <el-table :data="historyStore.history" table-layout="fixed" @cell-click="handleCellClick" cell-class-name="history-cell"
    class="table">
    <el-table-column prop="text" label="历史记录">
      <template #header>
        <div style="display: flex; justify-content: space-between;">
          <span>历史记录</span>
          <el-button v-if="historyStore.history.length > 0" :underline="false" :icon="Delete" link style="font-size: small;" @click="historyStore.clear"></el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';

.table {
  height: auto;
  max-height: v-bind("$props.maxHeight");
  overflow-y: auto;

  &:deep(.history-cell) .cell {
    @include multiLineTextOverflow(v-bind("$props.lineClamp"));

    cursor: default;
  }

  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
</style>
