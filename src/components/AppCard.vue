<template>
  <view class="app-card" :class="cardClass" :style="cardStyle">
    <slot></slot>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 卡片类型
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'glass', 'flat', 'shadow', 'border'].includes(value)
  },
  // 圆角大小
  radius: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  // 内边距
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false
  }
})

const cardClass = computed(() => [
  `card-${props.type}`,
  `radius-${props.radius}`,
  `padding-${props.padding}`,
  {
    'clickable': props.clickable
  }
])

const cardStyle = computed(() => props.customStyle)
</script>

<style lang="scss" scoped>
.app-card {
  transition: all 0.3s ease;

  // 卡片类型
  &.card-default {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px);
    border: 1px solid $border-color;
    box-shadow: $shadow-card;
  }

  &.card-glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: $shadow-light;
  }

  &.card-flat {
    background: $white;
    border: 1px solid $border-color;
  }

  &.card-shadow {
    background: $white;
    box-shadow: $shadow-card;
    border: none;
  }

  &.card-border {
    background: transparent;
    border: 2px solid $border-color;
  }

  // 圆角大小
  &.radius-sm { border-radius: $radius-sm; }
  &.radius-md { border-radius: $radius-md; }
  &.radius-lg { border-radius: $radius-lg; }
  &.radius-xl { border-radius: $radius-xl; }

  // 内边距
  &.padding-none { padding: 0; }
  &.padding-xs { padding: $spacing-xs; }
  &.padding-sm { padding: $spacing-sm; }
  &.padding-md { padding: $spacing-md; }
  &.padding-lg { padding: $spacing-lg; }
  &.padding-xl { padding: $spacing-xl; }

  // 可点击状态
  &.clickable {
    cursor: pointer;

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>