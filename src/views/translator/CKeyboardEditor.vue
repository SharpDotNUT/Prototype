<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
import CAutoTextarea from './CAutoTextarea.vue'
import { mdiKeyboardClose } from '@mdi/js'

const Keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const text = defineModel('text', {
  type: String,
  required: true
})
const props = defineProps<{
  font: string
}>()

const showKeyboard = defineModel<boolean>('showKeyboard')
</script>

<template>
  <var-popup v-model:show="showKeyboard" position="bottom">
    <div id="container">
      <CAutoTextarea
        id="textarea"
        ref="ref_textarea"
        variant="standard"
        v-model="text"
        :style="{
          fontFamily: props.font
        }" />
      <var-card id="keyboard">
        <div id="keys">
          <div
            :style="{
              fontFamily: font
            }"
            class="row"
            v-for="x in 6">
            <div
              class="key var-button"
              v-for="y in 6"
              v-ripple
              @click="text += Keys[(x - 1) * 6 + y - 1]">
              {{ Keys[(x - 1) * 6 + y - 1] }}
            </div>
          </div>
          <div class="row raw">
            <div class="key" v-ripple @click="text += ' '">SPACE</div>
            <div class="key" v-ripple @click="text = text.slice(0, -1)">
              BACKSPACE
            </div>
            <div class="key" v-ripple @click="text += '\n'">ENTER</div>
            <div class="key" v-ripple @click="showKeyboard = false">
              <svg-icon type="mdi" :path="mdiKeyboardClose" />
            </div>
          </div>
        </div>
      </var-card>
    </div>
  </var-popup>
</template>

<style lang="css" scoped>
@import url('./CKeyboardEditor.css');
</style>
