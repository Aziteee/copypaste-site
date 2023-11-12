<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue'
import { type IAPISearchParams, type IArticle } from '@/types'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import ArticleTable from '@components/ArticleTable.vue'
import { useMobileSize } from '@composables/mobileSize'
import * as api from '@/api'
import { useTitle } from '@vueuse/core'
import ArticleList from '@/components/ArticleList.vue'

const siteTitle = useTitle()

const route = useRoute()
const router = useRouter()

const { isMobileSize } = useMobileSize()

const data = ref<IArticle[]>([])

const defaultPP = inject('default_pp')
const loading = ref(true)

// 分页相关数据
const total = ref(0)
const pp = ref(Number(route.query.pp ?? defaultPP))
const pagerCount = computed(() => isMobileSize.value ? 4 : 7) // 移动端最多显示4个页码
const layout = computed(() => `prev,pager,next${isMobileSize.value ? '' : ',jumper'}`) // 移动端不显示跳转页面

const title = computed(() => {
  const q = String(route.query.q)
  const reg = /^uploader:(.+)$/
  if (reg.test(q)) {
    return `上传者“${(q.match(reg) as string[])[1]}”的全部语句`
  } else {
    return `“${q.length <= 15 ? q : q.substring(0, 12) + '...'}”的搜索结果`
  }
})
siteTitle.value = title.value + ' | 复制粘贴语录'

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

function fetchData(query: IAPISearchParams) {
  const errorHandler = () => {
    data.value = []
    pp.value = 0
    total.value = 0
    loading.value = false
  }
  if (/uploader:|uploadTime:|likes:/.test(query.q ?? '')) {
    api.getSearchResults(query)
      .then((response) => {
        data.value = response.data
        total.value = Number(response.headers.total)
        loading.value = false
      })
      .catch(errorHandler)
  } else {
    api.searchArticles(query)
      .then((response) => {
        data.value = response.data.data
        total.value = Number(response.data.total)
        loading.value = false
      })
      .catch(errorHandler)
  }
}
fetchData(route.query)
</script>

<template>
  <el-skeleton v-if="loading" :rows="5" animated />
  <template v-if="!loading">
    <ArticleList class="article-table" :title="title" :data="data" :show-likes="false" @article-selected="handleSelect" />
    <el-pagination v-if="data.length != 0" v-model:current-page="page" :layout="layout" :page-size="pp" :pager-count="pagerCount" :total="total"
                   class="pagination" />
    <el-empty v-if="data.length === 0" description="空空如也" />
  </template>
</template>

<style scoped lang="scss">
@import '@style/constants.scss';

.pagination {
  margin-top: 20px
}

.article-table {
  margin: 10px 10vw;

  @media screen {
    @media (max-width: $MIN_MOBILE_WIDTH) {
      margin: 10px 10px;
      margin-top: -10px;
      margin-bottom: 0px;
    }
  }
}
</style>
