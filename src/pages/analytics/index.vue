<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1 class="page-title">数据分析</h1>
      <div class="time-selector">
        <a-segmented
          v-model:value="timeMode"
          :options="timeModeOptions"
          @change="handleTimeModeChange"
        />
      </div>
    </div>

    <div class="content-scrollable">
      <!-- 总览卡片 -->
      <div class="overview-cards">
        <div class="overview-card income">
          <div class="card-icon">
            <SvgIcon name="graph" :size="24" color="white" />
          </div>
          <div class="card-info">
            <div class="card-label">{{ timeModeLabel }}收入</div>
            <div class="card-amount">¥{{ formatAmount(currentIncome) }}</div>
            <div class="card-trend" :class="incomeTrend >= 0 ? 'up' : 'down'">
              {{ incomeTrend >= 0 ? '+' : '' }}{{ incomeTrend.toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="overview-card expense">
          <div class="card-icon">
            <SvgIcon name="outlay" :size="24" color="white" />
          </div>
          <div class="card-info">
            <div class="card-label">{{ timeModeLabel }}支出</div>
            <div class="card-amount">¥{{ formatAmount(currentExpense) }}</div>
            <div class="card-trend" :class="expenseTrend >= 0 ? 'up' : 'down'">
              {{ expenseTrend >= 0 ? '+' : '' }}{{ expenseTrend.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>

    <!-- 趋势图表 -->
    <div class="chart-section card">
      <div class="section-header">
        <h3 class="section-title">收支趋势</h3>
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-dot income"></div>
            <span>收入</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot expense"></div>
            <span>支出</span>
          </div>
        </div>
      </div>
      <div class="chart-container">
        <div class="trend-chart-wrapper">
          <div class="chart-grid">
            <div v-for="(_, index) in 7" :key="index" class="grid-line"></div>
          </div>
          <div class="chart-data">
            <div
              v-for="(item, index) in trendData"
              :key="index"
              class="data-point"
              :style="{ left: (index / (trendData.length - 1)) * 100 + '%' }"
            >
              <div
                class="income-bar"
                :style="{ height: (item.income / maxAmount) * 80 + 'px' }"
                @click="showTrendDetail(item, 'income')"
              ></div>
              <div
                class="expense-bar"
                :style="{ height: (item.expense / maxAmount) * 80 + 'px' }"
                @click="showTrendDetail(item, 'expense')"
              ></div>
              <div class="date-label">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类分析 -->
    <div class="category-section card">
      <div class="section-header">
        <h3 class="section-title">{{ currentType === 'expense' ? '支出' : '收入' }}分类</h3>
        <div class="type-toggle">
          <a-segmented
            v-model:value="currentType"
            :options="typeOptions"
            size="small"
          />
        </div>
      </div>
      <div class="category-chart">
        <div class="donut-chart" v-if="categoryStats.length > 0">
          <div
            class="donut-ring"
            :style="{ background: donutGradient }"
          ></div>
          <div class="chart-center">
            <div class="center-amount">¥{{ formatAmount(totalCategoryAmount) }}</div>
            <div class="center-label">总{{ currentType === 'expense' ? '支出' : '收入' }}</div>
          </div>
        </div>
        <div class="category-list">
          <div
            v-for="(category, index) in categoryStats"
            :key="category.id"
            class="category-item"
            @click="viewCategoryDetail(category)"
          >
            <div class="category-info">
              <div class="category-icon" :style="{ background: category.color }">
                <SvgIcon :name="category.icon" :size="16" color="white" />
              </div>
              <div class="category-details">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-percent">{{ category.percent.toFixed(1) }}%</div>
              </div>
            </div>
            <div class="category-amount">¥{{ formatAmount(category.amount) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 账户分析 -->
    <div class="account-section card">
      <div class="section-header">
        <h3 class="section-title">账户分布</h3>
        <a-button type="text" size="small" @click="showAccountModal = true">
          查看详情
        </a-button>
      </div>
      <div class="account-list">
        <div
          v-for="account in accountStats"
          :key="account.id"
          class="account-item"
        >
          <div class="account-info">
            <span class="account-icon">{{ account.icon }}</span>
            <div class="account-details">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-transactions">{{ account.transactionCount }}笔交易</div>
            </div>
          </div>
          <div class="account-amount">
            <div class="balance">¥{{ formatAmount(account.balance) }}</div>
            <div class="total-amount">总流水 ¥{{ formatAmount(account.totalAmount) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <a-modal
      v-model:open="showAccountModal"
      title="账户详情"
      :footer="null"
      width="90%"
      style="max-width: 400px;"
    >
      <div class="account-modal-content">
        <div
          v-for="account in accountStats"
          :key="account.id"
          class="account-detail-item"
        >
          <div class="account-header">
            <span class="account-icon">{{ account.icon }}</span>
            <div class="account-info">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-balance">余额：¥{{ formatAmount(account.balance) }}</div>
            </div>
          </div>
          <div class="account-stats">
            <div class="stat-item">
              <span class="stat-label">总收入</span>
              <span class="stat-value income">+¥{{ formatAmount(account.totalIncome) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">总支出</span>
              <span class="stat-value expense">-¥{{ formatAmount(account.totalExpense) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">交易笔数</span>
              <span class="stat-value">{{ account.transactionCount }}笔</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 底部安全距离 -->
    <div class="safe-bottom"></div>
    </div>
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

// 响应式数据
const timeMode = ref('monthly')
const currentType = ref('expense')
const showAccountModal = ref(false)

// 时间模式选项
const timeModeOptions = [
  { label: '月度', value: 'monthly' },
  { label: '年度', value: 'yearly' }
]

// 类型选项
const typeOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' }
]

// 计算属性
const timeModeLabel = computed(() => {
  return timeMode.value === 'monthly' ? '本月' : '本年'
})

// 获取当前时间范围的交易数据
const currentTransactions = computed(() => {
  const now = dayjs()
  let startDate, endDate

  if (timeMode.value === 'monthly') {
    startDate = now.startOf('month')
    endDate = now.endOf('month')
  } else {
    startDate = now.startOf('year')
    endDate = now.endOf('year')
  }

  return transactionStore.transactions.filter(t => {
    const transactionDate = dayjs(t.date)
    return transactionDate.isAfter(startDate) && transactionDate.isBefore(endDate)
  })
})

// 上期交易数据（用于计算趋势）
const previousTransactions = computed(() => {
  const now = dayjs()
  let startDate, endDate

  if (timeMode.value === 'monthly') {
    startDate = now.subtract(1, 'month').startOf('month')
    endDate = now.subtract(1, 'month').endOf('month')
  } else {
    startDate = now.subtract(1, 'year').startOf('year')
    endDate = now.subtract(1, 'year').endOf('year')
  }

  return transactionStore.transactions.filter(t => {
    const transactionDate = dayjs(t.date)
    return transactionDate.isAfter(startDate) && transactionDate.isBefore(endDate)
  })
})

// 当前收入和支出
const currentIncome = computed(() => {
  return currentTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const currentExpense = computed(() => {
  return currentTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

// 趋势百分比
const incomeTrend = computed(() => {
  const previousIncome = previousTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  if (previousIncome === 0) return currentIncome.value > 0 ? 100 : 0
  return ((currentIncome.value - previousIncome) / previousIncome) * 100
})

const expenseTrend = computed(() => {
  const previousExpense = previousTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (previousExpense === 0) return currentExpense.value > 0 ? 100 : 0
  return ((currentExpense.value - previousExpense) / previousExpense) * 100
})

// 趋势图表数据
const trendData = computed(() => {
  const data = []
  const now = dayjs()

  if (timeMode.value === 'monthly') {
    // 生成最近7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = now.subtract(i, 'day')
      const dayTransactions = currentTransactions.value.filter(t =>
        dayjs(t.date).isSame(date, 'day')
      )

      data.push({
        label: date.format('MM/DD'),
        date: date.format('YYYY-MM-DD'),
        income: dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expense: dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      })
    }
  } else {
    // 生成最近12个月的数据
    for (let i = 11; i >= 0; i--) {
      const month = now.subtract(i, 'month')
      const monthTransactions = transactionStore.transactions.filter(t =>
        dayjs(t.date).isSame(month, 'month')
      )

      data.push({
        label: month.format('MM月'),
        date: month.format('YYYY-MM'),
        income: monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expense: monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      })
    }
  }

  return data
})

// 图表最大值
const maxAmount = computed(() => {
  const amounts = trendData.value.flatMap(item => [item.income, item.expense])
  return Math.max(...amounts, 1000) // 最小值1000，避免除0
})

// 分类统计
const categoryStats = computed(() => {
  const categoryMap = new Map()
  const filteredTransactions = currentTransactions.value.filter(t => t.type === currentType.value)

  filteredTransactions.forEach(transaction => {
    const category = transactionStore.categories.find(c => c.id === transaction.categoryId)
    if (category) {
      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, {
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          amount: 0,
          count: 0
        })
      }

      const stats = categoryMap.get(category.id)
      stats.amount += transaction.amount
      stats.count += 1
    }
  })

  const total = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.amount, 0)

  return Array.from(categoryMap.values())
    .map(item => ({
      ...item,
      percent: total > 0 ? (item.amount / total) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5) // 只显示前5个分类
})

// 总分类金额
const totalCategoryAmount = computed(() => {
  return categoryStats.value.reduce((sum, item) => sum + item.amount, 0)
})

// 环形图渐变
const donutGradient = computed(() => {
  if (categoryStats.value.length === 0) return 'conic-gradient(#EEF1F5 0 360deg)'

  let angle = 0
  const segments = categoryStats.value.map(item => {
    const segmentAngle = (item.percent / 100) * 360
    const segment = `${item.color} ${angle}deg ${angle + segmentAngle}deg`
    angle += segmentAngle
    return segment
  })

  // 填充剩余部分
  if (angle < 360) {
    segments.push(`#EEF1F5 ${angle}deg 360deg`)
  }

  return `conic-gradient(${segments.join(', ')})`
})

// 账户统计
const accountStats = computed(() => {
  return transactionStore.accounts.map(account => {
    const accountTransactions = currentTransactions.value.filter(t => t.accountId === account.id)
    const totalIncome = accountTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = accountTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      ...account,
      transactionCount: accountTransactions.length,
      totalIncome,
      totalExpense,
      totalAmount: totalIncome + totalExpense
    }
  })
})

// 方法
const handleTimeModeChange = (value) => {
  timeMode.value = value
  message.success(`已切换到${value === 'monthly' ? '月度' : '年度'}分析`)
}

const showTrendDetail = (item, type) => {
  const amount = type === 'income' ? item.income : item.expense
  const typeText = type === 'income' ? '收入' : '支出'
  message.info(`${item.label} ${typeText}：¥${formatAmount(amount)}`)
}

const viewCategoryDetail = (category) => {
  message.info(`${category.name}：¥${formatAmount(category.amount)} (${category.count}笔)`)
}

// 生命周期
onMounted(() => {
  transactionStore.initData()
})
</script>

<style lang="scss" scoped>
.analytics-page {
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
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1F2324;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }

  .time-selector {
    :deep(.ant-segmented) {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      border: 1px solid #EEF1F5;
      padding: 4px;

      @media (max-width: 480px) {
        width: 100%;
      }

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
}

.card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid #EEF1F5;
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
}

.overview-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .overview-card {
    @extend .card;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 480px) {
      padding: 16px;
      gap: 12px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;

      @media (max-width: 480px) {
        width: 40px;
        height: 40px;
      }
    }

    &.income .card-icon {
      background: linear-gradient(135deg, #64CFB3, #6FD8D8);
    }

    &.expense .card-icon {
      background: linear-gradient(135deg, #E9A0A5, #F2D6A7);
    }

    .card-info {
      flex: 1;
      min-width: 0;

      .card-label {
        font-size: 12px;
        color: #A2A4A5;
        margin-bottom: 4px;
      }

      .card-amount {
        font-size: 18px;
        font-weight: 600;
        color: #1F2324;
        margin-bottom: 4px;

        @media (max-width: 480px) {
          font-size: 16px;
        }
      }

      .card-trend {
        font-size: 12px;
        font-weight: 500;

        &.up {
          color: #64CFB3;
        }

        &.down {
          color: #E9A0A5;
        }
      }
    }
  }
}

.chart-section {
  padding: 20px;
  margin-bottom: 20px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1F2324;
      margin: 0;
    }

    .chart-legend {
      display: flex;
      gap: 16px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #667085;

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.income {
            background: #64CFB3;
          }

          &.expense {
            background: #E9A0A5;
          }
        }
      }
    }
  }

  .chart-container {
    .trend-chart-wrapper {
      position: relative;
      height: 120px;
      padding: 20px 10px;
      background: #fafbfc;
      border-radius: 12px;
      overflow: hidden;

      @media (max-width: 480px) {
        height: 100px;
        padding: 15px 8px;
      }

      .chart-grid {
        position: absolute;
        top: 20px;
        left: 10px;
        right: 10px;
        bottom: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        opacity: 0.1;

        @media (max-width: 480px) {
          top: 15px;
          left: 8px;
          right: 8px;
          bottom: 30px;
        }

        .grid-line {
          height: 1px;
          background: #667085;
        }
      }

      .chart-data {
        position: relative;
        height: calc(100% - 40px);
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 0 10px;
        margin-top: 20px;

        @media (max-width: 480px) {
          height: calc(100% - 30px);
          padding: 0 8px;
          margin-top: 15px;
        }

        .data-point {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          flex: 1;
          max-width: 40px;

          @media (max-width: 480px) {
            max-width: 30px;
          }

          .income-bar, .expense-bar {
            width: 8px;
            border-radius: 4px 4px 0 0;
            margin-bottom: 2px;
            transition: all 0.3s ease;
            min-height: 2px;
            position: relative;

            @media (max-width: 480px) {
              width: 6px;
              border-radius: 3px 3px 0 0;
            }
          }

          .income-bar {
            background: linear-gradient(180deg, #64CFB3, #6FD8D8);
            margin-left: 2px;
          }

          .expense-bar {
            background: linear-gradient(180deg, #E9A0A5, #F2D6A7);
            margin-left: -2px;
          }

          .date-label {
            font-size: 10px;
            color: #A2A4A5;
            margin-top: 8px;
            white-space: nowrap;
            text-align: center;

            @media (max-width: 480px) {
              font-size: 9px;
              margin-top: 6px;
            }
          }

          &:hover {
            .income-bar, .expense-bar {
              transform: scaleY(1.1);
              filter: brightness(1.1);
            }
          }
        }
      }
    }
  }
}

.category-section {
  padding: 20px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    padding: 16px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1F2324;
      margin: 0;
    }

    .type-toggle {
      :deep(.ant-segmented) {
        .ant-segmented-item {
          padding: 4px 12px;
          font-size: 12px;

          &.ant-segmented-item-selected {
            background: linear-gradient(135deg, #64CFB3, #6FD8D8);
            color: white;
          }
        }
      }
    }
  }

  .category-chart {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 16px;
    }

    .donut-chart {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: relative;
      flex-shrink: 0;

      @media (max-width: 480px) {
        width: 80px;
        height: 80px;
      }

      .donut-ring {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;

          @media (max-width: 480px) {
            top: 12px;
            left: 12px;
            right: 12px;
            bottom: 12px;
          }
        }
      }

      .chart-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1;

        .center-amount {
          font-size: 14px;
          font-weight: 600;
          color: #1F2324;

          @media (max-width: 480px) {
            font-size: 12px;
          }
        }

        .center-label {
          font-size: 10px;
          color: #A2A4A5;

          @media (max-width: 480px) {
            font-size: 9px;
          }
        }
      }
    }

    .category-list {
      flex: 1;
      width: 100%;

      .category-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 8px;

        &:hover {
          background: rgba(100, 207, 179, 0.05);
          padding: 8px 12px;
          margin: 0 -12px;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;

          .category-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;

            @media (max-width: 480px) {
              width: 28px;
              height: 28px;
              font-size: 14px;
            }
          }

          .category-details {
            min-width: 0;
            flex: 1;

            .category-name {
              font-size: 14px;
              color: #1F2324;
              font-weight: 500;

              @media (max-width: 480px) {
                font-size: 13px;
              }
            }

            .category-percent {
              font-size: 12px;
              color: #A2A4A5;

              @media (max-width: 480px) {
                font-size: 11px;
              }
            }
          }
        }

        .category-amount {
          font-size: 14px;
          font-weight: 600;
          color: #1F2324;
          flex-shrink: 0;

          @media (max-width: 480px) {
            font-size: 13px;
          }
        }
      }
    }
  }
}
// 新增账户分析样式
.account-section {
  padding: 20px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    padding: 16px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1F2324;
      margin: 0;
    }
  }

  .account-list {
    .account-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #EEF1F5;

      @media (max-width: 480px) {
        padding: 12px 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .account-info {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        flex: 1;

        .account-icon {
          font-size: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(100, 207, 179, 0.1);
          border-radius: 12px;
          flex-shrink: 0;

          @media (max-width: 480px) {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
        }

        .account-details {
          min-width: 0;
          flex: 1;

          .account-name {
            font-size: 14px;
            color: #1F2324;
            font-weight: 500;
            margin-bottom: 2px;

            @media (max-width: 480px) {
              font-size: 13px;
            }
          }

          .account-transactions {
            font-size: 12px;
            color: #A2A4A5;

            @media (max-width: 480px) {
              font-size: 11px;
            }
          }
        }
      }

      .account-amount {
        text-align: right;
        flex-shrink: 0;

        .balance {
          font-size: 16px;
          font-weight: 600;
          color: #1F2324;
          margin-bottom: 2px;

          @media (max-width: 480px) {
            font-size: 14px;
          }
        }

        .total-amount {
          font-size: 12px;
          color: #A2A4A5;

          @media (max-width: 480px) {
            font-size: 11px;
          }
        }
      }
    }
  }
}

// 账户详情弹窗样式
.account-modal-content {
  .account-detail-item {
    margin-bottom: 20px;
    padding: 16px;
    background: #F5F7FB;
    border-radius: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .account-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .account-icon {
        font-size: 20px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(100, 207, 179, 0.1);
        border-radius: 12px;
      }

      .account-info {
        .account-name {
          font-size: 16px;
          color: #1F2324;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .account-balance {
          font-size: 14px;
          color: #667085;
        }
      }
    }

    .account-stats {
      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #E5E7EB;

        &:last-child {
          border-bottom: none;
        }

        .stat-label {
          font-size: 14px;
          color: #667085;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: #1F2324;

          &.income {
            color: #64CFB3;
          }

          &.expense {
            color: #E9A0A5;
          }
        }
      }
    }
  }
}
</style>