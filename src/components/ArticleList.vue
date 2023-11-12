<script setup lang="ts">
import { IArticle } from '@/types'
import ArticleCard from '@components/ArticleCard.vue'

const props = withDefaults(defineProps<{
  data: IArticle[],
  title?: string,
  showLikes?: boolean,
  lineClamp?: number
}>(), {
  showLikes: true
})
</script>

<template>
  <div class="container">
    <h2 v-if="props.title" class="title">{{ props.title }}</h2>
    <div class="cards">
      <article-card v-for="item in props.data" :key="item.text" :text="item.text" :line-clamp="props.lineClamp"
        @click="$emit('article-selected', item.id)" :id="item.id" :likes="props.showLikes ? item.likes : undefined" />
    </div>
  </div>
</template>

<style scoped lang="scss">

.container {
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
