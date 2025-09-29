<template>
  <div id="app">
    <component :is="currentPage" @open-add-modal="handleOpenAddModal" />
    <TabBar
      :current-tab="currentTab"
      @tab-change="handleTabChange"
    />
    <AddTransactionModal
      :open="showAddModal"
      :default-type="addModalType"
      @cancel="handleCloseAddModal"
      @success="handleAddSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import HomePage from './pages/home/index.vue'
import TransactionsPage from './pages/transactions/index.vue'
import AnalyticsPage from './pages/analytics/index.vue'
import ProfilePage from './pages/profile/index.vue'
import TabBar from './components/TabBar.vue'
import AddTransactionModal from './components/AddTransactionModal.vue'

const currentTab = ref('home')
const showAddModal = ref(false)
const addModalType = ref('expense')

const pages = {
  home: HomePage,
  transactions: TransactionsPage,
  analytics: AnalyticsPage,
  profile: ProfilePage
}

const currentPage = ref(pages.home)

const handleTabChange = (tabName, options = {}) => {
  if (tabName === 'add') {
    showAddModal.value = true
    addModalType.value = 'expense'
    return
  }

  currentTab.value = tabName
  currentPage.value = pages[tabName] || pages.home
}

const handleOpenAddModal = (type = 'expense') => {
  addModalType.value = type
  showAddModal.value = true
}

const handleCloseAddModal = () => {
  showAddModal.value = false
}

const handleAddSuccess = (transaction) => {
  showAddModal.value = false
  // 移除重复的消息提示，由AddTransactionModal组件内部处理
  console.log('新增交易:', transaction)
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background: #F5F7FB;
}
</style>