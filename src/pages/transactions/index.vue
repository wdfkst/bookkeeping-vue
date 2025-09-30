<template>
  <div class="transactions-page">
    <div class="page-header">
      <h1 class="page-title">流水记录</h1>
      <div class="header-actions">
        <a-button type="text" size="large" @click="showSearchModal = true">
          <SvgIcon name="magnifier" :size="20" color="#667085" />
        </a-button>
        <a-button type="text" size="large" @click="showFilterModal = true">
          <SvgIcon name="filter-alt" :size="20" color="#667085" />
        </a-button>
      </div>
    </div>

    <div class="content-scrollable">
      <!-- 筛选条件 -->
      <div class="filter-section">
        <a-segmented
          v-model:value="filterType"
          :options="filterOptions"
          @change="handleFilterChange"
        />
      </div>

      <!-- 统计汇总 -->
      <div class="summary-card" v-if="filteredTransactions.length > 0">
        <div class="summary-item">
          <span class="summary-label">总收入</span>
          <span class="summary-value income">+¥{{ formatAmount(totalIncome) }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="summary-label">总支出</span>
          <span class="summary-value expense">-¥{{ formatAmount(totalExpense) }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="summary-label">结余</span>
          <span class="summary-value" :class="totalBalance >= 0 ? 'income' : 'expense'">
            {{ totalBalance >= 0 ? '+' : '' }}¥{{ formatAmount(Math.abs(totalBalance)) }}
          </span>
        </div>
      </div>

      <!-- 交易列表 -->
      <div class="transactions-list" v-if="groupedTransactions.length > 0">
        <div
          v-for="group in groupedTransactions"
          :key="group.date"
          class="transaction-group"
        >
          <div class="group-header">
            <span class="group-date">{{ group.dateLabel }}</span>
            <span class="group-amount" :class="group.dayTotal >= 0 ? 'income' : 'expense'">
              {{ group.dayTotal >= 0 ? '+' : '' }}¥{{ formatAmount(Math.abs(group.dayTotal)) }}
            </span>
          </div>
          <div
            v-for="transaction in group.transactions"
            :key="transaction.id"
            class="transaction-item"
            @click="handleTransactionClick(transaction)"
          >
            <div class="transaction-icon" :class="transaction.type" :style="{ background: transaction.categoryColor }">
              <SvgIcon :name="transaction.categoryIcon" :size="20" color="white" />
            </div>
            <div class="transaction-info">
              <div class="transaction-title">{{ transaction.title }}</div>
              <div class="transaction-detail">
                {{ transaction.time }} · {{ transaction.accountName }} · {{ transaction.categoryName }}
              </div>
            </div>
            <div class="transaction-amount" :class="transaction.type">
              {{ transaction.type === 'expense' ? '-' : '+' }}¥{{ formatAmount(transaction.amount) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-text">暂无交易记录</div>
        <div class="empty-subtitle">点击下方"+"按钮开始记账</div>
      </div>

      <!-- 底部安全距离 -->
      <div class="safe-bottom"></div>
    </div>

    <!-- 搜索弹窗 -->
    <a-modal
      v-model:open="showSearchModal"
      title="搜索交易"
      :footer="null"
      @cancel="closeSearchModal"
    >
      <a-input
        v-model:value="searchKeyword"
        placeholder="搜索交易标题或备注..."
        size="large"
        @input="handleSearch"
      >
        <template #prefix>
          <SvgIcon name="magnifier" :size="16" color="#999" />
        </template>
      </a-input>
    </a-modal>

    <!-- 筛选弹窗 -->
    <a-modal
      v-model:open="showFilterModal"
      title="筛选条件"
      @ok="applyFilter"
      @cancel="closeFilterModal"
    >
      <div class="filter-content">
        <div class="filter-group">
          <label>交易类型</label>
          <a-select v-model:value="filterConfig.type" style="width: 100%">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="income">收入</a-select-option>
            <a-select-option value="expense">支出</a-select-option>
          </a-select>
        </div>
        <div class="filter-group">
          <label>分类</label>
          <a-select v-model:value="filterConfig.categoryId" style="width: 100%">
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="filter-group">
          <label>账户</label>
          <a-select v-model:value="filterConfig.accountId" style="width: 100%">
            <a-select-option value="">全部账户</a-select-option>
            <a-select-option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="filter-group">
          <label>时间范围</label>
          <a-range-picker
            v-model:value="filterConfig.dateRange"
            style="width: 100%"
            format="YYYY-MM-DD"
            placeholder="['开始日期', '结束日期']"
            :mode="isMobile.value ? ['date', 'date'] : undefined"
            :size="isMobile.value ? 'small' : 'middle'"
            :getPopupContainer="(triggerNode) => triggerNode.parentElement"
          />
        </div>
      </div>
    </a-modal>

    <!-- 交易详情弹窗 -->
    <a-modal
      v-model:open="showDetailModal"
      :title="selectedTransaction?.title"
      :footer="null"
      @cancel="closeDetailModal"
    >
      <div class="transaction-detail-content" v-if="selectedTransaction">
        <div class="detail-item">
          <span class="detail-label">金额</span>
          <span class="detail-value" :class="selectedTransaction.type">
            {{ selectedTransaction.type === 'expense' ? '-' : '+' }}¥{{ formatAmount(selectedTransaction.amount) }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">分类</span>
          <span class="detail-value">{{ selectedTransaction.categoryName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">账户</span>
          <span class="detail-value">{{ selectedTransaction.accountName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">时间</span>
          <span class="detail-value">{{ formatDateTime(selectedTransaction.date) }}</span>
        </div>
        <div class="detail-item" v-if="selectedTransaction.note">
          <span class="detail-label">备注</span>
          <span class="detail-value">{{ selectedTransaction.note }}</span>
        </div>
        <div class="detail-actions">
          <a-button type="primary" @click="editTransaction">编辑</a-button>
          <a-button danger @click="deleteTransaction">删除</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useTransactionStore } from '@/store/transaction'
import { formatAmount } from '@/utils/format'
import SvgIcon from '@/components/SvgIcon.vue'

const transactionStore = useTransactionStore()

// 筛选和搜索状态
const filterType = ref('all')
const searchKeyword = ref('')
const showSearchModal = ref(false)
const showFilterModal = ref(false)
const showDetailModal = ref(false)
const selectedTransaction = ref(null)

// 筛选配置
const filterConfig = ref({
  type: '',
  categoryId: '',
  accountId: '',
  dateRange: null
})

// 筛选选项
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' }
]

// 计算属性
const allTransactions = computed(() => {
  return transactionStore.transactions.map(t => {
    const category = transactionStore.categories.find(c => c.id === t.categoryId)
    const account = transactionStore.accounts.find(a => a.id === t.accountId)
    const date = new Date(t.date)

    // 格式化时间
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = date.toDateString() === new Date(now.getTime() - 86400000).toDateString()

    let timeString
    if (isToday) {
      timeString = `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else if (isYesterday) {
      timeString = `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else {
      timeString = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    return {
      ...t,
      categoryIcon: category?.icon || 'money',
      categoryColor: category?.color || '#64CFB3',
      categoryName: category?.name || '其他',
      accountName: account?.name || '未知账户',
      time: timeString
    }
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredTransactions = computed(() => {
  let filtered = allTransactions.value

  // 基础类型筛选
  if (filterType.value !== 'all') {
    filtered = filtered.filter(t => t.type === filterType.value)
  }

  // 搜索关键词
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(keyword) ||
      (t.note && t.note.toLowerCase().includes(keyword))
    )
  }

  // 高级筛选
  if (filterConfig.value.type) {
    filtered = filtered.filter(t => t.type === filterConfig.value.type)
  }

  if (filterConfig.value.categoryId) {
    filtered = filtered.filter(t => t.categoryId === filterConfig.value.categoryId)
  }

  if (filterConfig.value.accountId) {
    filtered = filtered.filter(t => t.accountId === filterConfig.value.accountId)
  }

  if (filterConfig.value.dateRange && filterConfig.value.dateRange.length === 2) {
    const [startDate, endDate] = filterConfig.value.dateRange
    filtered = filtered.filter(t => {
      const transactionDate = dayjs(t.date)
      return transactionDate.isAfter(startDate.startOf('day')) &&
             transactionDate.isBefore(endDate.endOf('day'))
    })
  }

  return filtered
})

const groupedTransactions = computed(() => {
  const groups = {}

  filteredTransactions.value.forEach(transaction => {
    const date = new Date(transaction.date)
    const dateKey = date.toDateString()

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        dateLabel: getDateLabel(date),
        transactions: [],
        dayTotal: 0
      }
    }

    groups[dateKey].transactions.push(transaction)
    groups[dateKey].dayTotal += transaction.type === 'income' ? transaction.amount : -transaction.amount
  })

  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalBalance = computed(() => totalIncome.value - totalExpense.value)

const categories = computed(() => transactionStore.categories)
const accounts = computed(() => transactionStore.accounts)

// 移动端检测
const isMobile = computed(() => window.innerWidth <= 480)

// 方法
const getDateLabel = (date) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const handleFilterChange = (value) => {
  filterType.value = value
}

const handleSearch = () => {
  // 搜索在计算属性中实时进行
}

const closeSearchModal = () => {
  showSearchModal.value = false
  searchKeyword.value = ''
}

const closeFilterModal = () => {
  showFilterModal.value = false
  // 重置筛选条件
  filterConfig.value = {
    type: '',
    categoryId: '',
    accountId: '',
    dateRange: null
  }
}

const applyFilter = () => {
  showFilterModal.value = false
  message.success('筛选条件已应用')
}

const handleTransactionClick = (transaction) => {
  selectedTransaction.value = transaction
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedTransaction.value = null
}

const editTransaction = () => {
  message.info('编辑功能开发中...')
  closeDetailModal()
}

const deleteTransaction = () => {
  if (!selectedTransaction.value) return

  transactionStore.deleteTransaction(selectedTransaction.value.id)
  message.success('交易记录已删除')
  closeDetailModal()
}

// 生命周期
onMounted(() => {
  transactionStore.initData()
})
</script>

<style lang="scss" scoped>
.transactions-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #F5F7FB;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  overflow: hidden;
  padding: 20px 20px 0;

  @media (max-width: 768px) {
    padding: 16px 16px 0;
  }

  @media (max-width: 480px) {
    padding: 12px 12px 0;
  }
}

.content-scrollable {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 100px; // 底部tab安全距离
  -webkit-overflow-scrolling: touch; // iOS平滑滚动
}

.safe-bottom {
  height: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1F2324;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 8px;

    :deep(.ant-btn) {
      border: none;
      box-shadow: none;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(100, 207, 179, 0.1);
      }
    }
  }
}

.filter-section {
  margin-bottom: 20px;

  :deep(.ant-segmented) {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    border: 1px solid #EEF1F5;
    padding: 4px;

    .ant-segmented-item {
      border-radius: 8px;
      color: #667085;

      &.ant-segmented-item-selected {
        background: linear-gradient(135deg, #64CFB3, #6FD8D8);
        color: white;
      }
    }
  }
}

.summary-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid #EEF1F5;
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .summary-item {
    text-align: center;
    flex: 1;

    .summary-label {
      display: block;
      font-size: 12px;
      color: #A2A4A5;
      margin-bottom: 4px;
    }

    .summary-value {
      font-size: 16px;
      font-weight: 600;

      &.income {
        color: #64CFB3;
      }

      &.expense {
        color: #E76F51;
      }
    }
  }

  .summary-divider {
    width: 1px;
    height: 40px;
    background: #EEF1F5;
    margin: 0 20px;
  }
}

.transactions-list {
  .transaction-group {
    margin-bottom: 20px;

    .group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 8px;

      .group-date {
        font-size: 14px;
        color: #667085;
        font-weight: 500;
      }

      .group-amount {
        font-size: 14px;
        font-weight: 600;

        &.income {
          color: #64CFB3;
        }

        &.expense {
          color: #E76F51;
        }
      }
    }

    .transaction-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(6px);
      border: 1px solid #EEF1F5;
      border-radius: 12px;
      margin-bottom: 8px;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: rgba(100, 207, 179, 0.05);
        transform: translateY(-1px);
      }

      &:active {
        transform: scale(0.98);
      }

      .transaction-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }

      .transaction-info {
        flex: 1;

        .transaction-title {
          font-size: 16px;
          color: #1F2324;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .transaction-detail {
          font-size: 12px;
          color: #A2A4A5;
        }
      }

      .transaction-amount {
        font-size: 16px;
        font-weight: 600;

        &.expense {
          color: #E76F51;
        }

        &.income {
          color: #64CFB3;
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
    color: #1F2324;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .empty-subtitle {
    font-size: 14px;
    color: #A2A4A5;
  }
}

.filter-content {
  .filter-group {
    margin-bottom: 16px;

    label {
      display: block;
      font-size: 14px;
      color: #1F2324;
      font-weight: 500;
      margin-bottom: 8px;
    }

    :deep(.ant-select),
    :deep(.ant-picker) {
      .ant-select-selector,
      .ant-picker-input {
        border-radius: 8px;
      }
    }
  }
}

.transaction-detail-content {
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F5F7FB;

    &:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-size: 14px;
      color: #667085;
    }

    .detail-value {
      font-size: 14px;
      color: #1F2324;
      font-weight: 500;

      &.income {
        color: #64CFB3;
      }

      &.expense {
        color: #E76F51;
      }
    }
  }

  .detail-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: flex-end;

    :deep(.ant-btn) {
      border-radius: 8px;
    }
  }
}
</style>