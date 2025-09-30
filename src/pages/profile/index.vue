<template>
  <div class="profile-page">
    <!-- 用户头部信息 -->
    <div class="profile-header">
      <div class="avatar-section">
        <img
          class="avatar"
          src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&h=120&fit=crop&crop=face"
          alt="头像"
          @click="showEditProfile = true"
        />
        <div class="user-info">
          <h2 class="username">{{ userInfo.name }}</h2>
          <p class="user-status">{{ userInfo.status }} · 已坚持 {{ userStats.daysCount }} 天</p>
        </div>
        <a-button type="text" @click="showEditProfile = true" class="edit-btn">
          <SvgIcon name="edit-alt" :size="20" color="white" />
        </a-button>
      </div>
    </div>

    <div class="content-scrollable">
      <!-- 统计卡片 -->
      <div class="stats-section">
        <div class="stats-card">
          <div class="stat-item" @click="showAssetDetail = true">
            <div class="stat-number">¥{{ formatAmount(userStats.totalAssets) }}</div>
            <div class="stat-label">总资产</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ userStats.daysCount }}</div>
            <div class="stat-label">记账天数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">¥{{ formatAmount(userStats.monthlyBalance) }}</div>
            <div class="stat-label">本月结余</div>
          </div>
        </div>
      </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="showAccountManager = true">
          <div class="menu-icon wallet">
            <SvgIcon name="wallet-alt" :size="20" color="white" />
          </div>
          <div class="menu-content">
            <div class="menu-title">我的账户</div>
            <div class="menu-subtitle">{{ accountSummary }}</div>
          </div>
          <div class="menu-arrow">
            <SvgIcon name="arrow" :size="16" color="#A2A4A5" />
          </div>
        </div>

        <div class="menu-item" @click="showBudgetManager = true">
          <div class="menu-icon budget">
            <SvgIcon name="graph" :size="20" color="white" />
          </div>
          <div class="menu-content">
            <div class="menu-title">预算管理</div>
            <div class="menu-subtitle">设置分类预算和提醒</div>
          </div>
          <div class="menu-arrow">
            <SvgIcon name="arrow" :size="16" color="#A2A4A5" />
          </div>
        </div>

        <div class="menu-item" @click="showCategoryManager = true">
          <div class="menu-icon category">
            <SvgIcon name="menu" :size="20" color="white" />
          </div>
          <div class="menu-content">
            <div class="menu-title">分类管理</div>
            <div class="menu-subtitle">{{ categorySummary }}</div>
          </div>
          <div class="menu-arrow">
            <SvgIcon name="arrow" :size="16" color="#A2A4A5" />
          </div>
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-item" @click="showExportData = true">
          <div class="menu-icon export">
            <SvgIcon name="share" :size="20" color="white" />
          </div>
          <div class="menu-content">
            <div class="menu-title">数据导出</div>
            <div class="menu-subtitle">导出账单和报表</div>
          </div>
          <div class="menu-arrow">
            <SvgIcon name="arrow" :size="16" color="#A2A4A5" />
          </div>
        </div>

        <div class="menu-item" @click="showSettings = true">
          <div class="menu-icon settings">
            <SvgIcon name="setting" :size="20" color="white" />
          </div>
          <div class="menu-content">
            <div class="menu-title">设置</div>
            <div class="menu-subtitle">通知、安全、主题</div>
          </div>
          <div class="menu-arrow">
            <SvgIcon name="arrow" :size="16" color="#A2A4A5" />
          </div>
        </div>

        <div class="menu-item" @click="showAbout = true">
          <div class="menu-icon about">
            <SvgIcon name="info-circle" :size="20" color="white" />
          </div>
          <div class="menu-content">
            <div class="menu-title">关于我们</div>
            <div class="menu-subtitle">版本 v1.0.0</div>
          </div>
          <div class="menu-arrow">
            <SvgIcon name="arrow" :size="16" color="#A2A4A5" />
          </div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <a-button danger ghost block size="large" @click="handleLogout">
        <template #icon>
          <SvgIcon name="logout" :size="20" />
        </template>
        退出登录
      </a-button>
    </div>
    <!-- 账户管理弹窗 -->
    <a-modal
      v-model:open="showAccountManager"
      title="我的账户"
      :footer="null"
      width="90%"
      style="max-width: 500px;"
    >
      <div class="account-manager">
        <div class="account-list">
          <div
            v-for="account in accounts"
            :key="account.id"
            class="account-item"
          >
            <div class="account-info">
              <span class="account-icon">{{ account.icon }}</span>
              <div class="account-details">
                <div class="account-name">{{ account.name }}</div>
                <div class="account-type">{{ account.type }}</div>
              </div>
            </div>
            <div class="account-actions">
              <div class="account-balance">¥{{ formatAmount(account.balance) }}</div>
              <a-dropdown>
                <a-button type="text" size="small">
                  <SvgIcon name="more-vertical" :size="16" />
                </a-button>
                <template #overlay>
                  <a-menu @click="(e) => handleAccountAction(e.key, account)">
                    <a-menu-item key="edit">编辑</a-menu-item>
                    <a-menu-item key="delete" class="danger-item">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </div>
        <a-button type="dashed" block @click="showAddAccount = true">
          <template #icon>
            <SvgIcon name="plus" :size="16" />
          </template>
          添加账户
        </a-button>
      </div>
    </a-modal>

    <!-- 分类管理弹窗 -->
    <a-modal
      v-model:open="showCategoryManager"
      title="分类管理"
      :footer="null"
      width="90%"
      style="max-width: 500px;"
    >
      <div class="category-manager">
        <a-tabs v-model:activeKey="activeCategoryTab">
          <a-tab-pane key="expense" tab="支出分类">
            <div class="category-grid">
              <div
                v-for="category in expenseCategories"
                :key="category.id"
                class="category-card"
                @click="editCategory(category)"
              >
                <div class="category-icon" :style="{ background: category.color }">
                  <SvgIcon :name="category.icon" :size="20" color="white" />
                </div>
                <div class="category-name">{{ category.name }}</div>
              </div>
              <div class="category-card add-card" @click="addCategory('expense')">
                <div class="add-icon">
                  <SvgIcon name="plus" :size="20" color="#A2A4A5" />
                </div>
                <div class="add-text">添加分类</div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="income" tab="收入分类">
            <div class="category-grid">
              <div
                v-for="category in incomeCategories"
                :key="category.id"
                class="category-card"
                @click="editCategory(category)"
              >
                <div class="category-icon" :style="{ background: category.color }">
                  <SvgIcon :name="category.icon" :size="20" color="white" />
                </div>
                <div class="category-name">{{ category.name }}</div>
              </div>
              <div class="category-card add-card" @click="addCategory('income')">
                <div class="add-icon">
                  <SvgIcon name="plus" :size="20" color="#A2A4A5" />
                </div>
                <div class="add-text">添加分类</div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>

    <!-- 数据导出弹窗 -->
    <a-modal
      v-model:open="showExportData"
      title="数据导出"
      @ok="handleExport"
      @cancel="showExportData = false"
    >
      <div class="export-options">
        <a-form layout="vertical">
          <a-form-item label="导出格式">
            <a-radio-group v-model:value="exportFormat">
              <a-radio value="excel">Excel (.xlsx)</a-radio>
              <a-radio value="csv">CSV (.csv)</a-radio>
              <a-radio value="pdf">PDF (.pdf)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker
              v-model:value="exportDateRange"
              style="width: 100%"
              format="YYYY-MM-DD"
              placeholder="['开始日期', '结束日期']"
              :mode="isMobile.value ? ['date', 'date'] : undefined"
              :size="isMobile.value ? 'small' : 'middle'"
              :getPopupContainer="(triggerNode) => triggerNode.parentElement"
            />
          </a-form-item>
          <a-form-item label="数据类型">
            <a-checkbox-group v-model:value="exportTypes">
              <a-checkbox value="transactions">交易记录</a-checkbox>
              <a-checkbox value="accounts">账户信息</a-checkbox>
              <a-checkbox value="categories">分类信息</a-checkbox>
              <a-checkbox value="statistics">统计报表</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 设置弹窗 -->
    <a-modal
      v-model:open="showSettings"
      title="设置"
      :footer="null"
      width="90%"
      style="max-width: 500px;"
    >
      <div class="settings-content">
        <div class="setting-section">
          <h4>通知设置</h4>
          <div class="setting-item">
            <span>记账提醒</span>
            <a-switch v-model:checked="settings.dailyReminder" />
          </div>
          <div class="setting-item">
            <span>预算警告</span>
            <a-switch v-model:checked="settings.budgetWarning" />
          </div>
        </div>
        <div class="setting-section">
          <h4>显示设置</h4>
          <div class="setting-item">
            <span>主题模式</span>
            <a-select v-model:value="settings.theme" style="width: 120px">
              <a-select-option value="light">浅色</a-select-option>
              <a-select-option value="dark">深色</a-select-option>
              <a-select-option value="auto">跟随系统</a-select-option>
            </a-select>
          </div>
          <div class="setting-item">
            <span>货币符号</span>
            <a-select v-model:value="settings.currency" style="width: 120px">
              <a-select-option value="CNY">¥ 人民币</a-select-option>
              <a-select-option value="USD">$ 美元</a-select-option>
              <a-select-option value="EUR">€ 欧元</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="setting-section">
          <h4>数据与隐私</h4>
          <div class="setting-item">
            <span>数据同步</span>
            <a-switch v-model:checked="settings.dataSync" />
          </div>
          <div class="setting-item">
            <span>生物识别解锁</span>
            <a-switch v-model:checked="settings.biometric" />
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 关于我们弹窗 -->
    <a-modal
      v-model:open="showAbout"
      title="关于我们"
      :footer="null"
      width="90%"
      style="max-width: 400px;"
    >
      <div class="about-content">
        <div class="app-info">
          <div class="app-icon">
            <div class="icon-placeholder">💰</div>
          </div>
          <h3>清新记账</h3>
          <p class="version">版本 v1.0.0</p>
          <p class="description">一款简洁优雅的个人记账应用，帮助您轻松管理财务，洞察消费习惯。</p>
        </div>
        <div class="contact-info">
          <a-button type="link" block @click="openLink('feedback')">
            意见反馈
          </a-button>
          <a-button type="link" block @click="openLink('privacy')">
            隐私政策
          </a-button>
          <a-button type="link" block @click="openLink('terms')">
            服务条款
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 资产详情弹窗 -->
    <a-modal
      v-model:open="showAssetDetail"
      title="资产详情"
      :footer="null"
      width="90%"
      style="max-width: 400px;"
    >
      <div class="asset-detail">
        <div class="total-asset">
          <div class="amount">¥{{ formatAmount(userStats.totalAssets) }}</div>
          <div class="label">总资产</div>
        </div>
        <div class="asset-breakdown">
          <div
            v-for="account in accounts"
            :key="account.id"
            class="asset-item"
          >
            <div class="asset-info">
              <span class="asset-icon">{{ account.icon }}</span>
              <span class="asset-name">{{ account.name }}</span>
            </div>
            <div class="asset-amount">¥{{ formatAmount(account.balance) }}</div>
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
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useTransactionStore } from '@/store/transaction'
import { formatAmount } from '@/utils/format'
import SvgIcon from '@/components/SvgIcon.vue'

const transactionStore = useTransactionStore()

// 响应式数据
const showEditProfile = ref(false)
const showAccountManager = ref(false)
const showCategoryManager = ref(false)
const showBudgetManager = ref(false)
const showExportData = ref(false)
const showSettings = ref(false)
const showAbout = ref(false)
const showAddAccount = ref(false)
const showAssetDetail = ref(false)

const activeCategoryTab = ref('expense')
const exportFormat = ref('excel')
const exportDateRange = ref([])
const exportTypes = ref(['transactions'])

// 用户信息
const userInfo = ref({
  name: '阿森',
  avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&h=120&fit=crop&crop=face',
  status: '记账达人'
})

// 设置
const settings = ref({
  dailyReminder: true,
  budgetWarning: true,
  theme: 'light',
  currency: 'CNY',
  dataSync: false,
  biometric: false
})

// 计算属性
const accounts = computed(() => transactionStore.accounts)
const categories = computed(() => transactionStore.categories)

const expenseCategories = computed(() =>
  categories.value.filter(c => c.type === 'expense' || c.type === 'both')
)

const incomeCategories = computed(() =>
  categories.value.filter(c => c.type === 'income' || c.type === 'both')
)

const userStats = computed(() => {
  const now = dayjs()
  const startOfMonth = now.startOf('month')
  const endOfMonth = now.endOf('month')

  const monthlyTransactions = transactionStore.transactions.filter(t => {
    const transactionDate = dayjs(t.date)
    return transactionDate.isAfter(startOfMonth) && transactionDate.isBefore(endOfMonth)
  })

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalAssets = accounts.value.reduce((sum, account) => sum + account.balance, 0)

  // 计算记账天数（从第一笔交易开始）
  const firstTransaction = transactionStore.transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

  const daysCount = firstTransaction
    ? now.diff(dayjs(firstTransaction.date), 'day') + 1
    : 0

  return {
    totalAssets,
    monthlyBalance: monthlyIncome - monthlyExpense,
    daysCount
  }
})

const accountSummary = computed(() => {
  const count = accounts.value.length
  return `${count}个账户，总额¥${formatAmount(userStats.value.totalAssets)}`
})

const categorySummary = computed(() => {
  const expenseCount = expenseCategories.value.length
  const incomeCount = incomeCategories.value.length
  return `${expenseCount}个支出，${incomeCount}个收入分类`
})

// 移动端检测
const isMobile = computed(() => window.innerWidth <= 480)

// 方法
const handleAccountAction = (action, account) => {
  switch (action) {
    case 'edit':
      message.info(`编辑账户：${account.name}`)
      break
    case 'delete':
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除账户「${account.name}」吗？`,
        onOk: () => {
          message.success('账户已删除')
        }
      })
      break
  }
}

const editCategory = (category) => {
  message.info(`编辑分类：${category.name}`)
}

const addCategory = (type) => {
  message.info(`添加${type === 'expense' ? '支出' : '收入'}分类`)
}

const handleExport = () => {
  if (exportTypes.value.length === 0) {
    message.warning('请选择要导出的数据类型')
    return
  }

  message.success(`正在导出${exportFormat.value.toUpperCase()}格式数据...`)
  showExportData.value = false

  // 模拟导出过程
  setTimeout(() => {
    message.success('数据导出完成！')
  }, 2000)
}

const openLink = (type) => {
  const links = {
    feedback: 'mailto:feedback@bookkeeping.app',
    privacy: 'https://bookkeeping.app/privacy',
    terms: 'https://bookkeeping.app/terms'
  }

  message.info(`打开：${type}`)
  // 在实际应用中，这里会打开对应的链接
  // window.open(links[type])
}

const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    onOk: () => {
      message.success('已退出登录')
      // 实际应用中这里会执行退出登录逻辑
    }
  })
}

// 生命周期
onMounted(() => {
  transactionStore.initData()
})
</script>

<style lang="scss" scoped>
.profile-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #F5F7FB;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  overflow: hidden;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 0;
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

.profile-header {
  background: linear-gradient(135deg, #64CFB3, #6FD8D8);
  padding: 60px 20px 40px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    padding: 50px 16px 30px;
  }

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      object-fit: cover;
      border: 3px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;

      @media (max-width: 480px) {
        width: 70px;
        height: 70px;
        border-radius: 16px;
      }

      &:hover {
        transform: scale(1.05);
      }
    }

    .user-info {
      flex: 1;
      min-width: 0;

      .username {
        font-size: 24px;
        font-weight: 600;
        color: white;
        margin: 0 0 4px 0;

        @media (max-width: 480px) {
          font-size: 20px;
        }
      }

      .user-status {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;

        @media (max-width: 480px) {
          font-size: 13px;
        }
      }
    }

    .edit-btn {
      :deep(.ant-btn) {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;

        @media (max-width: 480px) {
          width: 36px;
          height: 36px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}

.stats-section {
  padding: 0 20px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    padding: 0 16px;
  }

  .stats-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px);
    border: 1px solid #EEF1F5;
    border-radius: 18px;
    box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;

    @media (max-width: 480px) {
      padding: 20px 0;
    }

    .stat-item {
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 8px;

      &:hover {
        background: rgba(100, 207, 179, 0.05);
      }

      .stat-number {
        font-size: 20px;
        font-weight: 700;
        color: #1F2324;
        margin-bottom: 4px;

        @media (max-width: 480px) {
          font-size: 18px;
        }
      }

      .stat-label {
        font-size: 12px;
        color: #A2A4A5;

        @media (max-width: 480px) {
          font-size: 11px;
        }
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: #EEF1F5;

      @media (max-width: 480px) {
        height: 35px;
      }
    }
  }
}

.menu-section {
  padding: 0 20px;

  @media (max-width: 480px) {
    padding: 0 16px;
  }

  .menu-group {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px);
    border: 1px solid #EEF1F5;
    border-radius: 18px;
    box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
    margin-bottom: 16px;
    overflow: hidden;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 1px solid #F5F7FB;

      @media (max-width: 480px) {
        padding: 14px 16px;
      }

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background: rgba(100, 207, 179, 0.05);
      }

      .menu-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        flex-shrink: 0;

        @media (max-width: 480px) {
          width: 40px;
          height: 40px;
        }

        &.wallet {
          background: linear-gradient(135deg, #64CFB3, #6FD8D8);
        }

        &.budget {
          background: linear-gradient(135deg, #ADA9E4, #6FD8D8);
        }

        &.category {
          background: linear-gradient(135deg, #E9A0A5, #F2D6A7);
        }

        &.export {
          background: linear-gradient(135deg, #F2D6A7, #E9A0A5);
        }

        &.settings {
          background: linear-gradient(135deg, #ADA9E4, #64CFB3);
        }

        &.about {
          background: linear-gradient(135deg, #6FD8D8, #64CFB3);
        }
      }

      .menu-content {
        flex: 1;
        min-width: 0;

        .menu-title {
          font-size: 16px;
          font-weight: 500;
          color: #1F2324;
          margin-bottom: 2px;

          @media (max-width: 480px) {
            font-size: 15px;
          }
        }

        .menu-subtitle {
          font-size: 12px;
          color: #A2A4A5;

          @media (max-width: 480px) {
            font-size: 11px;
          }
        }
      }

      .menu-arrow {
        flex-shrink: 0;
      }
    }
  }
}

.logout-section {
  padding: 20px;

  @media (max-width: 480px) {
    padding: 16px;
  }

  :deep(.ant-btn) {
    height: 56px;
    border-radius: 18px;
    font-size: 16px;
    font-weight: 500;

    @media (max-width: 480px) {
      height: 50px;
      font-size: 15px;
    }
  }
}

// 弹窗内容样式
.account-manager {
  .account-list {
    margin-bottom: 16px;

    .account-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border: 1px solid #F0F0F0;
      border-radius: 8px;
      margin-bottom: 8px;

      .account-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;

        .account-icon {
          font-size: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F7FB;
          border-radius: 8px;
        }

        .account-details {
          .account-name {
            font-weight: 500;
            margin-bottom: 2px;
          }

          .account-type {
            font-size: 12px;
            color: #666;
          }
        }
      }

      .account-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .account-balance {
          font-weight: 600;
          color: #1F2324;
        }
      }
    }
  }
}

.category-manager {
  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    @media (max-width: 480px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      border: 1px solid #F0F0F0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #64CFB3;
        background: rgba(100, 207, 179, 0.05);
      }

      &.add-card {
        border-style: dashed;
        color: #A2A4A5;

        .add-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #F5F7FB;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .add-text {
          font-size: 12px;
        }
      }

      .category-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
      }

      .category-name {
        font-size: 12px;
        text-align: center;
      }
    }
  }
}

.export-options {
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}

.settings-content {
  .setting-section {
    margin-bottom: 24px;

    h4 {
      margin-bottom: 12px;
      color: #1F2324;
      font-weight: 600;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #F5F7FB;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.about-content {
  text-align: center;

  .app-info {
    padding: 20px 0;
    border-bottom: 1px solid #F5F7FB;
    margin-bottom: 20px;

    .app-icon {
      margin-bottom: 16px;

      .icon-placeholder {
        font-size: 48px;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #64CFB3, #6FD8D8);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
    }

    h3 {
      margin: 0 0 8px;
      color: #1F2324;
    }

    .version {
      color: #A2A4A5;
      margin: 0 0 16px;
    }

    .description {
      color: #667085;
      line-height: 1.6;
      margin: 0;
    }
  }

  .contact-info {
    :deep(.ant-btn) {
      text-align: left;
      height: auto;
      padding: 12px 0;
    }
  }
}

.asset-detail {
  .total-asset {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #F5F7FB;
    margin-bottom: 20px;

    .amount {
      font-size: 32px;
      font-weight: 700;
      color: #1F2324;
      margin-bottom: 8px;
    }

    .label {
      color: #A2A4A5;
      font-size: 14px;
    }
  }

  .asset-breakdown {
    .asset-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #F5F7FB;

      &:last-child {
        border-bottom: none;
      }

      .asset-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .asset-icon {
          font-size: 18px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F7FB;
          border-radius: 8px;
        }
      }

      .asset-amount {
        font-weight: 600;
        color: #1F2324;
      }
    }
  }
}
</style>