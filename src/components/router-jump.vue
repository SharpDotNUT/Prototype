<script setup>
import { ref, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiCog, mdiGithub, mdiInformation } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/stores/main'
import { NavigationData as RouteData } from '@/nav'

const mainStore = useMainStore()
import Meta from '@/meta'

function openGithub() {
  window.open(`https://github.com/${Meta.repo}`, '_blank')
}
</script>

<template>
  <div id="container">
    <h3>
      {{ $t('name') }}
      <var-badge :value="'v ' + mainStore.version"></var-badge>
    </h3>
    <var-divider />
    <div id="apps">
      <var-paper elevation="3" class="app var-button" @click="openGithub">
        <a class="app-name">
          <SvgIcon class="icon" type="mdi" :path="mdiGithub" />
          <span>{{ $t('global.github-os-repo') }}</span>
        </a>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/settings">
          <SvgIcon class="icon" type="mdi" :path="mdiCog" />
          <span>{{ $t('setting.title') }}</span>
        </RouterLink>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/about">
          <SvgIcon class="icon" type="mdi" :path="mdiInformation" />
          <span>{{ $t('global.about') }}</span>
        </RouterLink>
      </var-paper>
      <var-divider />
      <var-paper
        elevation="3"
        v-for="route in RouteData"
        class="app var-button">
        <RouterLink class="app-name" :to="route.path">
          {{ $t(route.name + '.title') }}
          <var-chip v-if="route.beta" type="warning" size="small">
            Beta
          </var-chip>
        </RouterLink>
      </var-paper>
    </div>
  </div>
</template>

<style scoped>
@import url('./router-jump.css');
</style>
