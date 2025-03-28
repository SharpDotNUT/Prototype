<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import { filesize } from 'filesize'

const props = defineProps({
  progress: Array as PropType<
    { name: string; loaded: number; total: number; done: boolean }[]
  >
})

const show = ref(true)
</script>

<template>
  <var-dialog v-model:show="show" :confirm-button="false">
    <template #title>获取资源</template>
    <p>正在获取必要的资源</p>
    <var-cell border v-for="file in props.progress">
      <p style="font-weight: bold">{{ file.name }}</p>
      <p>
        <span>{{ filesize(file.loaded) }}</span>
        <span v-if="file.total">/ {{ filesize(file.total) }}</span>
      </p>
      <var-progress
        v-if="file.total || file.done"
        :value="file.done ? 100 : (file.loaded / file.total) * 100"
        :type="file.done ? 'success' : 'primary'" />
      <var-progress
        v-else
        indeterminate
        :type="file.done ? 'success' : 'primary'" />
    </var-cell>
  </var-dialog>
</template>
