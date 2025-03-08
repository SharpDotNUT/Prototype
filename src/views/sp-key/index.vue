<script setup lang="ts">
  import { computed, ref, type Ref } from 'vue'
  import { GameList } from '@/data/games'
  import { useAPIStore } from '@/stores/api'
  //@ts-ignore
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiContentCopy } from '@mdi/js'
  import { copyToClipboard } from '@/script/tools'
  import { reduceData, type t_Data } from './index'
  import { Snackbar } from '@varlet/ui'

  const date = ref(new Date().toLocaleDateString())
  const time = ref('23:59:59')
  const datetime = computed(() => date.value + ' ' + time.value)
  const form = ref({
    token: '',
    key: '',
    game: 'GI',
    server: 'CN'
  })

  const ui_commit = ref(false)

  const data: Ref<t_Data> = ref([])

  const API = useAPIStore()
  API.fetchAPI('/sp-key')
    .then(res => res.json())
    .then(res => {
      data.value = reduceData(res)
    })

  function commit() {
    API.fetchAPI('/sp-key', undefined, 'POST', {
      token: form.value.token,
      key: form.value.key,
      game: form.value.game,
      server: form.value.server,
      version: '1.5.5',
      'available-time': new Date(datetime.value).getTime()
    }).then(res => {
      if (res.status === 401) {
        Snackbar.error('Commit failed. Token is invalid.')
      }
    })
  }
</script>

<template>
  <div class="__container">
    <var-button block type="primary" @click="ui_commit = true">
      {{ $t('sp-key.commit-key') }}
    </var-button>
    <br />
    <div id="keys">
      <var-card v-for="item in data" class="card">
        <div v-for="key in item.key.split(',')" class="key">
          <span>{{ key }}</span>
          <var-button @click="copyToClipboard(key)">
            <SvgIcon type="mdi" :path="mdiContentCopy" />
          </var-button>
        </div>
        <div id="info">
          <span>
            {{ $t('sp-key.game') }} :
            <span>{{ $t('global.game.' + item.game) }}</span>
          </span>
          <span>
            {{ $t('sp-key.server') }} :
            <span>{{ item.server }}</span>
          </span>
          <span>
            {{ $t('sp-key.version') }} :
            <span>{{ item.version }}</span>
          </span>
          <span>
            <span>{{ $t('sp-key.expired-time') }} :</span>
            <span>{{ item['available-time-string'] }}</span>
            <span>|</span>
            <span v-if="item.expired" style="background-color: red">
              {{ $t('global.expired') }}
            </span>
            <span v-else style="background-color: green">
              {{ $t('sp-key.time-to-expire', [item['time-to-expire']]) }}
            </span>
          </span>
        </div>
      </var-card>
    </div>
    <var-popup v-model:show="ui_commit" id="commit">
      <div id="content">
        <var-alert
          :title="$t('sp-key.become-a-contributor.title')"
          :message="$t('sp-key.become-a-contributor.content')" />
        <var-input
          v-model="form.token"
          :placeholder="$t('sp-key.token-to-auth')" />
        <var-input v-model="form.key" :placeholder="$t('sp-key.key')" />
        <var-select v-model="form.game" :placeholder="$t('sp-key.game')">
          <var-option
            v-for="game in GameList"
            :label="$t('global.game.' + game)"
            :value="game" />
        </var-select>
        <var-select v-model="form.server" :placeholder="$t('sp-key.server')">
          <var-option label="中国服 | ChinaMainland (miHoYo) - CN" value="CN" />
          <var-option
            label="国际服 | Global (HoYoVERSE) - GLOBAL"
            value="GLOBAL" />
        </var-select>
        <var-input
          disabled
          v-model="datetime"
          :placeholder="$t('sp-key.expired-time')" />
        <div id="picker">
          <var-date-picker v-model="date" />
          <var-time-picker v-model="time" use-seconds />
        </div>
        <var-button type="primary" @click="commit">
          {{ $t('global.commit') }}
        </var-button>
      </div>
    </var-popup>
  </div>
</template>

<style>
  @import url('./index.css');
</style>
