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
import { useMobileSize } from '@composables/mobileSize'
import { useTitle } from '@vueuse/core'

const siteTitle = useTitle();

const route = useRoute()
const router = useRouter()

const { isMobileSize } = useMobileSize()

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

      siteTitle.value = result.text.substring(0, 10) + '... | 复制粘贴语录'

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
  <article class="content">
    <el-card shadow="always" class="content-card">
      <el-skeleton v-if="loading" :rows="4" animated />
      <template v-if="!loading" #header>
        <el-descriptions :column="2" class="article-description">
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon style="margin-right: 6px;">
                  <User />
                </el-icon>
                <span v-if="!isMobileSize">上传者</span>
              </div>
            </template>
            <el-link style="margin-top: -5px;" @click="queryUploader">{{ data.uploader }}</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">
            <template #label>
              <div class="cell-item">
                <el-icon style="margin-right: 6px;">
                  <Clock />
                </el-icon>
                <span v-if="!isMobileSize">上传时间</span>
              </div>
            </template>
            <el-text style="line-height: 10px;">{{ data.uploadTime }}</el-text>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <div v-if="!loading">
        <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 5px;">
          <el-icon size="small" color="#C0C4CC">
            <Like />
          </el-icon>
          <el-text style="color: #C0C4CC;">{{ data.likes }}</el-text>
        </div>
        <el-text size="large" tag="p" style="line-height: 30px; white-space: pre-wrap;" class="article-text">{{ data.text }}</el-text>
        <div class="button-group">
          <el-button v-if="isLiked === isLikedStatus.LIKED" :icon="Like" :circle="true" type="danger" size="large" @click="unlike"></el-button>
          <el-button v-else :icon="Like" :circle="true" type="primary" size="large" @click="like"></el-button>
          <!-- <el-button v-if="isLiked === isLikedStatus.LIKED" :icon="Like" title="取消点赞" @click="unlike" type="danger" plain>{{ data.likes }}</el-button>
        <el-button v-else :disabled="isLiked === isLikedStatus.UNKNOWN" :icon="Like" color="#F56C6C" plain style="--el-button-bg-color:var(--el-fill-color-blank);--el-button-text-color:var(--el-text-color-regular);--el-button-border-color:var(--el-border-color);" title="点赞" @click="like">{{ data.likes || '点赞' }}</el-button> -->
          <el-button :icon="DocumentCopy" :circle="true" type="primary" size="large" @click="copy"></el-button>
        </div>
      </div>
    </el-card>
  </article>
</template>

<style scoped lang="scss">
@import '@style/constants.scss';

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
    align-items: center;

    & .el-descriptions__label {
      margin-right: 10px;

      // 移动端取消图标与文本的间距
      @media screen {
        @media (max-width: $MIN_MOBILE_WIDTH) {
          margin-right: 0px;
        }
      }
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

    &:deep(.el-card__header) span {
      font-size: medium;
      margin-top: 0px;
      font-weight: 500;
      font-family: none;
    }

    &:deep(.el-card__header) {
      border-bottom: 1px solid var(--el-card-border-color) !important;
      padding-bottom: 15px;
    }

    &:deep(.el-card__body) {
      padding-top: 15px;
    }

    .el-link__inner {
      font-weight: 500 !important;
    }
  }

  .button-group {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 15px;
  }
}
</style>
