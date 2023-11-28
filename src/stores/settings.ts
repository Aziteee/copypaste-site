import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore('settings', () => {
  const showUserCenterTips = ref(true)

  return { showUserCenterTips }
})
