<script setup lang="ts">
import { Clock, Upload } from '@element-plus/icons-vue'
import Menu from '@/assets/icons/Menu.vue'
import { useRouter } from 'vue-router'
import SearchBar from '@components/SearchBar.vue'
import HistoryTable from '@components/HistoryTable.vue'
import { ref, h } from 'vue'
import { ElMessageBox, ElMessage, ElInput, ElText } from 'element-plus'
import * as api from '@/api'
import Icon from '@/assets/icons/icon.png'

const router = useRouter()

const drawerShow = ref(false)

function openUploadBox() {
  const inputUploader = ref('')
  const inputText = ref('')
  ElMessageBox({
    title: '上传语句',
    message: () => h('div', null, [
      h(ElText, {
        size: 'small',
        innerHTML: 'Tips: 请勿上传无意义或违规内容'
      }),
      h(ElInput, {
        placeholder: '请输入上传者',
        maxlength: 12,
        showWordLimit: true,
        modelValue: inputUploader.value,
        'onUpdate:modelValue': (val: string) => {
          inputUploader.value = val
        },
        style: 'margin-top:15px'
      }),
      h(ElInput, {
        type: 'textarea',
        placeholder: '请输入文本',
        maxlength: 1000,
        showWordLimit: true,
        modelValue: inputText.value,
        'onUpdate:modelValue': (val: string) => {
          inputText.value = val
        },
        style: 'margin-top:15px'
      })
    ]),
    confirmButtonText: '上传',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        if (!inputText.value || !inputUploader.value) {
          ElMessage.warning('字段不能为空')
          return
        }
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '上传中...'
        api.uploadArticle({
          text: inputText.value,
          uploader: inputUploader.value
        })
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
</script>

<template>
  <el-header class="container">
    <div class="header-section">
      <div style="display: flex; align-items: center; cursor: pointer;" @click="() => { router.replace({ path: '/' }) }">
        <img :src="Icon" style="height: 30px; width: 30px;" />
        <el-text style="margin-left: 5px; font-size: medium; font-weight: 600;">复制粘贴语录</el-text>
      </div>
      <el-space size="large" class="menu-section desktop">
        <search-bar class="search-box" />
        <el-popover trigger="click" width="206px">
          <template #reference>
            <el-button :icon="Clock" :circle="true" />
          </template>
          <history-table max-height="300px" line-clamp="2" />
        </el-popover>
        <el-button :icon="Upload" :circle="true" @click="openUploadBox" />
      </el-space>
      <el-icon size="24" @click="() => { drawerShow = true }" class="mobile">
        <Menu />
      </el-icon>
    </div>
  </el-header>
  <el-drawer v-model="drawerShow" :with-header="false" size="80%">
    <search-bar />
    <history-table @cell-clicked="() => { drawerShow = false }" max-height="calc(100% - 50px)" class="mobile-table" line-clamp="1" />
  </el-drawer>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';
@import '@style/constants.scss';

.container {
  border-bottom: 1px solid var(--el-border-color);

  .header-section {
    @include overspread;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .menu-section {
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

@media screen and (max-width: $MIN_MOBILE_WIDTH) {
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }
}
</style>
