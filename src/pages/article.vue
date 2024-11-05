<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useHistoryStore } from '@stores/history'
import { User, Clock } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { type IArticle, isLikedStatus, IComment } from '@/types'
import * as api from '@/api'
import Like from '@icons/Like.vue'
import Copy from '@icons/Copy.vue'
import { debounce } from 'lodash'
import { useMobileSize } from '@composables/mobileSize'
import { useTitle } from '@vueuse/core'
import { useLogto } from '@logto/vue'
import { useAccessToken } from '@/composables/accessToken'
import ArticleComments from '@/components/ArticleComments.vue'
import { useUserStore } from '@/stores/user'
import LikeButton from '@components/LikeButton.vue'

/**
 * 评论每页显示个数
 */
const COMMENT_PERPAGE_NUM = 3

const userStore = useUserStore()

const { getAccessToken, isAuthenticated } = useLogto()
const { accessToken } = useAccessToken(getAccessToken)

const siteTitle = useTitle()

const route = useRoute()
const router = useRouter()

const { isMobileSize } = useMobileSize()

const historyStore = useHistoryStore()

/**
 * 控制语句卡片的加载
 */
const loading = ref(true)

/**
 * 语句信息
 */
const data = reactive<IArticle>({ id: route.params.id as string, text: '', uploadTime: '', likes: 0, uploader: '', uploaderId: '' })
const isLiked = ref(isLikedStatus.UNKNOWN)

/**
 * 是否显示 加载更多 按钮
 */
const showLoadMoreBUtton = ref(false)

/**
 * 用户输入的评论文本
 */
const commentInput = ref('')

onBeforeRouteUpdate((to) => {
  data.id = to.params.id as string
  fetchData()
})

async function fetchData() {
  loading.value = true
  api.getArticleById(data.id)
    .then((response) => {
      const result = response.data

      data.text = result.text
      data.uploadTime = result.uploadTime
      data.likes = result.likes

      if (result.uploaderName) {
        data.uploader = result.uploaderName
      } else {
        data.uploader = result.uploader
      }
      data.uploaderId = result.uploader

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

function checkIsLiked() {
  api.isLiked(data.id, accessToken.value).then(() => {
    isLiked.value = isLikedStatus.LIKED
  }).catch(error => {
    if (error.response.status === 404) {
      isLiked.value = isLikedStatus.UNLIKED
    }
  })
}
watch(accessToken, checkIsLiked)

const like = debounce(async () => {
  api.likeArticle(data.id, accessToken.value)
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

const unlike = debounce(async () => {
  api.unlikeArticle(data.id, accessToken.value)
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

/**
 * 评论数据
 */
const comments = reactive<IComment[]>([])

/**
 * '加载更多'按钮的加载状态
 */
const loadMoreloading = ref(false)

const loadComments = (function () {
  let pn = 1
  return debounce(() => {
    loadMoreloading.value = true
    api.getComments(data.id, COMMENT_PERPAGE_NUM, pn)
      .then((response) => {
        response.data.forEach((element: IComment) => {
          comments.push(element)
        })
        if (comments.length === 0 || response.data.length < COMMENT_PERPAGE_NUM) {
          showLoadMoreBUtton.value = false
        } else {
          pn++
          showLoadMoreBUtton.value = true
        }
      })
      .finally(() => {
        loadMoreloading.value = false
      })
  }, 500, { leading: true })
})()
loadComments()

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

const onClickUserCenter = (uid: string = '') => router.push({ name: 'user', params: { id: uid } })
const onClickCommentCardSelect = (cid: string, uid: string) => {
  if (uid === userStore.userInfo.id) {
    let ctext = ''
    let cindex = -1
    comments.forEach((c, index) => {
      if (c.id === cid) {
        ctext = c.content
        cindex = index
      }
    })
    ElMessageBox.confirm(
      ctext.substring(0, 15) + '...',
      '确认删除此评论？',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        api.deleteComment(data.id, cid, accessToken.value).then(() => {
          comments.splice(cindex, 1)
        })
      })
  }
}

const submitButtonLoading = ref(false)
const createComment = () => {
  submitButtonLoading.value = true
  api.createComment(data.id, commentInput.value, accessToken.value)
    .then((response) => {
      comments.push(response.data)
      commentInput.value = ''
    })
    .finally(() => {
      submitButtonLoading.value = false
    })
}
</script>

<template>
  <article class="content">
    <el-card shadow="always" class="content-card">
      <el-skeleton v-if="loading" :throttle="500" :rows="4" animated />
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
            <el-link style="margin-top: -5px;" @click="onClickUserCenter(data.uploaderId)">{{ data.uploader }}</el-link>
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
          <!-- <el-button v-if="isLiked === isLikedStatus.LIKED" style="font-size: large;" :icon="Like" :circle="true" type="danger" size="large" @click="unlike"></el-button> -->
          <!-- <el-button v-else :icon="Like" style="font-size: large;" :circle="true" type="primary" size="large" @click="like"></el-button> -->
          <LikeButton :is-liked="isLiked" @click="() => { if (isLiked === isLikedStatus.LIKED) { unlike() } else if (isLiked === isLikedStatus.UNLIKED) like() }" />
          <el-button :icon="Copy" :circle="true" type="primary" size="large" style="font-size: large;" @click="copy"></el-button>
        </div>
      </div>
    </el-card>
    <template v-if="!loading">
      <ArticleComments :data="comments" class="article-comments" @user-select="onClickUserCenter" @card-select="onClickCommentCardSelect" />
      <el-button v-if="showLoadMoreBUtton" plain :loading="loadMoreloading" @click="loadComments" style="margin-top: 15px;">加载更多</el-button>
      <div v-if="isAuthenticated" style="margin-top: 20px; width: 100%;">
        <el-input v-model="commentInput" :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" placeholder="输入评论..." />
        <el-button type="primary" :loading="submitButtonLoading" style="float: right; margin-top: 10px;" @click="createComment">发表</el-button>
      </div>
    </template>
  </article>
</template>

<style scoped lang="scss">
@import '@style/constants.scss';

.article-comments {
  margin-top: 30px;
  width: 100%;
}

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
        @media (max-width: $MAX_MOBILE_WIDTH) {
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
  margin: 0px 20vw;

  @media screen {
    @media (max-width: 768px) {
      margin: 0px 5vw;
    }

    @media (max-width: 480px) {
      margin: 0px 5px;
    }
  }

  .content-card {
    min-width: 400px;

    @media screen and (max-width: $MAX_MOBILE_WIDTH) {
      min-width: 330px;
    }

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
