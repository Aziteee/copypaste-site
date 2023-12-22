import { defineStore } from 'pinia'
import { watch, reactive } from 'vue'
import { type IUserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  const emptyUserInfo = {
    id: '',
    name: '',
    avatar: '',
    sign: ''
  }

  const userInfo = reactive<IUserInfo>(emptyUserInfo)

  function setUserInfo(data: any) {
    if (data.sub) userInfo.id = data.sub
    if (data.id) userInfo.id = data.id
    if (data.name) userInfo.name = data.name
    if (data.sign) userInfo.sign = data.sign
    if (data.avatar || data.avatar === '') userInfo.avatar = data.avatar
    if (data.picture || data.picture === '') userInfo.avatar = data.picture
  }

  function clearUserInfo() {
    userInfo.id = ''
    userInfo.name = ''
    userInfo.avatar = ''
    userInfo.sign = ''
  }

  return { userInfo, clearUserInfo, setUserInfo }
})
