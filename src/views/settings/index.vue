<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import type { CacheResourceRecord } from '@/script/RM/types'
const { locale } = useI18n()
import { filesize } from 'filesize'
const mainStore = useMainStore()
const ui_isTeyvatFont = ref(mainStore.isUsingTeyvatFont)
const theme = ref('system')

watch(theme, () => {
  mainStore.setTheme(theme.value)
})
watch(ui_isTeyvatFont, () => {
  if (ui_isTeyvatFont.value) {
    locale.value = 'en'
    mainStore.isUsingTeyvatFont = true
    router.push({ query: { lang: locale.value } })
    document.documentElement.classList.add('teyvat')
  } else {
    mainStore.isUsingTeyvatFont = false
    document.documentElement.classList.remove('teyvat')
  }
})

const router = useRouter()
const showMenu = ref(false)
const StorageUsage: Ref<null | {
  total: number
  used: number
  cacheUsed: number
  resources: Record<string, CacheResourceRecord>
}> = ref(null)
function loadStorageUsage() {
  mainStore.RM.getLocalMeta().then((res) => {
    StorageUsage.value = res as {
      total: number
      used: number
      cacheUsed: number
      resources: Record<string, CacheResourceRecord>
    }
  })
}
loadStorageUsage()

const s_isWidthOver800 = ref(false)
onMounted(() => {
  s_isWidthOver800.value = window.innerWidth > 800
  window.addEventListener('resize', () => {
    s_isWidthOver800.value = window.innerWidth > 800
  })
})
</script>

<template>
  <div class="__container_settings">
    <div
      id="tabs"
      :style="{
        transform: showMenu ? 'translateX(0)' : 'translateX(-100%)'
      }">
      <div>
        <h2>{{ $t('setting.title') }}</h2>
      </div>
      <div name="theme" @click="scrollToView('theme')">
        {{ $t('setting.theme.title') }}
      </div>
      <div name="language" @click="scrollToView('language')">
        {{ $t('setting.language.title') }}
      </div>
      <div name="about" @click="scrollToView('about')">
        {{ $t('setting.about.title') }}
      </div>
    </div>
    <div
      id="views"
      :style="{
        marginLeft: showMenu && s_isWidthOver800 ? '200px' : '0'
      }">
      <div>
        <div>
          <h2>{{ $t('setting.theme.title') }}</h2>
          <br />
          <var-select
            variant="outlined"
            v-model="theme"
            :placeholder="$t('setting.theme.select')">
            <template #prepend-icon><var-icon name="palette" /></template>
            <var-option
              :label="$t('setting.theme.light')"
              value="light"></var-option>
            <var-option
              :label="$t('setting.theme.dark')"
              value="dark"></var-option>
            <var-option
              :label="$t('setting.theme.system')"
              value="system"></var-option>
            <template #append-icon></template>
          </var-select>
        </div>
        <div>
          <h2>{{ $t('setting.language.title') }}</h2>
          <br />
          <var-select
            :disabled="ui_isTeyvatFont"
            variant="outlined"
            v-model="locale"
            :placeholder="$t('setting.language.select')">
            <template #prepend-icon><var-icon name="translate" /></template>
            <var-option label="English" value="en"></var-option>
            <var-option label="中文（简体）" value="zh-Hans"></var-option>
            <var-option label="日本語" value="ja"></var-option>
          </var-select>
          <br />
          <p
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
            <span>{{ $t('setting.language.teyvat') }}</span>
            <var-switch v-model="ui_isTeyvatFont" :variant="true" />
          </p>
        </div>
        <div v-if="StorageUsage">
          <h2>Resource Manager</h2>
          <p>
            {{ filesize(StorageUsage.cacheUsed) }} /
            {{ filesize(StorageUsage.total) }}
          </p>
          <var-table>
            <table>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Variant</td>
                  <td>Size</td>
                  <td>UpdatedAt</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="value in StorageUsage?.resources">
                  <td>
                    {{ value.id }}
                  </td>
                  <td>
                    {{ value.variant }}
                  </td>
                  <td>{{ filesize(value.size) }}</td>
                  <td>{{ new Date(value.updatedAt).toLocaleString() }}</td>
                  <td>
                    <var-button
                      size="small"
                      type="warning"
                      @click="
                        mainStore.RM.remove({
                          id: value.id,
                          variant: value.variant
                        }).then(() => {
                          loadStorageUsage()
                        })
                      ">
                      Delete
                    </var-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </var-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
