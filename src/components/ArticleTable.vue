<script setup lang="ts">
import { IArticle } from '@/types'
import ArticleCard from '@components/ArticleCard.vue'

const props = defineProps<{
  data: IArticle[],
  title?: string
}>()
</script>

<template>
  <section class="container">
    <h2 v-if="props.title" class="title">{{ props.title }}</h2>
    <div class="cards">
      <article-card v-for="item in props.data" :key="item.text" :text="item.text"
        @click="$emit('article-selected', item.id)" class="card" :id="item.id" :show-more-button="false" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@style/constants.scss';

.container {
  width: 1200px;
  margin: 20px auto;
  padding: 0 10px;
  column-count: 5;
  -moz-column-gap: 40px;
  -webkit-column-gap: 40px;
  column-gap: 40px;
  display: flex;
  flex-direction: column;

  @media screen {
    @media (max-width: 1200px) {
      column-count: 3;
      width: calc(100% - 40px);
      box-sizing: border-box;
      padding: 20px 20px 20px 0;
    }
    @media (max-width: 768px) {
      column-count: 2;
    }
    @media (max-width: 480px) {
      column-count: 1;
    }
  }

  .card {
    width: 100%;
    margin: 0 0 20px;
    padding: 10px;
    overflow: hidden;
    break-inside: avoid;
  }
}
</style>
