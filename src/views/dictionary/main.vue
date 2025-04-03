<script setup lang="ts">
import { computed, ref } from 'vue'
import { Snackbar } from '@varlet/ui'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { isEqual } from 'lodash-es'
import Tags from '@/data/dictionary/tags.json'
import { filter, type t_word } from './main'
import type { Ref } from 'vue'

const WordsPath = 'https://dataset.genshin-dictionary.com/words.json'
let Words: t_word[] = []
caches.open('dictionary').then((cache) => {
  cache.match(WordsPath).then(async (res) => {
    if (res) {
      res.json().then((data) => {
        Words = data
        Words_loaded.value = true
        Snackbar('从缓存加载成功')
        search(null, true)
      })
    } else {
      const res = await fetch(WordsPath)
      cache.put(WordsPath, res.clone())
      res.json().then((data) => {
        Words = data
        Words_loaded.value = true
        Snackbar('从网络下载成功')
        search(null, true)
      })
    }
  })
})

const Words_loaded = ref(false)
const lastSearchString: Ref<undefined | string> = ref(undefined)
const searchString = ref('')
const lastSearchTags: Ref<undefined | string[]> = ref(undefined)
const searchTags = ref([])
const lastSearchFrom: Ref<undefined | string> = ref(undefined)
const searchFrom = ref(locale.value)
const pre_words: Ref<t_word[]> = ref([])
const words = computed(() => {
  return pre_words.value
})
const ref_words = ref({})

const search = (e: Event | null, force = false) => {
  const sameString = searchString.value == lastSearchString.value
  const sameTags = isEqual(searchTags.value, lastSearchTags.value)
  const sameFrom = searchFrom.value == lastSearchFrom.value
  if (sameString && sameTags && sameFrom && !force) {
    return
  }
  lastSearchString.value = searchString.value
  lastSearchTags.value = searchTags.value
  lastSearchFrom.value = searchFrom.value
  pre_words.value = Words.filter((word) => {
    return filter(word, searchString, searchTags, searchFrom)
  })
}
</script>

<template>
  <div class="dictionary-main">
    <div id="search">
      <h2>{{ $t('dictionary.genshin-dict') }}</h2>
      <br />
      <var-input
        v-model="searchString"
        :placeholder="$t('dictionary.search-text')"
        @blur="search"
        @keydown.enter="search" />
      <br />
      <var-select
        :placeholder="$t('dictionary.search-lang')"
        chip
        v-model="searchFrom"
        @blur="search">
        <var-option value="all" :label="$t('global.all')" />
        <var-option value="zh-Hans" :label="$t('global.lang.zh-Hans')" />
        <var-option value="en" :label="$t('global.lang.en')" />
        <var-option value="ja" :label="$t('global.lang.ja')" />
      </var-select>
      <br />
      <var-select
        :placeholder="$t('dictionary.filter')"
        chip
        multiple
        v-model="searchTags"
        @blur="search">
        <var-option
          v-for="(text, tag) in (Tags as Record<string, Record<string, any>>)?.[
            locale
          ]"
          :value="tag"
          :label="text" />
      </var-select>
    </div>
    <div id="result">
      <p>{{ $t('dictionary.result-count', [words.length]) }}</p>
      <dynamic-scroller id="list" :items="words" :min-item-size="100">
        <template #default="{ item: word, index, active }">
          <dynamic-scroller-item
            :item="word"
            :active="active"
            :size-dependencies="[
              locale,
              word.zhCN,
              word.en,
              word.ja,
              word.tags
            ]"
            :data-index="index">
            <div style="padding: 10px 0">
              <var-card
                class="word"
                :ref="
                  //@ts-ignore
                  (el) => (ref_words[word.id] = el)
                ">
                <h5>{{ $t('global.lang.zh-Hans') }}</h5>
                <p lang="zh-Hans">{{ word.zhCN }}</p>
                <h5>{{ $t('global.lang.en') }}</h5>
                <p lang="en">{{ word.en }}</p>
                <h5>{{ $t('global.lang.ja') }}</h5>
                <p
                  style="display: flex; align-items: baseline; flex-wrap: wrap">
                  <span lang="ja">{{ word.ja }}</span>
                  <span lang="ja" class="kana" v-if="word.pronunciationJa">
                    <span>&nbsp(</span>
                    {{ word.pronunciationJa }}
                    <span>)</span>
                  </span>
                </p>
                <br />
                <div>
                  <var-chip
                    type="info"
                    class="tag"
                    v-for="tag in word.tags"
                    @click="
                      //@ts-ignore
                      ((searchTags = [tag]), search())
                    ">
                    {{
                      //@ts-ignore
                      Tags?.[locale]?.[tag]
                    }}
                  </var-chip>
                </div>
              </var-card>
            </div>
          </dynamic-scroller-item>
        </template>
      </dynamic-scroller>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./main.css');
</style>
