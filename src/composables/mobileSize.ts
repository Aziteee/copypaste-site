import { useWindowSize } from "@vueuse/core"
import { computed, ref } from "vue"
import { maxMobileWidth } from '@/consts'

const { width } = useWindowSize()

export function useMobileSize() {
  const isMobileSize = computed(() => width.value < maxMobileWidth)
  return {
    isMobileSize
  }
}
