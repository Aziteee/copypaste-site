<script setup lang="ts">
const props = defineProps<{text: string}>()

interface ITextTemplate {
  text: string,
  tag: string
}

const textFragments:ITextTemplate[] = []

const highlightPreTag = '<ais-highlight-0000000000>'
const highlightPostTag = '</ais-highlight-0000000000>'

const splitedText = props.text.split(highlightPreTag)
for (const item of splitedText) {
  if (!item.includes(highlightPostTag)) {
    textFragments.push({
      text: item,
      tag: 'span'
    })
  } else if (item.endsWith(highlightPostTag)) {
    textFragments.push({
      text: item.split(highlightPostTag)[0],
      tag: 'mark'
    })
  } else {
    textFragments.push({
      text: item.split(highlightPostTag)[0],
      tag: 'mark'
    })
    textFragments.push({
      text: item.split(highlightPostTag)[1],
      tag: 'span'
    })
  }
}
</script>

<template>
  <div>
    <template v-for="(item, index) of textFragments" :key="index">
    <el-text :tag="item.tag">{{ item.text }}</el-text>
  </template>
  </div>
</template>
