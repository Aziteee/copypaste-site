import { ref } from 'vue'
import * as consts from '@/consts'

export function useAccessToken(getAccessToken: (resource?: string) => Promise<string | undefined>) {
  const accessToken = ref('')
  const expired = ref(false)

  if (getAccessToken) {
    getAccessToken(consts.resource)
    .then((value) => {
      if (value !== undefined) {
        accessToken.value = value
        expired.value = false
      } else {
        expired.value = true
      }
    })
  }

  return { accessToken, expired }
}