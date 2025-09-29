<template>
  <div class="home-page">
    <!-- 自定义导航栏 -->
    <div class="custom-navbar">
      <div class="navbar-content">
        <div class="user-info">
          <img class="avatar" src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face" alt="头像" />
          <div class="greeting">
            <span class="time-text">{{ greetingText }}</span>
            <span class="username">{{ username }}的账本</span>
          </div>
        </div>
        <div class="navbar-actions">
          <SvgIcon name="search" :size="20" color="#667085" />
          <div @click="refreshData" style="cursor: pointer;">
            <SvgIcon name="bell" :size="20" color="#667085" />
          </div>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="decoration-1"></div>
      <div class="decoration-2"></div>
    </div>

    <div class="content-area">
      <!-- 月度收支卡片 -->
      <div class="summary-card card">
        <div class="card-header">
          <div class="summary-info">
            <span class="label">本月收支</span>
            <div class="amount-info">
              <span class="amount">¥ {{ formatAmount(monthlyBalance) }}</span>
              <div class="trend" :class="trendClass">
                <SvgIcon :name="trendIcon" :size="14" :color="trendClass === 'up' ? '#64CFB3' : '#E76F51'" />
                <span class="percent">{{ trendPercent }}%</span>
              </div>
            </div>
          </div>
          <div class="time-info">
            <SvgIcon name="calendar" :size="16" color="#667085" />
            <span class="month">{{ currentMonth }}月</span>
          </div>
        </div>

        <div class="income-expense-info">
          <div class="info-item">
            <div class="dot income-dot"></div>
            <span class="text">收入 ¥{{ formatAmount(monthlyIncome) }}</span>
          </div>
          <div class="info-item">
            <div class="dot expense-dot"></div>
            <span class="text">支出 ¥{{ formatAmount(monthlyExpense) }}</span>
          </div>
        </div>

        <!-- 环形图 -->
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="chart-center">
              <span class="center-label">剩余</span>
              <span class="center-amount">¥ {{ formatAmount(monthlyBalance - monthlyExpense) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <div class="action-item" @click="quickAction('income')">
          <div class="action-icon income-bg">
            <SvgIcon name="plus" :size="20" color="white" />
          </div>
          <span class="action-text">记收入</span>
        </div>
        <div class="action-item" @click="quickAction('expense')">
          <div class="action-icon expense-bg">
            <SvgIcon name="minus" :size="20" color="white" />
          </div>
          <span class="action-text">记支出</span>
        </div>
        <div class="action-item" @click="quickAction('transfer')">
          <div class="action-icon transfer-bg">
            <SvgIcon name="transfer" :size="20" color="white" />
          </div>
          <span class="action-text">转账</span>
        </div>
      </div>

      <!-- 最近流水 -->
      <div class="recent-transactions card">
        <div class="card-title">
          <span class="title">最近流水</span>
          <span class="more" @click="goToList">查看全部</span>
        </div>
        <div class="transaction-list">
          <div
            class="transaction-item"
            v-for="(item, index) in recentTransactions"
            :key="index"
            @click="viewTransaction(item)"
          >
            <div class="transaction-icon" :style="{background: item.categoryColor}">
              <SvgIcon :name="item.categoryIcon" :size="16" color="white" />
            </div>
            <div class="transaction-info">
              <span class="transaction-title">{{ item.title }}</span>
              <span class="transaction-detail">{{ item.time }} · {{ item.accountName }} · {{ item.categoryName }}</span>
            </div>
            <span class="transaction-amount" :class="item.type === 'expense' ? 'expense-amount' : 'income-amount'">
              {{ item.type === 'expense' ? '-' : '+' }}¥ {{ formatAmount(item.amount) }}
            </span>
          </div>
        </div>

        <div v-if="recentTransactions.length === 0" class="empty-state">
          <span class="empty-text">暂无记录，快去记一笔吧～</span>
        </div>
      </div>

      <!-- 底部安全距离 -->
      <div class="safe-bottom"></div>
    </div>

    <!-- 悬浮按钮 -->
    <div class="fab" @click="showQuickAdd">
      <SvgIcon name="plus" :size="24" color="white" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useTransactionStore } from '@/store/transaction'
import { formatAmount } from '@/utils/format'

// 数据状态
const username = ref('阿森')

// 使用状态管理
const transactionStore = useTransactionStore()

// 定义事件
const emit = defineEmits(['open-add-modal'])

// 计算属性
const currentMonth = computed(() => new Date().getMonth() + 1)

const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早安'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const monthlyIncome = computed(() => transactionStore.monthlyIncome)
const monthlyExpense = computed(() => transactionStore.monthlyExpense)
const monthlyBalance = computed(() => monthlyIncome.value - monthlyExpense.value)

const trendPercent = computed(() => transactionStore.monthlyTrend)
const trendClass = computed(() => trendPercent.value >= 0 ? 'trend-up' : 'trend-down')
const trendIcon = computed(() => {
  return trendPercent.value > 0 ? 'trending-up' : 'trending-down'
})

const recentTransactions = computed(() => transactionStore.recentTransactions)

// 生命周期
onMounted(() => {
  // 初始化数据
  transactionStore.initData()

  // 更新时间显示
  updateTime()

  // 每分钟更新一次时间
  setInterval(() => {
    updateTime()
  }, 60000)
})

// 更新时间显示
const updateTime = () => {
  const hour = new Date().getHours()
  if (hour < 6) {
    greetingText.value = '夜深了'
  } else if (hour < 12) {
    greetingText.value = '早上好'
  } else if (hour < 18) {
    greetingText.value = '下午好'
  } else {
    greetingText.value = '晚上好'
  }
}

// 方法
const showQuickAdd = () => {
  // 直接打开记账弹窗，而不是显示快捷操作弹窗
  emit('open-add-modal', 'expense')
}

const hideQuickAdd = () => {
  // 已废弃，保留用于兼容性
}

const quickAction = (type) => {
  console.log('快捷操作:', type)
  // 触发弹窗
  emit('open-add-modal', type)
}

const goToList = () => {
  console.log('跳转到流水列表')
  // 这里应该切换到transactions页面
  alert('即将跳转到流水页面')
}

const viewTransaction = (transaction) => {
  console.log('查看交易详情:', transaction)
  alert(`查看交易: ${transaction.title} - ¥${transaction.amount}`)
}

// 模拟刷新数据
const refreshData = () => {
  console.log('刷新数据')
  transactionStore.initData()
  alert('数据已刷新')
}
</script>

<style lang="scss" scoped>
// 颜色变量
$primary-color: #64CFB3;
$secondary-color: #6FD8D8;
$accent-color: #ADA9E4;
$expense-color: #E9A0A5;
$income-color: #64CFB3;
$warning-color: #F2D6A7;
$text-primary: #1F2324;
$text-secondary: #A2A4A5;
$text-light: #667085;
$bg-color: #F5F7FB;
$border-color: #EEF1F5;
$white: #FFFFFF;

// 渐变色
$gradient-primary: linear-gradient(135deg, #{$primary-color}, #{$secondary-color});
$gradient-expense: linear-gradient(135deg, #{$expense-color}, #{$warning-color});
$gradient-income: linear-gradient(135deg, #{$primary-color}, #{$secondary-color});
$gradient-accent: linear-gradient(135deg, #{$accent-color}, #{$secondary-color});

// 阴影
$shadow-card: 0 12px 28px rgba(16, 24, 40, 0.06);
$shadow-fab: 0 18px 38px rgba(100, 207, 179, 0.45);

// 圆角
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 18px;

// 字体大小
$font-xs: 12px;
$font-sm: 14px;
$font-md: 16px;
$font-lg: 18px;
$font-xxl: 30px;

// 间距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 20px;
$spacing-xxl: 24px;

.home-page {
  min-height: 100vh;
  background: $bg-color;
  position: relative;
}

.custom-navbar {
  background: transparent;
  padding: $spacing-md $spacing-xl 0;

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: $radius-md;
      object-fit: cover;
    }

    .greeting {
      .time-text {
        color: $text-secondary;
        font-size: $font-xs;
        display: block;
      }

      .username {
        color: $text-primary;
        font-size: $font-md;
        font-weight: 500;
        display: block;
      }
    }
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: $spacing-lg;

    .iconfont {
      font-size: 20px;
      color: $text-light;
      cursor: pointer;
    }
  }
}

.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;

  .decoration-1 {
    position: absolute;
    top: -96px;
    left: -96px;
    width: 288px;
    height: 288px;
    border-radius: 50%;
    background: radial-gradient(120px 120px at 60% 40%, rgba(111, 216, 216, 0.6), transparent 70%),
                radial-gradient(140px 140px at 20% 60%, rgba(173, 169, 228, 0.6), transparent 70%);
    filter: blur(48px);
  }

  .decoration-2 {
    position: absolute;
    bottom: -96px;
    right: -96px;
    width: 288px;
    height: 288px;
    border-radius: 50%;
    background: radial-gradient(120px 120px at 40% 50%, rgba(233, 160, 165, 0.6), transparent 70%),
                radial-gradient(140px 140px at 80% 50%, rgba(100, 207, 179, 0.6), transparent 70%);
    filter: blur(48px);
  }
}

.content-area {
  flex: 1;
  padding: 0 $spacing-xl;
}

.card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.summary-card {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  position: relative;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-lg;

    .summary-info {
      .label {
        color: $text-secondary;
        font-size: $font-xs;
        display: block;
        margin-bottom: $spacing-xs;
      }

      .amount-info {
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        .amount {
          font-size: $font-xxl;
          font-weight: bold;
          color: $text-primary;
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: $font-xs;

          &.trend-up {
            color: $income-color;
          }

          &.trend-down {
            color: $expense-color;
          }
        }
      }
    }

    .time-info {
      display: flex;
      align-items: center;
      gap: 4px;
      color: $text-secondary;
      font-size: $font-xs;
    }
  }

  .income-expense-info {
    display: flex;
    gap: $spacing-xl;
    margin-bottom: $spacing-lg;

    .info-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .income-dot {
        background: $income-color;
      }

      .expense-dot {
        background: $expense-color;
      }

      .text {
        color: $text-light;
        font-size: $font-xs;
      }
    }
  }

  .chart-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .chart-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(100,207,179,0.15), rgba(173,169,228,0.15));
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .center-label {
        color: $text-secondary;
        font-size: $font-xs;
      }

      .center-amount {
        color: $text-primary;
        font-size: 20px;
        font-weight: 600;
        margin-top: 2px;
      }
    }
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
  margin: $spacing-lg 0;

  .action-item {
    @extend .card;
    padding: $spacing-md;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;

    &:active {
      transform: scale(0.95);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-sm;

      .iconfont {
        color: $white;
        font-size: 24px;
      }
    }

    .income-bg {
      background: $gradient-income;
    }

    .expense-bg {
      background: $gradient-expense;
    }

    .transfer-bg {
      background: $gradient-accent;
    }

    .action-text {
      color: $text-light;
      font-size: $font-xs;
    }
  }
}

.recent-transactions {
  padding: $spacing-lg;

  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-lg;

    .title {
      font-size: $font-md;
      font-weight: 500;
      color: $text-primary;
    }

    .more {
      color: $secondary-color;
      font-size: $font-xs;
      cursor: pointer;
    }
  }

  .transaction-list {
    .transaction-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-color;
      transition: all 0.3s ease;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(100, 207, 179, 0.05);
        margin: 0 -#{$spacing-lg};
        padding: $spacing-md $spacing-lg;
        border-radius: $radius-sm;
      }

      .transaction-icon {
        width: 40px;
        height: 40px;
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: $spacing-md;

        .category-emoji {
          font-size: 20px;
        }
      }

      .transaction-info {
        flex: 1;

        .transaction-title {
          color: $text-primary;
          font-size: $font-sm;
          display: block;
          margin-bottom: 2px;
        }

        .transaction-detail {
          color: $text-secondary;
          font-size: $font-xs;
        }
      }

      .transaction-amount {
        font-size: $font-sm;
        font-weight: 500;

        &.income-amount {
          color: $income-color;
        }

        &.expense-amount {
          color: $expense-color;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: $spacing-xxl 0;

    .empty-text {
      color: $text-secondary;
      font-size: $font-sm;
    }
  }
}

.fab {
  position: fixed;
  bottom: 90px;
  right: $spacing-xl;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $gradient-primary;
  box-shadow: $shadow-fab;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  .iconfont {
    color: $white;
    font-size: 24px;
  }
}

.quick-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(11, 16, 32, 0.4);
    backdrop-filter: blur(4px);
  }

  .modal-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border-radius: $radius-lg $radius-lg 0 0;
    padding: $spacing-lg;
    border-top: 1px solid $border-color;

    .modal-handle {
      width: 48px;
      height: 4px;
      background: #E5E7EB;
      border-radius: 2px;
      margin: 0 auto $spacing-md;
    }

    .quick-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-lg;

      .quick-option {
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;

        &:active {
          transform: scale(0.95);
        }

        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: $radius-md;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto $spacing-sm;

          .iconfont {
            color: $white;
            font-size: 24px;
          }
        }

        .option-text {
          color: $text-light;
          font-size: $font-xs;
        }
      }
    }
  }
}

.safe-bottom {
  height: 120px;
}
</style>