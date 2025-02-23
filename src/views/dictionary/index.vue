<script setup>
  import { ref } from 'vue'
  import { Snackbar } from '@varlet/ui'
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n()
  import _ from 'lodash-es'
  import Tags from '@/data/dictionary/tags.json'

  const WordsPath = 'https://dataset.genshin-dictionary.com/words.json'
  let Words = []
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]] // 交换元素
    }
    return array
  }
  caches.open('dictionary').then(cache => {
    cache.match(WordsPath).then(async res => {
      if (res) {
        res.json().then(data => {
          Words = shuffleArray(data)
          Words_loaded.value = true
          Snackbar('从缓存加载成功')
          load()
          search(null, true)
        })
      } else {
        const res = await fetch(WordsPath)
        cache.put(WordsPath, res.clone())
        res.json().then(data => {
          Words = shuffleArray(data)
          Words_loaded.value = true
          Snackbar('从网络下载成功')
          load()
          search(null, true)
        })
      }
    })
  })

  const Words_loaded = ref(false)
  const lastSearchString = ref(undefined)
  const searchString = ref('')
  const lastSearchTags = ref(undefined)
  const searchTags = ref([])
  const pre_words = ref([])
  const words = ref([])
  const ref_words = ref({})
  const load = () => {
    words.value = pre_words.value.slice(0, words.value.length + 100)
  }

  const search = (e, force = false) => {
    const sameString = searchString.value == lastSearchString.value
    const sameTags = _.isEqual(searchTags.value, lastSearchTags.value)
    console.log(sameString, sameTags, force)
    if (sameString && sameTags && !force) {
      return
    }
    console.log('sameString, sameTags, force')
    lastSearchString.value = searchString.value
    lastSearchTags.value = searchTags.value
    pre_words.value = Words.filter(word => {
      let _text = false
      if (!searchString.value) {
        _text = true
      } else {
        if (word.zhCN) {
          _text = word.zhCN
            .toLowerCase()
            .includes(searchString.value.toLowerCase())
        }
        if (word.en) {
          _text =
            _text ||
            word.en.toLowerCase().includes(searchString.value.toLowerCase())
        }
        if (word.ja) {
          _text =
            _text ||
            word.ja.toLowerCase().includes(searchString.value.toLowerCase())
        }
      }
      let _tag = true
      if (searchTags.value.length) {
        if (word.tags) {
          for (const searchTag of searchTags.value) {
            if (!word.tags.includes(searchTag)) {
              _text = false
            }
          }
        } else {
          _tag = false
        }
      }
      return _text && _tag
    })
    load()
  }
</script>

<template>
  <div id="container">
    <div id="search">
      <br />
      <var-input
        variant="outlined"
        v-model="searchString"
        :placeholder="$t('dictionary.search-text')"
        @blur="search"
        @keydown.enter="search" />
      <br />
      <var-select
        variant="outlined"
        placeholder="筛选标签"
        chip
        multiple
        v-model="searchTags"
        @blur="search">
        <var-option
          v-for="(text, tag) in Tags?.[locale]"
          :value="tag"
          :label="text" />
      </var-select>
    </div>
    <var-divider />
    <var-list id="words" @load="load">
      <div
        v-for="word in words"
        :key="word.id"
        style="padding: 10px; display: flex; flex-direction: column; gap: 10px">
        <div class="word" :ref="el => (ref_words[word.id] = el)">
          <h5>{{ $t('dictionary.zh-cn') }}</h5>
          <p class="lang-zhs">{{ word.zhCN }}</p>
          <h5>{{ $t('dictionary.en') }}</h5>
          <p class="lang-en">{{ word.en }}</p>
          <h5>{{ $t('dictionary.ja') }}</h5>
          <p style="display: flex; align-items: baseline; flex-wrap: wrap">
            <span class="lang-ja">{{ word.ja }}</span>
            <span class="kana lang-ja" v-if="word.pronunciationJa">
              ({{ word.pronunciationJa }})
            </span>
          </p>
          <div>
            <var-chip v-for="tag in word.tags" style="margin: 0px 2px">
              {{ Tags?.[locale]?.[tag] }}
            </var-chip>
          </div>
        </div>
        <hr />
      </div>
    </var-list>
  </div>
</template>

<style scoped>
  #container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow-y: hidden;
    height: 100%;
    padding: 20px max(5vw, calc(calc(100vw - 600px) / 2));
    #words {
      overflow-y: auto;
    }
    .word {
      padding: 20px 0px;
      gap: 10px;
      .kana {
        font-size: 0.8em;
      }
    }
  }
</style>
