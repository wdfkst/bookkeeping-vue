<template>
  <view class="app">
    <router-view />
  </view>
</template>

<script>
export default {
  name: 'App',
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import '@/styles/global.scss';

.app {
  min-height: 100vh;
  background: #F5F7FB;
}
</style>