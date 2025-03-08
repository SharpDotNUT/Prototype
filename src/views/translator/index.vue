<script setup>
  import { ref, watch, computed } from 'vue'

  import SvgIcon from '@jamescoyle/vue-icon'

  import D_FontData from '@/data/fonts/data.json'

  import domtoimage from 'dom-to-image'
import { mdiExport } from '@mdi/js'

  const ui_key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const ui_showKeyboard = ref(false)
  const ui_rawText = ref('type you text here')
  const ui_font = ref('TeyvatBlack')
  const ui_mode = ref(0)
  watch(ui_mode, () => {
    ui_showKeyboard.value = false
  })
  const ui_fontStyle = ref({
    size: 16,
    wrap: true
  })
  const ui_rawTextFont = computed(() => {
    return ui_mode.value ? ui_font.value : 'inherit'
  })
  const ui_showExportDialog = ref(false)
  const ui_exporting = ref(false)
  const el_result = ref(null)
  const m_imgUrl = ref(undefined)
  function handleExport() {
    ui_exporting.value = true
    ui_showExportDialog.value = true
    domtoimage.toPng(el_result.value, { quality: 1 }).then(dataUrl => {
      m_imgUrl.value = dataUrl
      ui_exporting.value = false
    })
  }
</script>

<template>
  <div class="__container_translator">
    <var-tabs v-model:active="ui_mode">
      <var-tab>{{ $t('translator.forward-translation') }}</var-tab>
      <var-tab>{{ $t('translator.reverse-translation') }}</var-tab>
    </var-tabs>
    <br />
    <var-input
      variant="outlined"
      :placeholder="$t('translator.raw-text')"
      textarea
      v-model="ui_rawText"></var-input>
    <div>
      <br />
      <var-button
        v-if="ui_mode"
        block
        @click="ui_showKeyboard = !ui_showKeyboard">
        <span v-if="!ui_showKeyboard">
          {{ $t('translator.open-keyboard') }}
        </span>
        <span v-else>{{ $t('translator.close-keyboard') }}</span>
      </var-button>
    </div>
    <br />
    <var-select variant="outlined" v-model="ui_font">
      <var-option
        v-for="font in D_FontData"
        :key="font.name"
        :label="font.id"
        :value="font.id">
        <div style="display: flex; flex-direction: column; padding: 10px 0">
          <p :class="`font-${font.id}`">{{ font.id }}</p>
          <p>{{ font.name.zh }}</p>
          <p>{{ font.name.en }}</p>
        </div>
      </var-option>
    </var-select>
    <br />
    <div id="actions">
      <div>
        <span>{{ $t('translator.font-size') }}</span>
        <var-counter v-model="ui_fontStyle.size" />
      </div>
      <div>
        <span>{{ $t('translator.auto-wrap') }}</span>
        <var-switch variant v-model="ui_fontStyle.wrap" />
      </div>
      <div>
        <span>
          {{ $t('translator.export-to-image') }}
        </span>
        <var-button
          type="primary"
          @click="handleExport()">
          <svg-icon type="mdi" :path="mdiExport"></svg-icon>
        </var-button>
      </div>
    </div>
    <br />
    <var-divider></var-divider>
    <div id="result" ref="el_result">
      <pre
        :style="{
          'font-size': `${ui_fontStyle.size}px`,
          'text-wrap': ui_fontStyle.wrap ? 'wrap' : 'nowrap',
          'font-family': ui_mode ? undefined : ui_font
        }"
        >{{ ui_rawText }}</pre
      >
      <var-dialog v-model:show="ui_showExportDialog">
        <template #title>{{ $t('translator.export-to-image') }}</template>
        <p>{{ $t('translator.action-to-save') }}</p>
        <br />
        <var-loading v-if="ui_exporting" :loading="ui_exporting"></var-loading>
        <div v-else style="max-height: 50vh; overflow-y: auto">
          <var-image :src="m_imgUrl" fit="cover"></var-image>
        </div>
      </var-dialog>
    </div>
    <var-card
      id="keyboard"
      :style="{ transform: `translateY(${ui_showKeyboard ? '0' : '100%'})` }">
      <div id="keys">
        <div class="row" v-for="x in 6">
          <div
            class="key var-button"
            v-for="y in 6"
            v-ripple
            @click="ui_rawText += ui_key[(x - 1) * 6 + y - 1]">
            {{ ui_key[(x - 1) * 6 + y - 1] }}
          </div>
        </div>
        <div class="row raw">
          <div class="key" v-ripple @click="ui_rawText += ' '">
            SPACE
          </div>
          <div
            class="key"
            v-ripple
            @click="ui_rawText = ui_rawText.slice(0, -1)">
            BACKSPACE
          </div>
          <div class="key" v-ripple @click="ui_rawText += '\n'">
            ENTER
          </div>
        </div>
      </div>
    </var-card>
  </div>
</template>

<style scoped>
  @import url('@/data/fonts/fonts.css');
  @import url('./index.css');

  #keyboard {
    #keys{
      .row{
        font-family: v-bind(ui_font);
      }
    }
  }
  :deep(.var-input--textarea) {
    font-family: v-bind(ui_rawTextFont);
  }
</style>
