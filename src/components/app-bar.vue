<script setup>
import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiApps, mdiCog, mdiAccount, mdiGithub, mdiTranslate } from '@mdi/js'
import RouterJump from '@/components/router-jump.vue'
import Account from './account.vue'
import Markdown from './markdown.vue'

const title = ref('')
const display_account = ref(false)
const mainStore = useMainStore()
const host_name = mainStore.host_name

const notice_show = ref(false)
const notice_content = ref('')
fetch(`${host_name}/notice`)
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    if (data.show == 'true') {
      notice_show.value = true
      notice_content.value = data.text
    }
  })
  .catch((err) => {})

const emits = defineEmits(['changeIsFullWidth'])

watch(
  () => mainStore.title,
  (newVal, oldVal) => {
    title.value = newVal
  }
);
</script>

<template>
  <var-dialog v-model:show="notice_show" style="max-height: 80vh">
    <div style="height: 50vh; overflow-y: auto">
      <Markdown :content="notice_content"></Markdown>
    </div>
  </var-dialog>
  <div style="height: var(--app-bar-height)">
    <var-app-bar style="position: fixed; top: 0; left: 0; right: 0">
      <img src="/img/UI_ChapterIcon_Yunjin.png" style="height: 36px" />
      <span>{{ $t('name') }}</span>
      <template #right>
        <var-menu placement="bottom-end">
          <var-button round text>
            <svg-icon type="mdi" :path="mdiTranslate"></svg-icon>
          </var-button>
          <template #menu>
            <div style="text-align: right">
              <var-cell lang="zh-Hans" border @click="$i18n.locale = 'zh-Hans'">
                简体中文
              </var-cell>
              <var-cell lang="en" border @click="$i18n.locale = 'en'">
                English
              </var-cell>
              <var-cell lang="ja" border @click="$i18n.locale = 'ja'">
                日本語
              </var-cell>
            </div>
          </template>
        </var-menu>
        <var-menu placement="bottom-end">
          <var-button round text>
            <svg-icon type="mdi" :path="mdiApps"></svg-icon>
          </var-button>
          <template #menu>
            <RouterJump />
          </template>
        </var-menu>
      </template>
      <template #left></template>
    </var-app-bar>
  </div>
  <Account
    :show="display_account"
    @update:display_account="display_account = false" />
</template>

<style>
#menu {
  width: min(70vw, 600px);
  padding: 10vh 20px;
  top: var(--app-bar-height);
}
</style>
