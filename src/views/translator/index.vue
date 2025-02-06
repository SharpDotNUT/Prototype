<script setup>
  import { ref, watch, computed } from "vue";

  import D_FontData from "@/data/fonts/data.json";

  import domtoimage from "dom-to-image";

  const ui_key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ui_showKeyboard = ref(false);
  const ui_rawText = ref("type you text here");
  const ui_font = ref("TeyvatBlack");
  const ui_mode = ref(0);
  watch(ui_mode, () => {
    ui_showKeyboard.value = false;
  });
  const ui_fontStyle = ref({
    size: 16,
    wrap: true,
  });
  const ui_rawTextFont = computed(() => {
    return ui_mode.value ? ui_font.value : "inherit";
  });
  const ui_showExportDialog = ref(false);
  const ui_exporting = ref(false);
  const el_result = ref(null);
  const m_imgUrl = ref(undefined);
  function handleExport() {
    ui_exporting.value = true;
    ui_showExportDialog.value = true;
    domtoimage.toPng(el_result.value, { quality: 1 }).then(dataUrl => {
      m_imgUrl.value = dataUrl;
      ui_exporting.value = false;
    });
  }
</script>

<template>
  <div class="__container_translator">
    <var-tabs v-model:active="ui_mode">
      <var-tab>{{ $t("translator.forward-translation") }}</var-tab>
      <var-tab>{{ $t("translator.reverse-translation") }}</var-tab>
    </var-tabs>
    <br />
    <var-input variant="outlined" :placeholder="$t('translator.raw-text')" textarea v-model="ui_rawText"> </var-input>
    <div>
      <br />
      <var-button v-if="ui_mode" block @click="ui_showKeyboard = !ui_showKeyboard">
        <span v-if="!ui_showKeyboard">{{ $t("translator.open-keyboard") }}</span>
        <span v-else>{{ $t("translator.cloase-keyboard") }}</span>
      </var-button>
    </div>
    <br />
    <var-select variant="outlined" v-model="ui_font">
      <var-option v-for="font in D_FontData" :key="font.name" :label="font.id" :value="font.id">
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
        <span>{{ $t("translator.font-size") }}</span>
        <var-counter button-size="24px" v-model="ui_fontStyle.size" />
      </div>
      <div>
        <span>{{ $t("translator.auto-wrap") }}</span>
        <var-switch variant size="20px" v-model="ui_fontStyle.wrap" />
      </div>
      <div>
        <var-button block type="primary" style="height: 24px" @click="handleExport()">{{ $t('translator.export-to-image') }}</var-button>
      </div>
    </div>
    <br />
    <var-divider></var-divider>
    <div id="result" ref="el_result">
      <pre
        :style="{
          'font-size': `${ui_fontStyle.size}px`,
          'text-wrap': ui_fontStyle.wrap ? 'wrap' : 'nowrap',
          'font-family': ui_mode ? undefined : ui_font,
        }"
        >{{ ui_rawText }}</pre
      >
      <var-dialog v-model:show="ui_showExportDialog">
        <template #title>{{ $t('translator.export-to-image') }}</template>
        <p>{{ $t('translator.action-to-save') }}</p>
        <br/>
        <var-loading v-if="ui_exporting" :loading="ui_exporting"></var-loading>
        <div v-else style="max-height: 50vh; overflow-y: auto">
          <var-image :src="m_imgUrl" fit="cover"></var-image>
        </div>
      </var-dialog>
    </div>
    <var-card id="keyboard" :style="{ transform: `translateY(${ui_showKeyboard ? '0' : '100%'})` }">
      <div id="keys">
        <div class="row" v-for="x in 6">
          <var-button
            block
            class="key var-button"
            v-for="y in 6"
            v-ripple
            @click="ui_rawText += ui_key[(x - 1) * 6 + y - 1]">
            {{ ui_key[(x - 1) * 6 + y - 1] }}
          </var-button>
        </div>
        <div class="row raw">
          <var-button block class="key" v-ripple @click="ui_rawText += ' '">SPACE</var-button>
          <var-button block class="key" v-ripple @click="ui_rawText = ui_rawText.slice(0, -1)">BACKSPACE</var-button>
          <var-button block class="key" v-ripple @click="ui_rawText += '\n'">ENTER</var-button>
        </div>
      </div>
    </var-card>
  </div>
</template>

<style scoped>
  @import url("@/data/fonts/fonts.css");

  .__container_translator {
    margin: 20px max(20px, calc(50vw - 300px));
  }

  #actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  #result {
    width: fit-content;
    max-width: 100%;
    overflow: auto;
    padding: 20px;
    white-space: pre-wrap;
    background-color: var(--color-body);
  }

  #keyboard {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    border-radius: 20px;
    background-color: var(--color-paper);
    transition: transform 0.3s ease-in-out;
    user-select: none;
    z-index:10;
    #keys {
      display: flex;
      flex-direction: column;
      align-content: space-around;
      cursor: pointer;
      .row {
        display: flex;
        justify-content: space-around;
        height: 5vh;
        font-family: v-bind(ui_font);
        .key {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2vh;
        }
      }
      .row.raw {
        font-family: inherit;
      }
    }
  }

  :deep(.var-input--textarea) {
    font-family: v-bind(ui_rawTextFont);
  }
</style>
