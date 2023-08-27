<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useHistoryStore } from '@stores/history'
import { DocumentCopy, User, Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { type IArticle, isLikedStatus } from '@/types'
import * as api from '@/api'
import Like from '@icons/Like.vue'
import { debounce } from 'lodash'

const route = useRoute()
const router = useRouter()

const historyStore = useHistoryStore()

const loading = ref(true)
const data = reactive<IArticle>({ id: route.params.id as string, text: '', uploadTime: '', likes: 0, uploader: '' })
const isLiked = ref(isLikedStatus.UNKNOWN)

onBeforeRouteUpdate((to) => {
  data.id = to.params.id as string
  fetchData()
})

api.isLiked(data.id).then(() => {
  isLiked.value = isLikedStatus.LIKED
}).catch(error => {
  if (error.response.status === 404) {
    isLiked.value = isLikedStatus.UNLIKED
  }
})

function fetchData() {
  loading.value = true
  api.getArticleById(data.id)
    .then((response) => {
      const result = response.data

      data.text = result.text
      data.uploadTime = result.uploadTime
      data.likes = result.likes
      data.uploader = result.uploader
      loading.value = false

      historyStore.add({
        ...data,
        id: route.params.id as string,
        text: result.text.length > 30 ? result.text.substring(0, 30) : result.text
      })
    })
}
fetchData()

const like = debounce(() => {
  api.likeArticle(data.id)
    .then(response => {
      if (response.status === 204) {
        data.likes++
        isLiked.value = isLikedStatus.LIKED
      }
    })
}, 300, {
  leading: true,
  trailing: false
})

const unlike = debounce(() => {
  api.unlikeArticle(data.id)
    .then(response => {
      if (response.status === 204) {
        data.likes--
        isLiked.value = isLikedStatus.UNLIKED
      }
    })
}, 300, {
  leading: true,
  trailing: false
})

function copy() {
  const textElement = document.querySelector('.article-text')
  const range = document.createRange()
  if (textElement) range.selectNode(textElement)
  const selection = window.getSelection()
  if (selection) {
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('copy')
    ElMessage.success('已复制')
    selection.removeAllRanges()
  }
}

const queryUploader = debounce(() => {
  router.push({ name: 'search', query: { q: `uploader:${data.uploader}` } })
}, 300, {
  leading: true,
  trailing: false
})
</script>

<template>
  <el-skeleton v-if="loading" :rows="5" animated />
  <article v-if="!loading" class="content">
    <el-card shadow="never" class="content-card">
      <template #header>
        <el-descriptions :column="2" class="article-description">
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon style="margin-right: 6px;">
                  <User />
                </el-icon>
                <span>上传者</span>
              </div>
            </template>
            <el-link :underline="false" @click="queryUploader">{{ data.uploader }}</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">
            <template #label>
              <div class="cell-item">
                <el-icon style="margin-right: 6px;">
                  <Clock />
                </el-icon>
                <span>上传时间</span>
              </div>
            </template>
            {{ data.uploadTime }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <el-text size="large" tag="p" style="line-height: 30px; white-space: pre-wrap;" class="article-text">{{ data.text }}</el-text>
    </el-card>
    <div class="button-group">
      <el-button v-if="isLiked === isLikedStatus.LIKED" :icon="Like" title="取消点赞" @click="unlike" type="primary" plain>{{ data.likes }}</el-button>
      <el-button v-else :disabled="isLiked === isLikedStatus.UNKNOWN" :icon="Like" title="点赞" @click="like">{{ data.likes || '点赞' }}</el-button>
      <el-button :icon="DocumentCopy" @click="copy">复制</el-button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.cell-item {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.article-description {
  &:deep(tr) {
    display: flex;
  }

  &:deep(.el-descriptions__cell) {
    flex-grow: 1;
    padding-bottom: 0px !important;
    display: flex;
    flex-wrap: wrap;

    & .el-descriptions__label {
      margin-right: 10px;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 10vw;

  @media screen {
    @media (max-width: 768px) {
      margin: 0px 5vw;
    }

    @media (max-width: 480px) {
      margin: 0px 5px;
    }
  }

  .content-card {
    min-width: 330px;
  }

  .button-group {
    margin-top: 20px;
    display: flex;
  }
}
</style>
