import { useWindowSize } from "@vueuse/core"
import { computed } from "vue"
import { maxMobileWidth } from '@/consts'

const { width } = useWindowSize()

export function useMobileSize() {
  const isMobileSize = computed(() => width.value < maxMobileWidth)
  return { isMobileSize }
}
