<template>
  <button
    class="app-button"
    :class="buttonClass"
    :style="buttonStyle"
    :disabled="disabled"
    @click="handleClick"
  >
    <view v-if="loading" class="button-loading">
      <text class="iconfont icon-loading"></text>
    </view>
    <view v-if="icon && !loading" class="button-icon">
      <text class="iconfont" :class="icon"></text>
    </view>
    <view class="button-content">
      <slot></slot>
    </view>
    <view v-if="suffixIcon" class="button-suffix">
      <text class="iconfont" :class="suffixIcon"></text>
    </view>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 按钮类型
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'text', 'gradient', 'expense', 'income'].includes(value)
  },
  // 按钮大小
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // 按钮形状
  shape: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'round', 'circle'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 是否块级元素
  block: {
    type: Boolean,
    default: false
  },
  // 前置图标
  icon: {
    type: String,
    default: ''
  },
  // 后置图标
  suffixIcon: {
    type: String,
    default: ''
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => [
  `btn-${props.type}`,
  `btn-${props.size}`,
  `btn-${props.shape}`,
  {
    'btn-block': props.block,
    'btn-disabled': props.disabled,
    'btn-loading': props.loading,
    'btn-icon-only': !$slots.default && (props.icon || props.loading)
  }
])

const buttonStyle = computed(() => props.customStyle)

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  border: none;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  // 按钮类型
  &.btn-primary {
    background: $gradient-primary;
    color: $white;
    box-shadow: 0 8px 20px rgba(100, 207, 179, 0.35);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 4px 12px rgba(100, 207, 179, 0.5);
    }
  }

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.8);
    color: $text-primary;
    border: 1px solid $border-color;

    &:active {
      transform: scale(0.95);
      background: rgba(100, 207, 179, 0.1);
    }
  }

  &.btn-outline {
    background: transparent;
    color: $primary-color;
    border: 1px solid $primary-color;

    &:active {
      background: rgba(100, 207, 179, 0.1);
      transform: scale(0.95);
    }
  }

  &.btn-text {
    background: transparent;
    color: $primary-color;
    border: none;

    &:active {
      background: rgba(100, 207, 179, 0.1);
      transform: scale(0.95);
    }
  }

  &.btn-gradient {
    background: $gradient-primary;
    color: $white;
    border: none;

    &:active {
      transform: scale(0.95);
    }
  }

  &.btn-expense {
    background: $gradient-expense;
    color: $white;
    border: none;

    &:active {
      transform: scale(0.95);
    }
  }

  &.btn-income {
    background: $gradient-income;
    color: $white;
    border: none;

    &:active {
      transform: scale(0.95);
    }
  }

  // 按钮大小
  &.btn-xs {
    height: 24px;
    padding: 0 $spacing-sm;
    font-size: $font-xs;
    border-radius: $radius-sm;
  }

  &.btn-sm {
    height: 32px;
    padding: 0 $spacing-md;
    font-size: $font-xs;
    border-radius: $radius-sm;
  }

  &.btn-md {
    height: 40px;
    padding: 0 $spacing-lg;
    font-size: $font-sm;
    border-radius: $radius-md;
  }

  &.btn-lg {
    height: 48px;
    padding: 0 $spacing-xl;
    font-size: $font-md;
    border-radius: $radius-md;
  }

  &.btn-xl {
    height: 56px;
    padding: 0 $spacing-xxl;
    font-size: $font-lg;
    border-radius: $radius-lg;
  }

  // 按钮形状
  &.btn-round {
    border-radius: 50px;
  }

  &.btn-circle {
    border-radius: 50%;
    aspect-ratio: 1;
  }

  // 块级按钮
  &.btn-block {
    width: 100%;
    display: flex;
  }

  // 禁用状态
  &.btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  // 加载状态
  &.btn-loading {
    pointer-events: none;

    .button-loading {
      .icon-loading {
        animation: spin 1s linear infinite;
      }
    }
  }

  // 只有图标的按钮
  &.btn-icon-only {
    &.btn-xs { padding: 0; width: 24px; }
    &.btn-sm { padding: 0; width: 32px; }
    &.btn-md { padding: 0; width: 40px; }
    &.btn-lg { padding: 0; width: 48px; }
    &.btn-xl { padding: 0; width: 56px; }
  }

  // 按钮内容
  .button-loading,
  .button-icon,
  .button-suffix {
    display: flex;
    align-items: center;
  }

  .button-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // 波纹效果
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 200px;
    height: 200px;
  }
}
</style>