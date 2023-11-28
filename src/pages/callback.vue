<script setup lang="ts">
import { useHandleSignInCallback, useLogto } from '@logto/vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserProfile } from '@/api'
import * as consts from '@/consts'

const router = useRouter()
const userStore = useUserStore()
const { fetchUserInfo, getAccessToken } = useLogto()

const { isLoading } = useHandleSignInCallback(async () => {
  const userInfo = await fetchUserInfo()
  if (userInfo) {
    const token = await getAccessToken(consts.resource)
    if (token) {
      getUserProfile(userInfo.sub, token).then(response => {
        userStore.setUserInfo(response.data)
        router.push({ name: 'index' })
      })
    }
  }
})
</script>

<template>
  <el-text v-if="isLoading">Redirecting...</el-text>
</template>
