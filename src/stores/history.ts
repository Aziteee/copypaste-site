import { defineStore } from 'pinia'
import { watch, reactive } from 'vue'
import { type IHistory } from '@/types'

export const useHistoryStore = defineStore('history', () => {
  const history = reactive<IHistory[]>([])

  function add(data: IHistory) {
    history.forEach((item, index) => {
      if (item.id === data.id) {
        history.splice(Number(index), 1)
      }
    })
    history.unshift(data)
  }

  function clear() {
    history.length = 0
  }

  // 监测到history长度大于100时去除后面的数据
  watch(history, (value) => {
    if (value.length > 100) history.splice(100, value.length - 100)
  })

  return { history, add, clear }
})
