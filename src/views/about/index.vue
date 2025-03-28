<script setup lang="ts">
import PackageJSON from '../../../package.json'
import Meta from '@/meta'

const show = defineModel('show', { type: Boolean, default: true })

const BuildTime = __BUILD_TIME
const LAST_COMMIT = __LAST_COMMIT
</script>

<template>
  <div class="__container_about">
    <div id="card">
      <div id="main">
        <img
          src="/img/UI_NameCardPic_Yunjin_P.png"
          style="width: 100%; opacity: 0.75" />
        <div id="main_text">
          <p style="font-size: 5vh">{{ $t('name') }}</p>
          <var-badge :value="'v ' + PackageJSON.version"></var-badge>
        </div>
      </div>
    </div>
    <var-card>
      <p>
        {{ $t('index.description') }}
      </p>
      <p lang="zh-Hans">
        「
        <ruby>
          云先生
          <rt>云堇</rt>
        </ruby>
        可爱捏」
      </p>
      <br />
      <a
        :href="`https://github.com/${Meta.repo}`"
        target="_blank"
        style="display: flex; gap: 5px">
        <img :src="`https://img.shields.io/github/stars/${Meta.repo}`" />
        <img :src="`https://img.shields.io/github/license/${Meta.repo}`" />
      </a>
    </var-card>
    <var-card id="contributors">
      <p>
        <span>Programmed By&nbsp</span>
        <var-link href="https://github.com/SharpDotNUT" target="_blank">
          <img style="height: 1em" src="\img\Logo_FB.proj.svg" />
        </var-link>
        <span>&nbspWith ❤️</span>
      </p>
      <br />
      <p>{{ $t('about.thanks-to-contributors') }}</p>
      <br />
      <a
        :href="`https://github.com/${Meta.repo}/graphs/contributors`"
        target="_blank">
        <img :src="`https://contrib.rocks/image?repo=${Meta.repo}`" />
      </a>
    </var-card>
    <var-card>
      <p>{{ $t('about.last-commit') }}</p>
      <div style="padding-left: 1em">
        <p>
          Commit ID :
          <var-link
            :href="`https://github.com/${Meta.repo}/commit/${LAST_COMMIT.sha}`"
            target="_blank">
            #{{ LAST_COMMIT.sha.toUpperCase().substring(0, 17) }}
          </var-link>
        </p>
        <p>Commit Message : {{ LAST_COMMIT.commit.message }}</p>
        <p>
          Commit Time :
          {{ new Date(LAST_COMMIT.commit.author.date).toLocaleString() }}
        </p>
        <p>
          Author :
          <var-link
            :href="`https://github.com/${LAST_COMMIT.commit.author.name}`"
            target="_blank">
            {{ LAST_COMMIT.commit.author.name }}<{{
              LAST_COMMIT.commit.author.email
            }}>
          </var-link>
        </p>
      </div>
      <p>
        {{ $t('about.build-time', [new Date(BuildTime).toLocaleString()]) }}
      </p>
      <p>{{ $t('about.copyright') }}</p>
    </var-card>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
