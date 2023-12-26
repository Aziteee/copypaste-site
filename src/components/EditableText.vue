<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  editable?: boolean
  textSize?: string
}>(), {
  placeholder: '',
  editable: true
})
const emit = defineEmits(['update:modelValue', 'textChanged'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const { textSize } = toRefs(props)
const status = ref(0)
</script>

<template>
  <el-text v-if="!props.editable" :class="{ 'custom-text-size': textSize }" style="margin-left: 10px;">{{ props.modelValue }}</el-text>
  <el-input
            v-else
            :class="{
              input__default: status === 0,
              input__hover: status === 1,
              'custom-text-size': textSize
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

.custom-text-size {
  font-size: v-bind(textSize);

  &:deep(.el-input__inner) {
    font-size: v-bind(textSize);
  }
}
</style>
