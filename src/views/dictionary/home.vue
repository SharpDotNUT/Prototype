<script setup lang="ts">
import { RouterLink } from 'vue-router'
import CMarkdown from '@/components/markdown.vue'
import ZhIntro from '@/docs/dictionary/index.zh.md?raw'
import EnIntro from '@/docs/dictionary/index.en.md?raw'
import JaIntro from '@/docs/dictionary/index.ja.md?raw'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const Intro: any = {
  'zh-Hans': ZhIntro,
  en: EnIntro,
  ja: JaIntro
}
</script>

<template>
  <div class="dictionary-home">
    <h1>{{ $t('dictionary.title') }}</h1>
    <p>{{ $t('dictionary.description') }}</p>
    <router-link to="/dictionary/main">
      <var-card>{{ $t('dictionary.genshin-dict') }}</var-card>
    </router-link>
    <var-card>
      <CMarkdown :content="Intro[locale]" />
    </var-card>
  </div>
</template>

<style lang="css" scoped>
@import url('./home.css');
</style>
