<template>
  <view class="add-page">
    <scroll-view scroll-y class="content">
      <!-- 类型切换 -->
      <view class="type-switch">
        <view
          class="switch-item"
          :class="{ active: currentType === 'expense' }"
          @click="switchType('expense')"
        >
          <text class="switch-text">支出</text>
        </view>
        <view
          class="switch-item"
          :class="{ active: currentType === 'income' }"
          @click="switchType('income')"
        >
          <text class="switch-text">收入</text>
        </view>
        <view
          class="switch-item"
          :class="{ active: currentType === 'transfer' }"
          @click="switchType('transfer')"
        >
          <text class="switch-text">转账</text>
        </view>
      </view>

      <!-- 金额输入 -->
      <view class="amount-section card">
        <view class="amount-display">
          <text class="currency">¥</text>
          <input
            class="amount-input"
            type="digit"
            placeholder="0.00"
            v-model="form.amount"
            @input="onAmountInput"
            maxlength="10"
          />
        </view>

        <!-- 计算器键盘 -->
        <view class="calculator">
          <view class="calc-row">
            <view class="calc-btn" @click="inputNumber('7')">7</view>
            <view class="calc-btn" @click="inputNumber('8')">8</view>
            <view class="calc-btn" @click="inputNumber('9')">9</view>
            <view class="calc-btn operator" @click="clearAmount">清空</view>
          </view>
          <view class="calc-row">
            <view class="calc-btn" @click="inputNumber('4')">4</view>
            <view class="calc-btn" @click="inputNumber('5')">5</view>
            <view class="calc-btn" @click="inputNumber('6')">6</view>
            <view class="calc-btn operator" @click="deleteLastDigit">删除</view>
          </view>
          <view class="calc-row">
            <view class="calc-btn" @click="inputNumber('1')">1</view>
            <view class="calc-btn" @click="inputNumber('2')">2</view>
            <view class="calc-btn" @click="inputNumber('3')">3</view>
            <view class="calc-btn operator" @click="inputOperator('+')">+</view>
          </view>
          <view class="calc-row">
            <view class="calc-btn wide" @click="inputNumber('0')">0</view>
            <view class="calc-btn" @click="inputNumber('.')">.</view>
            <view class="calc-btn operator" @click="calculate">=</view>
          </view>
        </view>
      </view>

      <!-- 分类选择 -->
      <view class="category-section card">
        <view class="section-title">
          <text class="title">选择分类</text>
          <text class="manage" @click="manageCategories">管理</text>
        </view>
        <view class="category-grid">
          <view
            class="category-item"
            v-for="category in filteredCategories"
            :key="category.id"
            :class="{ active: form.categoryId === category.id }"
            @click="selectCategory(category)"
          >
            <view class="category-icon" :style="{ background: category.color }">
              <text class="icon-emoji">{{ category.icon }}</text>
            </view>
            <text class="category-name">{{ category.name }}</text>
          </view>
          <view class="category-item add-category" @click="addCategory">
            <view class="category-icon add-icon">
              <text class="iconfont icon-plus"></text>
            </view>
            <text class="category-name">新增</text>
          </view>
        </view>
      </view>

      <!-- 详细信息 -->
      <view class="details-section">
        <!-- 账户选择 -->
        <view class="detail-card card">
          <view class="detail-item" @click="showAccountPicker">
            <view class="detail-icon">
              <text class="iconfont icon-wallet"></text>
            </view>
            <view class="detail-content">
              <text class="detail-label">账户</text>
              <text class="detail-value">{{ selectedAccount.name }}</text>
            </view>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>

        <!-- 时间选择 -->
        <view class="detail-card card">
          <view class="detail-item" @click="showDatePicker">
            <view class="detail-icon">
              <text class="iconfont icon-calendar"></text>
            </view>
            <view class="detail-content">
              <text class="detail-label">时间</text>
              <text class="detail-value">{{ formatDate(form.date) }}</text>
            </view>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>

        <!-- 备注输入 -->
        <view class="detail-card card">
          <view class="detail-item">
            <view class="detail-icon">
              <text class="iconfont icon-edit"></text>
            </view>
            <view class="detail-content full">
              <input
                class="note-input"
                placeholder="添加备注（可选）"
                v-model="form.note"
                maxlength="50"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="save-section">
        <button class="save-btn" @click="saveTransaction" :disabled="!canSave">
          {{ editMode ? '更新' : '保存' }}
        </button>
      </view>

      <!-- 安全距离 -->
      <view class="safe-bottom"></view>
    </scroll-view>

    <!-- 账户选择弹窗 -->
    <uni-popup ref="accountPopup" type="bottom">
      <view class="picker-container">
        <view class="picker-header">
          <text class="picker-title">选择账户</text>
          <text class="picker-close" @click="closeAccountPicker">完成</text>
        </view>
        <view class="account-list">
          <view
            class="account-item"
            v-for="account in accounts"
            :key="account.id"
            @click="selectAccount(account)"
          >
            <view class="account-icon" :style="{ background: account.color }">
              <text class="account-emoji">{{ account.icon }}</text>
            </view>
            <view class="account-info">
              <text class="account-name">{{ account.name }}</text>
              <text class="account-balance">余额：¥{{ formatAmount(account.balance) }}</text>
            </view>
            <text
              class="iconfont icon-check"
              v-if="form.accountId === account.id"
            ></text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 日期选择弹窗 -->
    <uni-popup ref="datePopup" type="bottom">
      <view class="picker-container">
        <view class="picker-header">
          <text class="picker-title">选择日期</text>
          <text class="picker-close" @click="closeDatePicker">完成</text>
        </view>
        <picker-view
          class="date-picker"
          :value="datePickerValue"
          @change="onDateChange"
        >
          <picker-view-column>
            <view v-for="(year, index) in years" :key="index">{{ year }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(month, index) in months" :key="index">{{ month }}月</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(day, index) in days" :key="index">{{ day }}日</view>
          </picker-view-column>
        </picker-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/store/transaction'
import { formatAmount, formatDate } from '@/utils/format'

// 状态管理
const transactionStore = useTransactionStore()

// 响应式数据
const currentType = ref('expense')
const form = ref({
  amount: '',
  categoryId: '',
  accountId: '',
  date: new Date().toISOString(),
  note: ''
})

const editMode = ref(false)
const editId = ref('')
const calculatorExpression = ref('')

// 日期选择器相关
const datePickerValue = ref([0, 0, 0])
const years = ref([])
const months = ref([])
const days = ref([])

// 计算属性
const filteredCategories = computed(() => {
  return transactionStore.categories.filter(cat =>
    cat.type === currentType.value || cat.type === 'both'
  )
})

const accounts = computed(() => transactionStore.accounts)

const selectedAccount = computed(() => {
  return accounts.value.find(acc => acc.id === form.value.accountId) || accounts.value[0]
})

const canSave = computed(() => {
  return form.value.amount &&
         form.value.categoryId &&
         form.value.accountId &&
         parseFloat(form.value.amount) > 0
})

// 生命周期
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

  if (options.type) {
    currentType.value = options.type
  }

  if (options.id) {
    editMode.value = true
    editId.value = options.id
    loadTransaction(options.id)
  }

  // 初始化默认值
  if (accounts.value.length > 0) {
    form.value.accountId = accounts.value[0].id
  }

  initDatePicker()
})

// 方法
const switchType = (type) => {
  currentType.value = type
  form.value.categoryId = '' // 重置分类选择
}

const onAmountInput = (e) => {
  const value = e.detail.value
  // 限制只能输入数字和小数点
  const cleanValue = value.replace(/[^\d.]/g, '')

  // 确保只有一个小数点
  const parts = cleanValue.split('.')
  if (parts.length > 2) {
    form.value.amount = parts[0] + '.' + parts.slice(1).join('')
  } else {
    form.value.amount = cleanValue
  }

  // 限制小数位数
  if (parts[1] && parts[1].length > 2) {
    form.value.amount = parts[0] + '.' + parts[1].substring(0, 2)
  }
}

const inputNumber = (num) => {
  if (form.value.amount === '0' && num !== '.') {
    form.value.amount = num
  } else {
    form.value.amount += num
  }
}

const clearAmount = () => {
  form.value.amount = ''
  calculatorExpression.value = ''
}

const deleteLastDigit = () => {
  form.value.amount = form.value.amount.slice(0, -1)
}

const inputOperator = (operator) => {
  if (form.value.amount && !isNaN(parseFloat(form.value.amount))) {
    calculatorExpression.value = form.value.amount + operator
    form.value.amount = ''
  }
}

const calculate = () => {
  if (calculatorExpression.value && form.value.amount) {
    try {
      const result = eval(calculatorExpression.value + form.value.amount)
      form.value.amount = result.toFixed(2).replace(/\.?0+$/, '')
      calculatorExpression.value = ''
    } catch (error) {
      console.error('计算错误:', error)
    }
  }
}

const selectCategory = (category) => {
  form.value.categoryId = category.id
}

const showAccountPicker = () => {
  this.$refs.accountPopup.open()
}

const closeAccountPicker = () => {
  this.$refs.accountPopup.close()
}

const selectAccount = (account) => {
  form.value.accountId = account.id
  closeAccountPicker()
}

const showDatePicker = () => {
  this.$refs.datePopup.open()
}

const closeDatePicker = () => {
  this.$refs.datePopup.close()
}

const initDatePicker = () => {
  const currentDate = new Date(form.value.date)
  const currentYear = currentDate.getFullYear()

  // 生成年份列表（当前年份前后5年）
  years.value = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.value.push(i)
  }

  // 生成月份列表
  months.value = []
  for (let i = 1; i <= 12; i++) {
    months.value.push(i)
  }

  // 生成日期列表
  updateDays()

  // 设置默认选中值
  datePickerValue.value = [
    years.value.indexOf(currentYear),
    currentDate.getMonth(),
    currentDate.getDate() - 1
  ]
}

const updateDays = () => {
  const year = years.value[datePickerValue.value[0]]
  const month = months.value[datePickerValue.value[1]]
  const daysInMonth = new Date(year, month, 0).getDate()

  days.value = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.value.push(i)
  }
}

const onDateChange = (e) => {
  datePickerValue.value = e.detail.value
  updateDays()

  const year = years.value[datePickerValue.value[0]]
  const month = months.value[datePickerValue.value[1]]
  const day = days.value[datePickerValue.value[2]] || 1

  form.value.date = new Date(year, month - 1, day).toISOString()
}

const manageCategories = () => {
  uni.navigateTo({
    url: '/pages/categories/index'
  })
}

const addCategory = () => {
  uni.navigateTo({
    url: `/pages/category-edit/index?type=${currentType.value}`
  })
}

const loadTransaction = (id) => {
  const transaction = transactionStore.transactions.find(t => t.id === id)
  if (transaction) {
    currentType.value = transaction.type
    form.value = {
      amount: transaction.amount.toString(),
      categoryId: transaction.categoryId,
      accountId: transaction.accountId,
      date: transaction.date,
      note: transaction.note || ''
    }
  }
}

const saveTransaction = () => {
  if (!canSave.value) {
    uni.showToast({
      title: '请完善必填信息',
      icon: 'none'
    })
    return
  }

  const transactionData = {
    type: currentType.value,
    amount: parseFloat(form.value.amount),
    categoryId: form.value.categoryId,
    accountId: form.value.accountId,
    date: form.value.date,
    note: form.value.note,
    title: transactionStore.categories.find(c => c.id === form.value.categoryId)?.name || '未知分类'
  }

  try {
    if (editMode.value) {
      transactionStore.updateTransaction(editId.value, transactionData)
      uni.showToast({
        title: '更新成功',
        icon: 'success'
      })
    } else {
      transactionStore.addTransaction(transactionData)
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('保存失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.add-page {
  min-height: 100vh;
  background: $bg-color;
  padding-top: env(safe-area-inset-top);
}

.content {
  padding: $spacing-lg;
}

.type-switch {
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: $radius-lg;
  padding: 4px;
  margin-bottom: $spacing-lg;

  .switch-item {
    flex: 1;
    text-align: center;
    padding: $spacing-md;
    border-radius: $radius-md;
    @extend .transition;

    &.active {
      background: $gradient-primary;

      .switch-text {
        color: $white;
      }
    }

    .switch-text {
      font-size: $font-sm;
      font-weight: 500;
      color: $text-secondary;
    }
  }
}

.amount-section {
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  text-align: center;

  .amount-display {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-xl;

    .currency {
      font-size: 24px;
      color: $text-secondary;
      margin-right: $spacing-sm;
    }

    .amount-input {
      font-size: 48px;
      font-weight: bold;
      color: $text-primary;
      text-align: center;
      border: none;
      background: transparent;
      outline: none;
      min-width: 200px;
    }
  }

  .calculator {
    .calc-row {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-md;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .calc-btn {
      flex: 1;
      height: 48px;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid $border-color;
      border-radius: $radius-md;
      @extend .flex-center;
      font-size: $font-md;
      font-weight: 500;
      color: $text-primary;
      @extend .transition;

      &:active {
        transform: scale(0.95);
        background: rgba(100, 207, 179, 0.1);
      }

      &.operator {
        background: $gradient-primary;
        color: $white;
        border-color: transparent;
      }

      &.wide {
        flex: 2;
      }
    }
  }
}

.category-section {
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;

  .section-title {
    @extend .flex-between;
    margin-bottom: $spacing-lg;

    .title {
      font-size: $font-md;
      font-weight: 500;
      color: $text-primary;
    }

    .manage {
      color: $secondary-color;
      font-size: $font-sm;
    }
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;

    .category-item {
      text-align: center;
      @extend .transition;

      &:active {
        transform: scale(0.95);
      }

      &.active .category-icon {
        box-shadow: 0 0 0 3px rgba(100, 207, 179, 0.3);
      }

      .category-icon {
        width: 56px;
        height: 56px;
        border-radius: $radius-md;
        @extend .flex-center;
        margin: 0 auto $spacing-sm;
        @extend .transition;

        .icon-emoji {
          font-size: 24px;
        }

        .iconfont {
          font-size: 24px;
          color: $text-secondary;
        }
      }

      .add-icon {
        background: rgba(255, 255, 255, 0.7);
        border: 2px dashed #C8CDD4;
      }

      .category-name {
        font-size: $font-xs;
        color: $text-light;
      }
    }
  }
}

.details-section {
  .detail-card {
    margin-bottom: $spacing-md;
    padding: 0;

    .detail-item {
      @extend .flex-between;
      padding: $spacing-lg;

      .detail-icon {
        width: 40px;
        height: 40px;
        border-radius: $radius-md;
        background: rgba(100, 207, 179, 0.1);
        @extend .flex-center;
        margin-right: $spacing-md;

        .iconfont {
          font-size: 20px;
          color: $primary-color;
        }
      }

      .detail-content {
        flex: 1;

        &.full {
          margin-left: $spacing-md;
        }

        .detail-label {
          color: $text-secondary;
          font-size: $font-xs;
          display: block;
          margin-bottom: 2px;
        }

        .detail-value {
          color: $text-primary;
          font-size: $font-sm;
        }

        .note-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: $font-sm;
          color: $text-primary;

          &::placeholder {
            color: $text-secondary;
          }
        }
      }

      .icon-arrow-right {
        color: $text-secondary;
        font-size: 16px;
      }
    }
  }
}

.save-section {
  margin: $spacing-xl 0;

  .save-btn {
    width: 100%;
    height: 56px;
    background: $gradient-primary;
    color: $white;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-md;
    font-weight: 500;
    @extend .transition;

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      background: $text-secondary;
      opacity: 0.5;
    }
  }
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}

// 弹窗样式
.picker-container {
  background: $white;
  border-radius: $radius-lg $radius-lg 0 0;
  max-height: 60vh;

  .picker-header {
    @extend .flex-between;
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color;

    .picker-title {
      font-size: $font-md;
      font-weight: 500;
      color: $text-primary;
    }

    .picker-close {
      color: $primary-color;
      font-size: $font-sm;
    }
  }
}

.account-list {
  padding: $spacing-lg;
  max-height: 400px;
  overflow-y: auto;

  .account-item {
    @extend .flex-between;
    padding: $spacing-md 0;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .account-icon {
      width: 40px;
      height: 40px;
      border-radius: $radius-md;
      @extend .flex-center;
      margin-right: $spacing-md;

      .account-emoji {
        font-size: 20px;
      }
    }

    .account-info {
      flex: 1;

      .account-name {
        color: $text-primary;
        font-size: $font-sm;
        display: block;
        margin-bottom: 2px;
      }

      .account-balance {
        color: $text-secondary;
        font-size: $font-xs;
      }
    }

    .icon-check {
      color: $primary-color;
      font-size: 20px;
    }
  }
}

.date-picker {
  height: 300px;
  text-align: center;
}
</style>