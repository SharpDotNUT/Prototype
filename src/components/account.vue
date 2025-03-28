<script setup>
import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/main.ts'

const host_name = useMainStore().host_name
const display_account = ref(false)
const active = ref()
const mainStore = useMainStore()

const emits = defineEmits(['update:display_account'])
watch(display_account, () => {
  emits('update:display_account')
})
const account_info = ref({
  username: 'sharpdotnut',
  display_name: '#.NUT Studio',
  email: 'offical@sharpdotnut.top',
  password: 'TT'
})

function open() {
  display_account.value = true
}
function register() {
  fetch(`${host_name}/api/account/register`, {
    method: 'POST',
    body: JSON.stringify(account_info.value),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        Dialog({
          title: '提示',
          message: data.error
        })
      } else {
        Dialog({
          title: '提示',
          message: '账号注册成功\n' + JSON.stringify(data.data)
        })
        login()
      }
    })
}

function login() {
  fetch(
    `${host_name}/api/account/login?username=${account_info.value.username}&password=${account_info.value.password}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        Dialog({
          title: '提示',
          message: '登录失败：' + data.error
        })
      } else {
        Dialog({
          title: '提示',
          message: '登录成功'
        })
        localStorage.setItem('yunhan-meta-user-token', data.data.token)
        localStorage.setItem('yunhan-meta-user', JSON.stringify(data.data.user))
        mainStore.initUserInfo()
      }
    })
}

function logout() {
  localStorage.removeItem('yunhan-meta-user-token')
  localStorage.removeItem('yunhan-meta-user')
  mainStore.logged = false
  mainStore.user_info = {}
}

defineExpose({
  open
})
</script>

<template>
  <div>
    <var-dialog v-model:show="display_account">
      <template #title>
        <h1 @click="console.log(display_account)">账户(临时)</h1>
        <p>目前账号系统正处于测试阶段，当前注册的账号可能会被随时删除</p>
        <div v-if="mainStore.logged">
          <h3>{{ mainStore.user_info.display_name }}</h3>
          <h5>@{{ mainStore.user_info.username }}</h5>
          <p>邮箱 - {{ mainStore.user_info.email }}</p>
          <p>创建日期 - {{ mainStore.user_info.create_time }}</p>
          <var-button block @click="logout()">退出登录</var-button>
        </div>
        <div v-else>
          <var-tabs v-model:active="active">
            <var-tab name="register">注册</var-tab>
            <var-tab name="login">登录</var-tab>
          </var-tabs>
          <var-tabs-items v-model:active="active">
            <var-tab-item name="register">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                  margin: 20px 0;
                ">
                <var-input
                  v-model="account_info.username"
                  placeholder="用户名"
                  variant="outlined"
                  clearable>
                  账号名
                  <template #extra-message></template>
                </var-input>
                <var-input
                  v-model="account_info.display_name"
                  placeholder="昵称"
                  variant="outlined"
                  clearable>
                  显示名
                </var-input>
                <var-input
                  v-model="account_info.password"
                  placeholder="密码"
                  variant="outlined"
                  type="password"
                  clearable>
                  密码
                </var-input>
                <var-input
                  v-model="account_info.email"
                  placeholder="电子邮件"
                  variant="outlined"
                  clearable>
                  邮箱
                </var-input>
              </div>
            </var-tab-item>
            <var-tab-item name="login">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                  margin: 20px 0;
                ">
                <var-input
                  v-model="account_info.username"
                  placeholder="用户名"
                  variant="outlined"
                  clearable>
                  账号名
                  <template #extra-message></template>
                </var-input>
                <var-input
                  v-model="account_info.password"
                  placeholder="密码"
                  variant="outlined"
                  type="password"
                  clearable>
                  密码
                </var-input>
              </div>
            </var-tab-item>
          </var-tabs-items>
          <var-button block @click="active == 'login' ? login() : register()">
            {{ active == 'login' ? '登录' : '注册' }}
          </var-button>
        </div>
      </template>
    </var-dialog>
  </div>
</template>
