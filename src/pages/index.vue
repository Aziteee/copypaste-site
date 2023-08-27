<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { type IArticle } from '@/types'
import { useRouter } from 'vue-router'
import * as api from '@/api'
import Like from '@icons/Like.vue'
import { debounce } from 'lodash'
import Windmill from '@/assets/icons/Windmill.vue'
import Ranking from '@/assets/icons/Ranking.vue'

const router = useRouter()

const loadingYiyan = ref(true)
const yiyan = reactive<IArticle>({ id: '', text: '', uploadTime: '', likes: 0, uploader: '' })

const fetchYiyan = debounce(() => {
  loadingYiyan.value = true
  api.getRandomArticle()
    .then(response => {
      const result = response.data[0]
      yiyan.id = result.id
      yiyan.text = result.text
      yiyan.uploadTime = result.uploadTime
      loadingYiyan.value = false
    })
}, 200, { leading: true })
fetchYiyan()

const loadingLikesRanking = ref(true)
const likesRanking = ref<IArticle[]>([])

function fetchLikesRanking() {
  loadingLikesRanking.value = true
  api.getLikesRanking().then(response => {
    likesRanking.value = response.data
    loadingLikesRanking.value = false
  })
}
fetchLikesRanking()
</script>

<template>
  <el-space direction="vertical" :size="25">
    <el-card shadow="never" class="box-card">
      <template #header>
        <div class="card-header">
          <div style="display: flex; align-items: center;">
            <el-icon style="margin-right: 7px;">
              <Windmill />
            </el-icon>
            <span>随机一言</span>
          </div>
          <el-button :icon="Refresh" @click="fetchYiyan">换一换</el-button>
        </div>
      </template>
      <el-skeleton v-if="loadingYiyan" :rows="3" animated />
      <template v-else>
        <el-text class="yiyan-text">{{ yiyan.text }}</el-text>
        <el-divider class="yiyan-card-divider" />
        <div class="info-section">
          <el-text size="small" title="收录日期">{{ yiyan.uploadTime }}</el-text>
          <el-link @click="() => router.push({ name: 'article', params: { id: yiyan.id } })">查看全文 »</el-link>
        </div>
      </template>
    </el-card>
    <el-card shadow="never" class="box-card">
      <template #header>
        <div style="display: flex; align-items: center;">
          <el-icon size="23" style="margin-right: 7px;">
            <Ranking />
          </el-icon>
          <span>排行榜</span>
        </div>
      </template>
      <el-skeleton v-if="loadingLikesRanking" :rows="5" animated />
      <template v-else>
        <el-table :data="likesRanking" @cell-click="(row: IArticle) => router.push({ name: 'article', params: { id: row.id } })" style="width: 100%">
          <el-table-column label="语句">
            <template #default="scope">
              <el-text :truncated="true">{{ scope.row.text }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="点赞数" width="70">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-icon>
                  <Like />
                </el-icon>
                <span style="margin-left: 10px">{{ scope.row.likes }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </el-space>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  max-width: calc(100vw - 40px);
  width: 50vw;

  @media screen {
    @media (max-width: 768px) {
      width: 70vw;
    }

    @media (max-width: 480px) {
      width: 85vw
    }
  }
}

.yiyan-text {
  @include multiLineTextOverflow(10);

  white-space: pre-wrap;
  text-align: center;
}

// .yiyan-card-divider {
//   width: 125%;
//   margin-left: -24px;
// }

.info-section {
  display: flex;
  justify-content: space-between;
}
</style>
