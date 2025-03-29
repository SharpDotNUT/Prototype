<script setup>
import { ref, watch } from 'vue'

import BannerView from '../banner-view.vue'
import BannersView from '../banners-view.vue'
import PlayBGM from '../play-bgm.vue'

import { Simulator } from './simulator'

const s_openSelector = ref(false)
const d_banner = ref({
  name: '鲨鲨逐浪游',
  order: 1,
  type: 301,
  star5: [10000102],
  star4: [10000100, 10000044, 10000032],
  from: '2024-08-28T06:00:00+08:00',
  to: '2024-09-17T17:59:00+08:00',
  img: 'https://sdk.hoyoverse.com/upload/ann/2024/08/15/51554e94cbe4323254c9951a0457f1e3_1034430603195950634.jpg'
})

let simulator = new Simulator(d_banner.value)
const count = ref(0)
const history = ref([])
const d_star4 = ref(0)
const d_star5 = ref(0)
const updateSimulator = () => {
  simulator = new Simulator(d_banner.value)
}
const simulate = (count) => {
  if (count <= 10000) {
    const { newHistory, star4, star5 } = simulator.simulate(count)
    history.value.push(...newHistory)
    d_star4.value = star4
    d_star5.value = star5
  } else {
    Snackbar.error('当前版本不支持模拟超过10000抽')
  }
}

alert('临时开发版本；未完整实现大小保底和翻页功能')
</script>

<template>
  <PlayBGM />
  <br />
  <var-popup
    position="bottom"
    style="height: calc(100vh - var(--app-bar-height) - 20px)"
    v-model:show="s_openSelector">
    <div class="base-width" style="margin: 20px auto; padding: 0 20px">
      <BannersView
        :isNeedSelect="true"
        @select="
          ((d_banner = $event), (s_openSelector = false), updateSimulator())
        " />
    </div>
  </var-popup>
  <BannerView v-if="d_banner" :banner="d_banner" />
  <var-button block @click="s_openSelector = true">选择卡池</var-button>
  <var-button block @click="history = []">清空</var-button>
  <var-button block @click="simulate(90)">模拟 90 抽</var-button>
  <var-input type="number" v-model="count" placeholder="请输入抽卡次数">
    <template #extra-message></template>
  </var-input>
  <br />
  <var-button block @click="simulate(count)">模拟 {{ count }} 抽</var-button>
  <div>
    共{{ history.length }}抽，{{ d_star4 }}抽四星，{{ d_star5 }}抽五星
    <var-pagination
      :current="3"
      :total="66"
      :show-total="(total) => `共 ${total} 条`" />
    <var-table>
      <table style="width: 100%">
        <thead>
          <tr>
            <th>序号</th>
            <th>星级</th>
            <th>名称</th>
            <th>四星保底</th>
            <th>五星保底</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in history"
            :key="item.id"
            :class="`bg-rank${item.rank}`">
            <td>{{ index + 1 }}</td>
            <td>{{ { 3: '三星', 4: '四星', 5: '五星' }[item.rank] }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.last4star + 1 }}</td>
            <td>{{ item.last5star + 1 }}</td>
          </tr>
        </tbody>
      </table>
    </var-table>
  </div>
</template>

<style scoped>
.bg-rank4 td {
  color: #a056df;
}

.bg-rank5 td {
  color: #bd6932;
}
</style>
