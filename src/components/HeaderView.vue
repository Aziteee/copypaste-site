<script setup lang="ts">
import { UserFilled, Search } from '@element-plus/icons-vue'
import Menu from '@/assets/icons/Menu.vue'
import { useRouter } from 'vue-router'
// import HistoryTable from '@components/HistoryTable.vue'
import UserAvatar from './UserAvatar.vue'
import { ref, h } from 'vue'
import { ElMessageBox, ElMessage, ElInput, ElText } from 'element-plus'
import * as api from '@/api'
import Logo from '@/assets/icons/logo.png'
import { useLogto } from '@logto/vue'
import Upload from '@/assets/icons/Upload.vue'
import SignOut from '@/assets/icons/SignOut.vue'
import { useUserStore } from '@/stores/user'
import * as consts from '@/consts'
import { useAccessToken } from '@/composables/accessToken'
import { debounce } from 'lodash'

const userStore = useUserStore()

const { signIn, isAuthenticated, signOut, getAccessToken } = useLogto()
const { accessToken } = useAccessToken(getAccessToken)
const router = useRouter()

const drawerShow = ref(false)

const searchInput = ref('')

const onClickSignIn = () => signIn(consts.redirectUrl)
const onClickSignOut = () => {
  userStore.clearUserInfo()
  signOut(consts.baseUrl)
}
const onClickUserCenter = () => {
  drawerShow.value = false
  router.push({ name: 'user', params: { id: userStore.userInfo.id } })
}

function openUploadBox() {
  const inputText = ref('')
  drawerShow.value = false
  ElMessageBox({
    title: '上传语句',
    message: () => h('div', null, [
      h(ElText, {
        size: 'small'
      }, 'Tips: 请勿上传无意义或违规内容'),
      h(ElInput, {
        type: 'textarea',
        placeholder: '请输入文本',
        maxlength: 1000,
        autosize: { minRows: 3, maxRows: 10 },
        showWordLimit: true,
        modelValue: inputText.value,
        'onUpdate:modelValue': (val: string) => {
          inputText.value = val
        },
        style: 'margin-top:15px;'
      })
    ]),
    confirmButtonText: '上传',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        if (!inputText.value) {
          ElMessage.warning('字段不能为空')
          return
        }
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '上传中...'
        api.uploadArticle({
          text: inputText.value
        }, accessToken.value)
          .then((response) => {
            done()
            ElMessage.success('上传成功')
            router.push({ name: 'article', params: { id: response.data.id } })
          })
          .catch((_error) => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '上传'
          })
      } else {
        done()
      }
    }
  })
}

const onClickSearch = debounce(() => {
  router.push({ name: 'search', query: { q: searchInput.value, pp: consts.perPageNum, pn: 1 } })
}, 300, {
  leading: true,
  trailing: false
})
</script>

<template>
  <div>
    <el-header height="80px" class="container">
      <div class="header-section">
        <div title="首页" style="display: flex; align-items: center; cursor: pointer; overflow: hidden;" @click="() => { router.replace({ path: '/' }) }">
          <img :src="Logo" class="logo-img" />
        </div>
        <el-space size="large" class="menu-section desktop">
          <el-input class="search-box" v-model="searchInput" placeholder="搜索..." :prefix-icon="Search" @keyup.enter="onClickSearch"></el-input>
          <el-popover v-if="isAuthenticated" trigger="click" width="150px">
            <template #reference>
              <UserAvatar class="avatar" :src="userStore.userInfo.avatar" :hover-shadow="true" />
            </template>
            <div class="item-list">
              <div class="item" @click="onClickUserCenter">
                <el-icon :size="18">
                  <UserFilled />
                </el-icon>
                <span style="font-size: 13px;">个人中心</span>
              </div>
              <div class="item" @click="openUploadBox">
                <el-icon :size="18">
                  <Upload />
                </el-icon>
                <span style="font-size: 13px;">上传语句</span>
              </div>
              <el-divider style="margin: 7px 0px;"></el-divider>
              <div class="item" @click="onClickSignOut">
                <el-icon :size="17" style="margin-top: 4px;">
                  <SignOut />
                </el-icon>
                <span style="font-size: 13px;">退出登录</span>
              </div>
            </div>
          </el-popover>
          <el-button v-else :icon="UserFilled" type="primary" :round="true" @click="onClickSignIn">登录</el-button>
        </el-space>
        <el-icon size="24" @click="() => { drawerShow = true }" class="mobile" style="margin-right: 15px;">
          <Menu />
        </el-icon>
      </div>
    </el-header>
    <el-drawer v-model="drawerShow" :with-header="false" size="80%">
      <div class="mobile-drawer">
        <div class="profile-container" @click="() => isAuthenticated ? onClickUserCenter() : onClickSignIn()">
          <template v-if="isAuthenticated">
            <UserAvatar class="avatar" :src="userStore.userInfo.avatar" :size="70" />
            <span style="font-size: 18px;">{{ isAuthenticated ? userStore.userInfo.name : '未登录' }}</span>
          </template>
          <el-button v-else :icon="UserFilled" type="primary" :round="true" @click="onClickSignIn">登录</el-button>
        </div>
        <div v-if="isAuthenticated" class="item-list">
          <div class="item" @click="onClickUserCenter">
            <el-icon :size="18">
              <UserFilled />
            </el-icon>
            <span style="font-size: 13px;">个人中心</span>
          </div>
          <div class="item" @click="openUploadBox">
            <el-icon :size="18">
              <Upload />
            </el-icon>
            <span style="font-size: 13px;">上传语句</span>
          </div>
          <el-divider style="margin: 7px 0px;"></el-divider>
          <div class="item" @click="onClickSignOut">
            <el-icon :size="17" style="margin-top: 4px;">
              <SignOut />
            </el-icon>
            <span style="font-size: 13px;">退出登录</span>
          </div>
        </div>
        <div class="search-bar">
          <el-input v-model="searchInput" placeholder="输入关键词" :prefix-icon="Search" @keyup.enter="onClickSearch"></el-input>
          <el-button type="primary" @click="onClickSearch">搜索</el-button>
        </div>
      </div>
      <!-- <HistoryTable @cell-clicked="() => { drawerShow = false }" max-height="calc(100% - 50px)" class="mobile-table" line-clamp="1" /> -->
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';
@import '@style/constants.scss';

.mobile-drawer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 20px 0;
  }

  .item-list {
    width: 100%;
    margin: 0 20px;
  }

  .search-bar {
    margin-top: 20px;
    width: 100%;
    display: flex;
    gap: 5px;
  }
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 3px;

  .item {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 7px;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: var(--el-color-primary-light-9);
    }
  }
}

.container {
  // border-bottom: 1px solid var(--el-border-color);
  // box-shadow: var(--el-box-shadow-light);

  .header-section {
    @include overspread;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo-img {
      @include img-dye(var(--el-text-color-primary));
      height: 40px;
      margin-left: 10px;
    }

    .menu-section {
      margin-right: 10px;

      .search-box {
        width: 25vw;
        min-width: 230px;
        max-width: 500px;
      }
    }
  }
}

.mobile {
  display: none;
}

.mobile-table {
  margin-top: 15px;
}

@media screen and (max-width: $MAX_MOBILE_WIDTH) {
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }
}
</style>
