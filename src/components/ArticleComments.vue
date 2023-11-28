<script setup lang="ts">
import { IComment } from '@/types'
import UserAvatar from '@/components/UserAvatar.vue'

const props = withDefaults(defineProps<{
  data: IComment[],

  /**
   * 当data.length===0时显示空状态
   */
  showEmpty?: boolean
}>(), {
  showEmpty: true
})

const emit = defineEmits<{
  (e: 'userSelect', uid: string): void
  (e: 'cardSelect', cid: string, uid: string): void
}>()

function onClickCard(event: any, cid: string, uid: string) {
  if (event.target.className !== 'comment-username' && event.target.tagName !== 'IMG') {
    emit('cardSelect', cid, uid)
  }
}
</script>

<template>
  <div class="comment-container">
    <transition-group name="list">
      <el-card v-for="item in props.data" :key="item.id" shadow="always" class="comment-card" @click="onClickCard($event, item.id, item.uid)">
        <div class="comment-card-container">
          <div class="comment-card-left">
            <UserAvatar :size="40" :src="item.avatar" @click="$emit('userSelect', item.uid)" />
          </div>
          <div class="comment-card-right">
            <div class="comment-card-right-top">
              <span class="comment-username" style="cursor: pointer;" @click="$emit('userSelect', item.uid)">{{ item.name }}</span>
              <span style="color: #C0C4CC; font-size: small;">{{ item.time }}</span>
            </div>
            <div class="comment-card-right-bottom">
              <el-text>{{ item.content }}</el-text>
            </div>
          </div>
        </div>
      </el-card>
    </transition-group>
  </div>
</template>

<style scoped lang="scss">
@import '@style/constants.scss';

.comment-container {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .comment-card:hover {
    background-color: var(--el-color-primary-light-9);
  }

  .comment-card-container {
    display: flex;
    margin: 0 15px;

    @media screen {
      @media (max-width: $MAX_MOBILE_WIDTH) {
        margin: 0 5px;
      }
    }

    .comment-card-right {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-left: 10px;
      flex-grow: 1;

      .comment-card-right-top {
        display: flex;
        justify-content: space-between;
        align-items: last baseline;
      }
    }
  }
}
</style>
