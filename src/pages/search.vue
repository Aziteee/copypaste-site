<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { IAPIQueryParams, IArticle } from '@/types'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import ArticleTable from '@components/ArticleTable.vue'
import { useMobileSize } from '@composables/mobileSize'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const { isMobileSize } = useMobileSize()

const loading = ref(true)
const data = ref<IArticle[]>([])

// 分页相关数据
const total = ref(0)
const pp = ref(10)
const pagerCount = computed(() => isMobileSize.value ? 4 : 7) // 移动端最多显示4个页码
const layout = computed(() => `prev,pager,next${isMobileSize.value ? '' : ',jumper'}`) // 移动端不显示跳转页面

const page = ref<number>(Number(route.query.pn) || 1)
watch(page, (value) => {
  const { ...query } = route.query
  router.replace({ query: { ...query, pn: value.toString() } })
})

onBeforeRouteUpdate((to) => {
  page.value = Number(to.query.pn) || 1
  fetchData(to.query)
})

function handleSelect(id: string) {
  router.push({ name: 'article', params: { id } })
}

function fetchData(query: IAPIQueryParams) {
  loading.value = true
  api.getSearchResults(query)
    .then((response) => {
      data.value = response.data
      pp.value = data.value.length
      total.value = Number(response.headers.total)
      loading.value = false
    })
    .catch(_error => {
      data.value = []
      pp.value = 0
      total.value = 0
      loading.value = false
    })
}
fetchData(route.query)
</script>

<template>
  <el-skeleton v-if="loading" :rows="5" animated />
  <el-empty v-if="!loading && total === 0" description="空空如也" />
  <template v-if="!loading">
    <article-table :data="data" @article-selected="handleSelect" />
    <el-pagination v-model:current-page="page" :layout="layout" :page-size="pp" :pager-count="pagerCount" :total="total"
                   class="pagination" />
  </template>
</template>

<style scoped lang="scss">
.pagination {
  margin-top: 20px
}
</style>
