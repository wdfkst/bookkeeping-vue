<template>
  <a-modal
    v-model:open="visible"
    title="记一笔"
    :width="400"
    :footer="null"
    @cancel="handleCancel"
    centered
    class="add-transaction-modal"
  >
    <div class="modal-content">
      <!-- 收支类型选择 -->
      <div class="type-selector">
        <a-segmented
          v-model:value="form.type"
          :options="typeOptions"
          block
          size="large"
        />
      </div>

      <!-- 金额输入 -->
      <div class="amount-section">
        <label class="field-label">金额</label>
        <a-input
          v-model:value="form.amount"
          placeholder="0.00"
          size="large"
          class="amount-input"
        >
          <template #prefix>
            <span class="currency-symbol">¥</span>
          </template>
        </a-input>
      </div>

      <!-- 分类选择 -->
      <div class="category-section">
        <label class="field-label">分类</label>
        <div class="category-grid">
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="category-item"
            :class="{ active: form.categoryId === category.id }"
            @click="form.categoryId = category.id"
          >
            <div class="category-icon" :style="{ background: category.color }">
              <SvgIcon :name="category.icon" :size="20" color="white" />
            </div>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- 账户选择 -->
      <div class="account-section">
        <label class="field-label">账户</label>
        <a-select
          v-model:value="form.accountId"
          placeholder="选择账户"
          size="large"
          style="width: 100%"
        >
          <a-select-option v-for="account in accounts" :key="account.id" :value="account.id">
            <div class="account-option">
              <span class="account-icon">{{ account.icon }}</span>
              <span class="account-name">{{ account.name }}</span>
              <span class="account-balance">¥{{ formatAmount(account.balance) }}</span>
            </div>
          </a-select-option>
        </a-select>
      </div>

      <!-- 备注输入 -->
      <div class="note-section">
        <label class="field-label">备注 (可选)</label>
        <a-input
          v-model:value="form.note"
          placeholder="添加备注..."
          size="large"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <a-button size="large" @click="handleCancel" style="margin-right: 12px;">
          取消
        </a-button>
        <a-button
          type="primary"
          size="large"
          @click="handleSave"
          :loading="saving"
          :disabled="!canSave"
        >
          保存
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useTransactionStore } from '@/store/transaction'
import { formatAmount } from '@/utils/format'
import SvgIcon from '@/components/SvgIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  defaultType: {
    type: String,
    default: 'expense' // 'income', 'expense'
  }
})

const emit = defineEmits(['cancel', 'success'])

const transactionStore = useTransactionStore()
const saving = ref(false)

// 表单数据
const form = ref({
  type: 'expense',
  amount: '',
  categoryId: '',
  accountId: '',
  note: ''
})

// 类型选项
const typeOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' }
]

// 响应式属性
const visible = computed({
  get: () => props.open,
  set: () => {}
})

// 过滤后的分类
const filteredCategories = computed(() => {
  return transactionStore.categories.filter(category =>
    category.type === form.value.type || category.type === 'both'
  )
})

// 账户列表
const accounts = computed(() => transactionStore.accounts)

// 是否可以保存
const canSave = computed(() => {
  return form.value.amount &&
         form.value.categoryId &&
         form.value.accountId &&
         parseFloat(form.value.amount) > 0
})

// 监听类型变化，重置分类选择
watch(() => form.value.type, (newType) => {
  form.value.categoryId = ''
  // 自动选择第一个可用分类
  const availableCategories = filteredCategories.value
  if (availableCategories.length > 0) {
    form.value.categoryId = availableCategories[0].id
  }
})

// 监听默认类型
watch(() => props.defaultType, (newType) => {
  if (newType) {
    form.value.type = newType
  }
}, { immediate: true })

// 监听打开状态
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})

// 重置表单
const resetForm = () => {
  form.value = {
    type: props.defaultType || 'expense',
    amount: '',
    categoryId: '',
    accountId: '',
    note: ''
  }

  // 自动选择默认分类和账户
  const availableCategories = filteredCategories.value
  if (availableCategories.length > 0) {
    form.value.categoryId = availableCategories[0].id
  }

  if (accounts.value.length > 0) {
    form.value.accountId = accounts.value[0].id
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 处理保存
const handleSave = async () => {
  if (!canSave.value) {
    message.warning('请填写完整的交易信息')
    return
  }

  try {
    saving.value = true

    const transaction = {
      type: form.value.type,
      amount: parseFloat(form.value.amount),
      categoryId: form.value.categoryId,
      accountId: form.value.accountId,
      title: generateTitle(),
      note: form.value.note || '',
      date: new Date().toISOString()
    }

    // 添加交易记录
    const newTransaction = transactionStore.addTransaction(transaction)

    message.success('记账成功！')
    emit('success', newTransaction)

  } catch (error) {
    console.error('保存交易失败:', error)
    message.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 生成交易标题
const generateTitle = () => {
  const category = transactionStore.categories.find(c => c.id === form.value.categoryId)
  const categoryName = category?.name || '其他'

  if (form.value.note) {
    return `${categoryName} · ${form.value.note}`
  }

  return categoryName
}

// 初始化
resetForm()
</script>

<style lang="scss" scoped>
.add-transaction-modal {
  :deep(.ant-modal-content) {
    border-radius: 16px;
    overflow: hidden;
  }

  :deep(.ant-modal-header) {
    background: linear-gradient(135deg, #64CFB3, #6FD8D8);
    border-bottom: none;
    padding: 20px 24px;

    .ant-modal-title {
      color: white;
      font-size: 18px;
      font-weight: 600;
    }
  }

  :deep(.ant-modal-close) {
    color: white;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.modal-content {
  padding: 24px;
}

.type-selector {
  margin-bottom: 24px;

  :deep(.ant-segmented) {
    border-radius: 12px;
    background: #f5f7fb;

    .ant-segmented-item {
      border-radius: 8px;

      &.ant-segmented-item-selected {
        background: linear-gradient(135deg, #64CFB3, #6FD8D8);
        color: white;
      }
    }
  }
}

.field-label {
  display: block;
  font-size: 14px;
  color: #1f2324;
  font-weight: 500;
  margin-bottom: 8px;
}

.amount-section {
  margin-bottom: 24px;

  .amount-input {
    border-radius: 12px;

    :deep(.ant-input) {
      font-size: 18px;
      font-weight: 600;

      &::placeholder {
        color: #a2a4a5;
      }
    }

    .currency-symbol {
      font-size: 18px;
      font-weight: 600;
      color: #1f2324;
    }
  }
}

.category-section {
  margin-bottom: 24px;

  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        background: rgba(100, 207, 179, 0.05);
      }

      &.active {
        background: rgba(100, 207, 179, 0.1);
        border-color: #64CFB3;
      }

      .category-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
      }

      .category-name {
        font-size: 12px;
        color: #667085;
        text-align: center;
      }
    }
  }
}

.account-section {
  margin-bottom: 24px;

  :deep(.ant-select) {
    border-radius: 12px;

    .ant-select-selector {
      border-radius: 12px;
      height: 48px;

      .ant-select-selection-item {
        line-height: 46px;
      }
    }
  }

  .account-option {
    display: flex;
    align-items: center;
    gap: 8px;

    .account-icon {
      font-size: 16px;
    }

    .account-name {
      flex: 1;
      font-weight: 500;
    }

    .account-balance {
      color: #667085;
      font-size: 12px;
    }
  }
}

.note-section {
  margin-bottom: 32px;

  :deep(.ant-input) {
    border-radius: 12px;
    height: 48px;
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;

  :deep(.ant-btn) {
    border-radius: 12px;
    height: 48px;
    padding: 0 24px;
    font-weight: 500;

    &.ant-btn-primary {
      background: linear-gradient(135deg, #64CFB3, #6FD8D8);
      border: none;

      &:hover {
        background: linear-gradient(135deg, #5bb8a0, #5fc5c5);
      }
    }
  }
}
</style>