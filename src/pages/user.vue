<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'
import Like from '@/assets/icons/Like.vue'
import { Upload, Tickets, Delete } from '@element-plus/icons-vue'
import ArticleList from '@/components/ArticleList.vue'
import { computed, reactive, ref, toRefs } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useLogto } from '@logto/vue'
import * as api from '@/api'
import { IArticle, type IUserInfo } from '@/types'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTitle } from '@vueuse/core'
import { useAccessToken } from '@/composables/accessToken'
import BannerCard from '@/components/BannerCard.vue'
import { useSettingsStore } from '@/stores/settings'
import EditableText from '@/components/EditableText.vue'

const settingsStore = useSettingsStore()

const ARTICLE_LIST_PERPAGE_NUM = 5

const siteTitle = useTitle()

const { isAuthenticated, getAccessToken } = useLogto()
const { accessToken } = useAccessToken(getAccessToken)
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const loadingProfile = ref(true)

const userProfile = reactive<IUserInfo & { likesNum: number, uploadsNum: number }>({
  id: route.params.id as string,
  name: '',
  avatar: '',
  sign: '',
  likesNum: 0,
  uploadsNum: 0
})
const userUploads = reactive<IArticle[]>([])
const userLikes = reactive<IArticle[]>([])
const isMe = computed(() => userProfile.id === userStore.userInfo.id && isAuthenticated.value)
const selectedTab = ref(0)

// const sign = ref(userProfile.sign)

/**
 * 语句页面是否显示'加载更多'按钮
 */
const showUploadsLoadMoreButton = ref(false)
/**
 * 喜爱页面是否显示'加载更多'按钮
 */
const showLikesLoadMoreButton = ref(false)

/**
 * '加载更多'按钮的加载状态
 */
const loadMoreButtonLoading = ref(false)

onBeforeRouteUpdate((to) => {
  userProfile.id = to.params.id as string
  userUploads.length = 0
  userLikes.length = 0
  fetchUserData()
})

async function fetchUserData() {
  loadingProfile.value = true

  api.getUserProfile(userProfile.id).then(response => {
    const result = response.data
    userProfile.name = result.name
    userProfile.avatar = result.avatar
    userProfile.sign = result.sign
    userProfile.likesNum = result.likesNum
    userProfile.uploadsNum = result.uploadsNum
    loadingProfile.value = false

    siteTitle.value = `${userProfile.name}的个人主页 | 复制粘贴语录`
  })
}
fetchUserData()

const loadUploads = (() => {
  let pn = 1
  return () => {
    loadMoreButtonLoading.value = true
    api.getUserUploads(userProfile.id, ARTICLE_LIST_PERPAGE_NUM, pn)
      .then(response => {
        response.data.forEach((element: IArticle) => {
          userUploads.push(element)
        })
        if (userUploads.length === 0 || response.data.length < ARTICLE_LIST_PERPAGE_NUM) {
          showUploadsLoadMoreButton.value = false
        } else {
          pn++
          showUploadsLoadMoreButton.value = true
        }
      })
      .finally(() => {
        loadMoreButtonLoading.value = false
      })
  }
})()
loadUploads()

const loadLikes = (() => {
  let pn = 1
  return () => {
    loadMoreButtonLoading.value = true
    api.getUserLikes(userProfile.id, ARTICLE_LIST_PERPAGE_NUM, pn)
      .then(response => {
        response.data.forEach((element: IArticle) => {
          userLikes.push(element)
        })
        if (userUploads.length === 0 || response.data.length < ARTICLE_LIST_PERPAGE_NUM) {
          showLikesLoadMoreButton.value = false
        } else {
          pn++
          showLikesLoadMoreButton.value = true
        }
      })
      .finally(() => {
        loadMoreButtonLoading.value = false
      })
  }
})()

function showUploads() {
  selectedTab.value = 0
}

function showLikes() {
  selectedTab.value = 1
  if (userLikes.length === 0) {
    loadLikes()
  }
}

function handleSelect(id: string, event: any) {
  if (!['i', 'svg', 'path'].includes((event.target as Element).tagName)) {
    router.push({ name: 'article', params: { id } })
  }
}

function changeSign() {
  api.patchUserProfile(userProfile.id, { sign: userProfile.sign }, accessToken.value).then((response) => {
    userStore.userInfo.sign = userProfile.sign
  })
}

function openEditNameBox() {
  if (isMe.value) {
    ElMessageBox.prompt('请输入您的新名称', '修改名称', {
      confirmButtonText: '提交',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        if (value.length > 10) {
          ElMessage.error('名称不得超过10字')
        } else {
          api.patchUserProfile(userProfile.id, { name: value }, accessToken.value).then((response) => {
            userStore.userInfo.name = value
            userProfile.name = value
          })
        }
      })
  }
}

function openEditAvatarBox() {
  if (isMe.value) {
    ElMessageBox.prompt('请输入您的QQ号以获取QQ头像（或输入图片的远程地址）', '修改头像', {
      confirmButtonText: '提交',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        if (!value.startsWith('http')) {
          value = `https://q1.qlogo.cn/g?b=qq&nk=${value}&s=100`
        }
        api.patchUserProfile(userProfile.id, { avatar: value }, accessToken.value).then((response) => {
          userStore.userInfo.avatar = value
          userProfile.avatar = value
        })
      })
  }
}

async function onClickDeleteArticle(id: string) {
  api.deleteArticle(id, accessToken.value)
    .then((response) => {
      if (response.status === 201) {
        for (const index in userUploads) {
          if (userUploads[index].id === id) {
            userUploads.splice(Number(index), 1)
            break
          }
        }
      }
    })
}
</script>

<template>
  <div class="container">
    <BannerCard v-if="isMe && settingsStore.showUserCenterTips" content="Tips: 点击头像或名字即可修改内容~" :show-close="true" @close="() => settingsStore.showUserCenterTips = false" />
    <el-card>
      <el-skeleton :loading="loadingProfile" animated>
        <template #default>
          <div class="basic-info-container">
            <div class="avatar-container">
              <UserAvatar :size="70" :src="userProfile.avatar" :hover-shadow="isMe" @click="openEditAvatarBox" />
            </div>
            <div class="info-container">
              <div class="name-editor-container" :class="{ 'show-dashed-border': isMe }" @click="openEditNameBox">
                <span style="font-size: 20px; font-weight: bold; white-space: nowrap; text-overflow: ellipsis;">{{ userProfile.name }}</span>
              </div>
              <div class="social-info-container">
                <div class="number-container">
                  <el-icon>
                    <Like />
                  </el-icon>
                  <span style="margin-left: 3px;">{{ userProfile.likesNum }}</span>
                </div>
                <div class="number-container" style="margin-left: 15px;">
                  <el-icon>
                    <Upload />
                  </el-icon>
                  <span style="margin-left: 3px;">{{ userProfile.uploadsNum }}</span>
                </div>
              </div>
              <div class="sign-container">
                <EditableText v-model="userProfile.sign" @text-changed="changeSign" placeholder="编辑个性签名..." />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-card>
    <!-- <el-card> -->
    <div class="articles-list-container">
      <div class="tabs">
        <el-button :icon="Tickets" type="primary" :plain="selectedTab !== 0" :round="true" @click="showUploads">语句</el-button>
        <el-button :icon="Like" type="primary" :plain="selectedTab !== 1" :round="true" @click="showLikes">喜爱</el-button>
      </div>
      <el-empty v-if="selectedTab === 0 ? userUploads.length === 0 : userLikes.length === 0" description="空空如也"></el-empty>
      <template v-else>
        <ArticleList class="articles-list" @article-selected="handleSelect" :data="selectedTab === 0 ? userUploads : userLikes" :show-likes="true" :line-clamp="3">
          <template #operation="slotProps">
            <el-popconfirm v-if="isMe && selectedTab === 0" title="确认删除?" @confirm="onClickDeleteArticle(slotProps.id)">
              <template #reference>
                <el-icon size="small" style="cursor: pointer;">
                  <Delete />
                </el-icon>
              </template>
            </el-popconfirm>
          </template>
        </ArticleList>
        <el-button
                   v-if="selectedTab ? showLikesLoadMoreButton : showUploadsLoadMoreButton"
                   plain
                   :loading="loadMoreButtonLoading"
                   @click="selectedTab ? loadLikes() : loadUploads()">
          加载更多
        </el-button>
      </template>
    </div>
    <!-- </el-card> -->
  </div>
</template>

<style scoped lang="scss">
.articles-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;

  .tabs {
    display: flex;
    justify-content: center;

    &:deep(.is-plain) {
      border-color: var(--el-border-color-light);
    }
  }

  .articles-list {
    margin-top: 15px;
    width: 100%;
    // padding: 0 10px;
  }
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 5px;

  .sign-container {
    margin-left: 5px;
  }

  .social-info-container {
    display: flex;
    margin-left: 15px;

    .number-container {
      display: flex;
      align-items: center;
    }
  }

  .name-editor-container {
    display: flex;
    align-items: center;
    height: 35px;

    & span {
      margin: 15px;
    }
  }

  .show-dashed-border {
    border: 1px dashed transparent;
    border-radius: 20px;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.basic-info-container {
  display: flex;
  margin: 0px 20px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;

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
</style>
