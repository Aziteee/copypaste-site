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
      <transition-group name="list">
        <ArticleCard v-for="item in props.data" :key="item.id" :text="item.text" :line-clamp="props.lineClamp"
                      @click="$emit('article-selected', item.id, $event)" :id="item.id" :likes="props.showLikes ? item.likes : undefined">
          <template #operation>
            <slot name="operation" :id="item.id"></slot>
          </template>
        </ArticleCard>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@style/mixins.scss';
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
