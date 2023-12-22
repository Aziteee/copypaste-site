<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps(['modelValue', 'placeholder'])
const emit = defineEmits(['update:modelValue', 'textChanged'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const status = ref(0)
</script>

<template>
  <el-input
            :class="{
              input__default: status === 0,
              input__hover: status === 1
            }"
            type="text"
            :placeholder="props.placeholder"
            max-length="25"
            v-model="value"
            @mouseover="status = 1"
            @mouseout="status === 2 || (status = 0)"
            @blur="status = 0; $emit('textChanged')"
            @mousedown="status = 2"
            @keyup.enter="status = 0; $event.target.blur()" />
</template>

<style scoped lang="scss">
.input__default {
  box-shadow: none;

  &:deep(.el-input__wrapper) {
    box-shadow: none;
  }
}

.input__hover {
  box-shadow: none;
}
</style>
