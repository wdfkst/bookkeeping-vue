<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">记一笔</h3>
        <button class="close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24" class="close-icon">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="type-selector">
        <button
          class="type-btn"
          :class="{ active: type === 'expense' }"
          @click="type = 'expense'"
        >
          支出
        </button>
        <button
          class="type-btn"
          :class="{ active: type === 'income' }"
          @click="type = 'income'"
        >
          收入
        </button>
      </div>

      <div class="amount-input">
        <div class="amount-label">金额</div>
        <div class="amount-field">
          <span class="currency">¥</span>
          <input
            type="number"
            v-model="amount"
            placeholder="0.00"
            class="amount-value"
          />
        </div>
      </div>

      <div class="category-section">
        <div class="section-title">分类</div>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            :class="{ active: selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            <div class="category-icon" :style="{ background: category.color }">
              <SvgIcon :name="category.icon" :size="20" color="white" />
            </div>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="cancel-btn" @click="closeModal">取消</button>
        <button class="save-btn" @click="saveTransaction">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const type = ref('expense')
const amount = ref('')
const selectedCategory = ref(1)

const expenseCategories = [
  { id: 1, name: '餐饮', icon: 'food', color: 'linear-gradient(135deg, #E9A0A5, #F2D6A7)' },
  { id: 2, name: '交通', icon: 'car', color: 'linear-gradient(135deg, #ADA9E4, #6FD8D8)' },
  { id: 3, name: '购物', icon: 'shopping', color: 'linear-gradient(135deg, #F2D6A7, #E9A0A5)' },
  { id: 4, name: '娱乐', icon: 'entertainment', color: 'linear-gradient(135deg, #64CFB3, #6FD8D8)' }
]

const incomeCategories = [
  { id: 5, name: '工资', icon: 'work', color: 'linear-gradient(135deg, #64CFB3, #6FD8D8)' },
  { id: 6, name: '理财', icon: 'finance', color: 'linear-gradient(135deg, #ADA9E4, #64CFB3)' },
  { id: 7, name: '兼职', icon: 'computer', color: 'linear-gradient(135deg, #6FD8D8, #64CFB3)' },
  { id: 8, name: '其他', icon: 'money', color: 'linear-gradient(135deg, #F2D6A7, #ADA9E4)' }
]

const categories = computed(() => {
  return type.value === 'expense' ? expenseCategories : incomeCategories
})

const closeModal = () => {
  emit('close')
}

const saveTransaction = () => {
  if (!amount.value || !selectedCategory.value) {
    return
  }

  const transaction = {
    type: type.value,
    amount: parseFloat(amount.value),
    category: selectedCategory.value,
    date: new Date().toISOString()
  }

  emit('save', transaction)

  // 重置表单
  amount.value = ''
  selectedCategory.value = categories.value[0]?.id || 1

  closeModal()
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid #EEF1F5;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(16, 24, 40, 0.1);
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #F5F7FB;

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #1F2324;
    margin: 0;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(162, 164, 165, 0.1);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
    }

    .close-icon {
      width: 16px;
      height: 16px;
      stroke: #667085;
      fill: none;
      stroke-width: 1.5;
    }
  }
}

.type-selector {
  display: flex;
  gap: 8px;
  padding: 0 24px 20px;

  .type-btn {
    flex: 1;
    height: 48px;
    border-radius: 16px;
    border: 1px solid #EEF1F5;
    background: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 500;
    color: #667085;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: linear-gradient(135deg, #64CFB3, #6FD8D8);
      color: white;
      border-color: transparent;
    }

    &:not(.active):active {
      transform: scale(0.98);
    }
  }
}

.amount-input {
  padding: 0 24px 20px;

  .amount-label {
    font-size: 14px;
    color: #667085;
    margin-bottom: 8px;
  }

  .amount-field {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #EEF1F5;
    border-radius: 16px;
    padding: 16px 20px;

    .currency {
      font-size: 24px;
      font-weight: 600;
      color: #1F2324;
      margin-right: 8px;
    }

    .amount-value {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 24px;
      font-weight: 600;
      color: #1F2324;
      outline: none;

      &::placeholder {
        color: #A2A4A5;
      }
    }
  }
}

.category-section {
  padding: 0 24px 20px;

  .section-title {
    font-size: 14px;
    color: #667085;
    margin-bottom: 12px;
  }

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

      &.active {
        background: rgba(100, 207, 179, 0.1);
      }

      &:active {
        transform: scale(0.95);
      }

      .category-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-bottom: 6px;
      }

      .category-name {
        font-size: 12px;
        color: #667085;
        text-align: center;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;

  .cancel-btn,
  .save-btn {
    flex: 1;
    height: 48px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    &:active {
      transform: scale(0.98);
    }
  }

  .cancel-btn {
    background: rgba(162, 164, 165, 0.1);
    color: #667085;
  }

  .save-btn {
    background: linear-gradient(135deg, #64CFB3, #6FD8D8);
    color: white;
  }
}
</style>