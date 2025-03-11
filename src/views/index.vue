<script setup>
  import Meta from '@/meta'
  import { useMainStore } from '@/stores/main'
  import { Dialog } from '@varlet/ui'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const mainStore = useMainStore()

  function use(params) {
    Dialog({
      message: t('index.unfinished-note'),
      showConfirmButton: false
    })
  }

  function openGithub() {
    window.open(`https://github.com/${Meta.repo}`, '_blank')
  }
</script>

<template>
  <div id="container">
    <div id="main">
      <img id="background" src="/img/UI_NameCardPic_Yunjin_P.png" />
      <div id="content">
        <img src="/img/UI_ChapterIcon_Yunjin.png" style="height: 10vh" />
        <h1 id="title-name">{{ $t('name') }}</h1>
        <p id="title-description"></p>
        {{ $t('index.s0') }}
        <br/>
        {{ $t('index.description') }}
        <a
          :href="`https://github.com/${Meta.repo}`"
          target="_blank"
          style="display: flex; gap: 5px">
          <img :src="`https://img.shields.io/github/stars/${Meta.repo}`" />
          <img :src="`https://img.shields.io/github/license/${Meta.repo}`" />
        </a>
        <div id="actions">
          <var-button @click="use" type="primary">
            {{ $t('index.use') }}
          </var-button>
          <var-button @click="openGithub">GitHub</var-button>
          <var-button @click="mainStore.beforeInstallPromptEvent.prompt()">
            {{ $t('index.install') }}
          </var-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #container {
    position: fixed;
    top: var(--app-bar-height);
    left: 0;
    right: 0;
    bottom: 0;
  }

  #main {
    height: calc(100vh - var(--app-bar-height));
    #background {
      position: absolute;
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: 68%;
    }
    #content {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      gap: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #000a;
      text-align: center;
      padding: 0 10vw;
      #actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 5px;
      }
    }
  }
</style>
