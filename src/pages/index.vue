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
import RightArrow from '@/assets/icons/RightArrow.vue'
import { useTitle } from '@vueuse/core'

const siteTitle = useTitle()
siteTitle.value = '复制粘贴语录'

const router = useRouter()

const loadingYiyan = ref(true)
const yiyan = reactive<IArticle>({ id: '', text: '', uploadTime: '', likes: 0, uploader: '' })

const fetchYiyan = debounce(() => {
  console.log('clicked')
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
  <el-space direction="vertical" :size="25" style="margin-bottom: -7px;">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="display: flex; align-items: center; justify-content: center;">
            <el-icon size="18" style="margin-right: 7px;">
              <Windmill />
            </el-icon>
            <span>随机一言</span>
          </div>
          <el-button title="换一换" :icon="Refresh" :circle="true" @click="fetchYiyan"></el-button>
        </div>
      </template>
      <el-skeleton v-if="loadingYiyan" :rows="3" animated />
      <template v-else>
        <el-text class="yiyan-text">{{ yiyan.text }}</el-text>
        <div class="view-button-wrapper">
          <el-button title="查看" type="primary" :circle="true" :icon="RightArrow" size="large"
          @click="() => router.push({ name: 'article', params: { id: yiyan.id } })"></el-button>
        </div>
      </template>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div style="display: flex; align-items: center;">
          <el-icon size="24" style="margin-right: 7px;">
            <Ranking />
          </el-icon>
          <span>排行榜</span>
        </div>
      </template>
      <el-skeleton v-if="loadingLikesRanking" :rows="5" animated />
      <template v-else>
        <el-table class="ranking-table" :data="likesRanking" @cell-click="(row: IArticle) => router.push({ name: 'article', params: { id: row.id } })" style="width: 100%;">
          <el-table-column>
            <template #default="scope">
              <el-text :truncated="true">{{ scope.row.text }}</el-text>
            </template>
          </el-table-column>
          <el-table-column width="70">
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

.ranking-table {
  // 去除标题栏占用的空间
  &:deep(.el-table__header-wrapper) {
    display: none;
  }
}

.view-button-wrapper {
  margin-top: 20px;
  // 查看按钮居中显示
  text-align: center;

  & > .el-button {
    // 按钮图标变大
    font-size: large;
  }
}

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
