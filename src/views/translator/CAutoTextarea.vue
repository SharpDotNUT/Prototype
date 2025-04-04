<script setup lang="ts">
import { ref, onMounted, type Ref, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const textareaRef: Ref<any> = ref(null)
const textareaHeight = ref(0)

function resizeTextarea() {
  if (!textareaRef.value) return
  textareaHeight.value = textareaRef.value.scrollHeight
}

function handleInput(e: any) {
  emit('update:modelValue', e.target?.value)
  resizeTextarea()
}

onMounted(() => {
  resizeTextarea()
})

// 暴露原生方法以便通过ref调用
defineExpose({
  resizeTextarea,
  focus: () => textareaRef.value.focus(),
  blur: () => textareaRef.value.blur()
})
</script>
<template>
  <textarea
    class="--textarea"
    ref="textareaRef"
    :value="modelValue"
    :style="{ height: textareaHeight + 'px', resize: 'none' }"
    @input="handleInput"
    v-bind="$attrs"></textarea>
</template>

<style lang="css" scoped>
@import url('./CAutoTextarea.css');
</style>
