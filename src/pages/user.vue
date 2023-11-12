<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'
import Like from '@/assets/icons/Like.vue'
import { Upload } from '@element-plus/icons-vue'
import ArticleList from '@/components/ArticleList.vue'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useLogto } from '@logto/vue'
import * as api from '@/api'
import { IArticle, type IUserInfo } from '@/types'
import { ElMessageBox, ElMessage } from 'element-plus'

const { isAuthenticated, getAccessToken } = useLogto()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const loadingProfile = ref(true)
const loadingList = ref(true)

const userProfile = reactive<IUserInfo & { likesNum: number, uploadsNum: number }>({
  id: route.params.id as string,
  name: '',
  avatar: '',
  likesNum: 0,
  uploadsNum: 0
})
const userUploads = reactive<IArticle[]>([])
const userLikes = reactive<IArticle[]>([])
const isMe = computed(() => userProfile.id === userStore.userInfo.id && isAuthenticated.value)
const selectedTab = ref(0)

onBeforeRouteUpdate((to) => {
  userProfile.id = to.params.id as string
  userUploads.length = 0
  userLikes.length = 0
  fetchData()
})

async function fetchData() {
  loadingProfile.value = true
  loadingList.value = true

  api.getUserProfile(userProfile.id).then(response => {
    const result = response.data
    userProfile.name = result.name
    userProfile.avatar = result.avatar
    userProfile.likesNum = result.likesNum
    userProfile.uploadsNum = result.uploadsNum
    loadingProfile.value = false
  })

  api.getUserUploads(userProfile.id).then(response => {
    response.data.forEach((element: IArticle) => {
      userUploads.push(element)
    })
    loadingList.value = false
  })
}
fetchData()

function showUploads() {
  selectedTab.value = 0
}

function showLikes() {
  selectedTab.value = 1
  if (userLikes.length === 0) {
    loadingList.value = true
    api.getUserLikes(userProfile.id).then(response => {
      response.data.forEach((element: IArticle) => {
        userLikes.push(element)
      })
      loadingList.value = false
    })
  }
}

function handleSelect(id: string) {
  router.push({ name: 'article', params: { id } })
}

function openEditNameBox() {
  if (isMe.value) {
    ElMessageBox.prompt('请输入您的新名称', '修改名称', {
      confirmButtonText: '提交',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        if (value.length > 12) {
          ElMessage.error('名称不得超过12字')
        } else {
          api.patchUserProfile(userProfile.id, { name: value }, (await getAccessToken('https://cp.azite.cn/api')) as string).then((response) => {
            userStore.userInfo.name = value
            userProfile.name = value
          })
        }
      })
  }
}

function openEditAvatarBox() {
  if (isMe.value) {
    ElMessageBox.prompt('请输入您的QQ号以获取QQ头像', '修改头像', {
      confirmButtonText: '提交',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        value = `http://q1.qlogo.cn/g?b=qq&nk=${value}&s=100`
        api.patchUserProfile(userProfile.id, { avatar: value }, (await getAccessToken('https://cp.azite.cn/api')) as string).then((response) => {
          userStore.userInfo.avatar = value
          userProfile.avatar = value
        })
      })
  }
}
</script>

<template>
  <div class="container">
    <el-card>
      <el-skeleton :loading="loadingProfile">
        <template #default>
          <div class="basic-info-container">
            <div class="avatar-container">
              <UserAvatar :size="70" :src="userProfile.avatar" :hover-shadow="isMe" @click="openEditAvatarBox" />
            </div>
            <div class="info-container">
              <div class="name-editor-container" :class="{ 'show-dashed-border': isMe }" @click="openEditNameBox">
                <span style="font-size: 20px; font-weight: bold;">{{ userProfile.name }}</span>
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
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-card>
    <!-- <el-card> -->
      <div class="articles-list-container">
        <div class="tabs">
          <el-button :icon="Upload" type="primary" :plain="selectedTab !== 0" :round="true" @click="showUploads">语句</el-button>
          <el-button :icon="Like" type="primary" :plain="selectedTab !== 1" :round="true" @click="showLikes">喜爱</el-button>
        </div>
        <el-skeleton :loading="loadingList" :throttle="500">
          <template #default>
            <el-empty v-if="selectedTab === 0 ? userUploads.length === 0 : userLikes.length === 0" description="空空如也"></el-empty>
            <ArticleList v-else class="articles-list" @article-selected="handleSelect" :data="selectedTab === 0 ? userUploads : userLikes" :show-likes="false" :line-clamp="3" />
          </template>
        </el-skeleton>
      </div>
    <!-- </el-card> -->
  </div>
</template>

<style scoped lang="scss">
.articles-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;

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

  .social-info-container {
    display: flex;
    margin-top: 5px;
    margin-left: 15px;

    .number-container {
      display: flex;
      align-items: center;
    }
  }

  .name-editor-container {
    display: flex;
    align-items: center;
    height: 40px;

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

  margin-left: 20px;
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
