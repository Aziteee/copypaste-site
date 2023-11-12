import { useWindowSize } from "@vueuse/core"
import { computed } from "vue"

const { width } = useWindowSize()

export function useMobileSize () {
  const isMobileSize = computed(() => width.value < 768)
  return { isMobileSize }
}
