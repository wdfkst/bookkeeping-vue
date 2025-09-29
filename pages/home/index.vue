<template>
  <view class="home-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{height: statusBarHeight + 'px'}"></view>

    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="user-info">
          <image class="avatar" src="@/static/default-avatar.png" mode="aspectFill" />
          <view class="greeting">
            <text class="time-text">{{ greetingText }}</text>
            <text class="username">{{ username }}的账本</text>
          </view>
        </view>
        <view class="navbar-actions">
          <text class="iconfont icon-search"></text>
          <text class="iconfont icon-bell"></text>
        </view>
      </view>
    </view>

    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="decoration-1"></view>
      <view class="decoration-2"></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 月度收支卡片 -->
      <view class="summary-card card">
        <view class="card-header">
          <view class="summary-info">
            <text class="label">本月收支</text>
            <view class="amount-info">
              <text class="amount">¥ {{ formatAmount(monthlyBalance) }}</text>
              <view class="trend" :class="trendClass">
                <text class="iconfont" :class="trendIcon"></text>
                <text class="percent">{{ trendPercent }}%</text>
              </view>
            </view>
          </view>
          <view class="time-info">
            <text class="iconfont icon-calendar"></text>
            <text class="month">{{ currentMonth }}月</text>
          </view>
        </view>

        <view class="income-expense-info">
          <view class="info-item">
            <view class="dot income-dot"></view>
            <text class="text">收入 ¥{{ formatAmount(monthlyIncome) }}</text>
          </view>
          <view class="info-item">
            <view class="dot expense-dot"></view>
            <text class="text">支出 ¥{{ formatAmount(monthlyExpense) }}</text>
          </view>
        </view>

        <!-- 环形图 -->
        <view class="chart-container">
          <canvas class="chart-canvas" canvas-id="donutChart" :style="{width: chartSize + 'px', height: chartSize + 'px'}"></canvas>
          <view class="chart-center">
            <text class="center-label">剩余</text>
            <text class="center-amount">¥ {{ formatAmount(monthlyBalance - monthlyExpense) }}</text>
          </view>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions">
        <view class="action-item" @click="quickAction('income')">
          <view class="action-icon income-bg">
            <text class="iconfont icon-plus"></text>
          </view>
          <text class="action-text">记收入</text>
        </view>
        <view class="action-item" @click="quickAction('expense')">
          <view class="action-icon expense-bg">
            <text class="iconfont icon-minus"></text>
          </view>
          <text class="action-text">记支出</text>
        </view>
        <view class="action-item" @click="quickAction('transfer')">
          <view class="action-icon transfer-bg">
            <text class="iconfont icon-transfer"></text>
          </view>
          <text class="action-text">转账</text>
        </view>
      </view>

      <!-- 最近流水 -->
      <view class="recent-transactions card">
        <view class="card-title">
          <text class="title">最近流水</text>
          <text class="more" @click="goToList">查看全部</text>
        </view>
        <view class="transaction-list">
          <view
            class="transaction-item"
            v-for="(item, index) in recentTransactions"
            :key="index"
            @click="viewTransaction(item)"
          >
            <view class="transaction-icon" :style="{background: item.categoryColor}">
              <text class="category-emoji">{{ item.categoryIcon }}</text>
            </view>
            <view class="transaction-info">
              <text class="transaction-title">{{ item.title }}</text>
              <text class="transaction-detail">{{ item.time }} · {{ item.account }}</text>
            </view>
            <text class="transaction-amount" :class="item.type === 'expense' ? 'expense-amount' : 'income-amount'">
              {{ item.type === 'expense' ? '-' : '+' }}¥ {{ formatAmount(item.amount) }}
            </text>
          </view>
        </view>

        <view v-if="recentTransactions.length === 0" class="empty-state">
          <text class="empty-text">暂无记录，快去记一笔吧～</text>
        </view>
      </view>

      <!-- 底部安全距离 -->
      <view class="safe-bottom"></view>
    </scroll-view>

    <!-- 悬浮按钮 -->
    <view class="fab" @click="showQuickAdd">
      <text class="iconfont icon-plus"></text>
    </view>

    <!-- 快捷记账弹窗 -->
    <view v-if="showQuickModal" class="quick-modal" @click="hideQuickAdd">
      <view class="modal-backdrop"></view>
      <view class="modal-content" @click.stop="">
        <view class="modal-handle"></view>
        <view class="quick-options">
          <view class="quick-option" @click="quickAdd('income')">
            <view class="option-icon income-bg">
              <text class="iconfont icon-plus"></text>
            </view>
            <text class="option-text">收入</text>
          </view>
          <view class="quick-option" @click="quickAdd('expense')">
            <view class="option-icon expense-bg">
              <text class="iconfont icon-minus"></text>
            </view>
            <text class="option-text">支出</text>
          </view>
          <view class="quick-option" @click="quickAdd('transfer')">
            <view class="option-icon transfer-bg">
              <text class="iconfont icon-transfer"></text>
            </view>
            <text class="option-text">转账</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/store/transaction'
import { formatAmount } from '@/utils/format'

// 获取系统信息
const statusBarHeight = ref(0)
const chartSize = ref(120)

// 数据状态
const username = ref('阿森')
const showQuickModal = ref(false)

// 使用状态管理
const transactionStore = useTransactionStore()

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
const trendIcon = computed(() => trendPercent.value >= 0 ? 'icon-arrow-up' : 'icon-arrow-down')

const recentTransactions = computed(() => transactionStore.recentTransactions)

// 生命周期
onMounted(() => {
  // 获取系统信息
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 20
    }
  })

  // 初始化数据
  transactionStore.initData()
  initChart()
})

// 方法
const showQuickAdd = () => {
  showQuickModal.value = true
}

const hideQuickAdd = () => {
  showQuickModal.value = false
}

const quickAction = (type) => {
  uni.navigateTo({
    url: `/pages/add/index?type=${type}`
  })
}

const quickAdd = (type) => {
  hideQuickAdd()
  quickAction(type)
}

const goToList = () => {
  uni.switchTab({
    url: '/pages/list/index'
  })
}

const viewTransaction = (transaction) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${transaction.id}`
  })
}

// 初始化图表
const initChart = () => {
  // 这里可以集成图表库来绘制环形图
  // 暂时使用占位逻辑
  setTimeout(() => {
    console.log('Chart initialized')
  }, 500)
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: $bg-color;
  position: relative;
}

.status-bar {
  background: transparent;
}

.custom-navbar {
  background: transparent;
  padding: $spacing-md $spacing-xl 0;

  .navbar-content {
    @extend .flex-between;
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

.summary-card {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  position: relative;
  overflow: hidden;

  .card-header {
    @extend .flex-between;
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
    @extend .flex-center;

    .chart-canvas {
      background: transparent;
    }

    .chart-center {
      position: absolute;
      @extend .flex-center;
      flex-direction: column;

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
  @extend .grid-3;
  margin: $spacing-lg 0;

  .action-item {
    @extend .card;
    padding: $spacing-md;
    text-align: center;
    @extend .transition;

    &:active {
      transform: scale(0.95);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: $radius-md;
      @extend .flex-center;
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
    @extend .flex-between;
    margin-bottom: $spacing-lg;

    .title {
      font-size: $font-md;
      font-weight: 500;
      color: $text-primary;
    }

    .more {
      color: $secondary-color;
      font-size: $font-xs;
    }
  }

  .transaction-list {
    .transaction-item {
      @extend .flex-between;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-color;
      @extend .transition;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background: rgba(100, 207, 179, 0.05);
        margin: 0 -#{$spacing-lg};
        padding: $spacing-md $spacing-lg;
        border-radius: $radius-sm;
      }

      .transaction-icon {
        width: 40px;
        height: 40px;
        border-radius: $radius-md;
        @extend .flex-center;
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
  @extend .fab;

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
      @extend .grid-3;
      gap: $spacing-lg;

      .quick-option {
        text-align: center;
        @extend .transition;

        &:active {
          transform: scale(0.95);
        }

        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: $radius-md;
          @extend .flex-center;
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