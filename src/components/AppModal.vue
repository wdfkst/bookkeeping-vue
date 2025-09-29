<template>
  <view v-if="visible" class="app-modal" :class="modalClass" @click="handleMaskClick">
    <view class="modal-content" :class="contentClass" :style="contentStyle" @click.stop>
      <!-- 标题栏 -->
      <view v-if="title || showClose" class="modal-header">
        <view class="modal-title" v-if="title">{{ title }}</view>
        <view
          v-if="showClose"
          class="modal-close"
          @click="handleClose"
        >
          <text class="iconfont icon-close"></text>
        </view>
      </view>

      <!-- 内容区域 -->
      <view class="modal-body" :class="bodyClass">
        <slot></slot>
      </view>

      <!-- 底部操作栏 -->
      <view v-if="$slots.footer || showFooter" class="modal-footer">
        <slot name="footer">
          <app-button v-if="showCancel" type="secondary" @click="handleCancel">
            {{ cancelText }}
          </app-button>
          <app-button v-if="showConfirm" type="primary" @click="handleConfirm" :loading="confirmLoading">
            {{ confirmText }}
          </app-button>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from './AppButton.vue'

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 宽度
  width: {
    type: String,
    default: '90%'
  },
  // 位置
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'top', 'bottom'].includes(value)
  },
  // 是否可点击遮罩关闭
  maskClosable: {
    type: Boolean,
    default: true
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true
  },
  // 是否显示底部
  showFooter: {
    type: Boolean,
    default: false
  },
  // 是否显示取消按钮
  showCancel: {
    type: Boolean,
    default: true
  },
  // 是否显示确认按钮
  showConfirm: {
    type: Boolean,
    default: true
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: '确认'
  },
  // 确认按钮加载状态
  confirmLoading: {
    type: Boolean,
    default: false
  },
  // 圆角
  radius: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  },
  // 内容区域样式类
  bodyClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'close', 'confirm', 'cancel'])

const modalClass = computed(() => [
  `modal-${props.position}`
])

const contentClass = computed(() => [
  `radius-${props.radius}`
])

const contentStyle = computed(() => ({
  width: props.width,
  ...props.customStyle
}))

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}
</script>

<style lang="scss" scoped>
.app-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: $spacing-xl;

  &.modal-top {
    align-items: flex-start;
    padding-top: 20vh;
  }

  &.modal-bottom {
    align-items: flex-end;
    padding-bottom: env(safe-area-inset-bottom);

    .modal-content {
      width: 100% !important;
      margin: 0 -#{$spacing-xl};
      border-radius: $radius-lg $radius-lg 0 0 !important;
    }
  }

  &.modal-center {
    align-items: center;
  }
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.radius-sm { border-radius: $radius-sm; }
  &.radius-md { border-radius: $radius-md; }
  &.radius-lg { border-radius: $radius-lg; }
  &.radius-xl { border-radius: $radius-xl; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg $spacing-xl;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;

  .modal-title {
    font-size: $font-lg;
    font-weight: 600;
    color: $text-primary;
  }

  .modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      background: rgba(0, 0, 0, 0.1);
      transform: scale(0.95);
    }

    .iconfont {
      font-size: 16px;
      color: $text-secondary;
    }
  }
}

.modal-body {
  flex: 1;
  padding: $spacing-xl;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-lg $spacing-xl;
  border-top: 1px solid $border-color;
  flex-shrink: 0;

  :deep(.app-button) {
    min-width: 80px;
  }
}

// 动画效果
.app-modal {
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

// 底部弹窗动画
.modal-bottom .modal-content {
  animation: slideUpIn 0.3s ease-out;
}

@keyframes slideUpIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>