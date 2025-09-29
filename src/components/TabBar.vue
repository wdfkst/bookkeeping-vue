<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      class="tab-item"
      :class="{ active: currentTab === tab.name }"
      @click="switchTab(tab.name)"
    >
      <div class="tab-icon">
        <img
          v-if="tab.icon && tab.name !== 'add'"
          :src="getIconPath(tab.icon)"
          :alt="tab.label"
          class="tab-image"
        />
        <svg v-else-if="tab.name === 'add'" class="tab-svg" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </g>
        </svg>
      </div>
      <span class="tab-text">{{ tab.label }}</span>
      <div v-if="currentTab === tab.name" class="tab-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentTab: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['tab-change'])

const tabs = [
  { name: 'home', label: '首页', icon: 'home.png' },
  { name: 'transactions', label: '流水', icon: 'bag.png' },
  { name: 'add', label: '', icon: 'plus' }, // 中间的添加按钮
  { name: 'analytics', label: '分析', icon: 'chart.png' },
  { name: 'profile', label: '我的', icon: 'profile.png' }
]

const switchTab = (tabName) => {
  if (tabName === 'add') {
    // 添加按钮触发记账弹窗而不是页面跳转
    emit('tab-change', tabName, { action: 'show-add-modal' })
  } else {
    emit('tab-change', tabName)
  }
}

const getIconPath = (iconName) => {
  return `/img/${iconName}`
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(239, 241, 245, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 1000;

  // Glass morphism effect
  box-shadow:
    0 -2px 20px rgba(0, 0, 0, 0.05),
    0 -1px 0 rgba(255, 255, 255, 0.1) inset;

  .tab-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 60px;

    // 中间的添加按钮特殊样式
    &:nth-child(3) {
      .tab-icon {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #64CFB3, #6FD8D8);
        border-radius: 50%;
        margin-bottom: 4px;
        box-shadow:
          0 8px 24px rgba(100, 207, 179, 0.4),
          0 4px 12px rgba(100, 207, 179, 0.2);
        transform: translateY(-8px);

        &:active {
          transform: translateY(-6px) scale(0.95);
        }

        .tab-svg {
          color: white;
          width: 24px;
          height: 24px;
        }
      }

      .tab-text {
        display: none;
      }
    }

    &:not(:nth-child(3)) {
      &:active {
        transform: scale(0.95);
      }
    }

    .tab-icon {
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      transition: all 0.3s ease;

      .tab-image {
        width: 24px;
        height: 24px;
        object-fit: contain;
        opacity: 0.6;
        transition: all 0.3s ease;
      }

      .tab-svg {
        width: 24px;
        height: 24px;
        color: #A2A4A5;
        transition: all 0.3s ease;
      }
    }

    .tab-text {
      font-size: 10px;
      color: #A2A4A5;
      font-weight: 500;
      letter-spacing: -0.01em;
      transition: color 0.3s ease;
    }

    .tab-indicator {
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: linear-gradient(135deg, #64CFB3, #6FD8D8);
      border-radius: 0 0 2px 2px;
      animation: slideIn 0.3s ease;
    }

    // 激活状态
    &.active:not(:nth-child(3)) {
      .tab-icon {
        .tab-image {
          opacity: 1;
          transform: scale(1.1);
        }

        .tab-svg {
          color: #64CFB3;
          transform: scale(1.1);
        }
      }

      .tab-text {
        color: #64CFB3;
        font-weight: 600;
      }
    }

    // Hover 效果 (桌面端)
    @media (hover: hover) {
      &:hover:not(.active):not(:nth-child(3)) {
        .tab-icon {
          .tab-image {
            opacity: 0.8;
            transform: scale(1.05);
          }

          .tab-svg {
            color: #6FD8D8;
            transform: scale(1.05);
          }
        }

        .tab-text {
          color: #6FD8D8;
        }
      }
    }
  }
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 20px;
    opacity: 1;
  }
}

// 暗色模式适配
@media (prefers-color-scheme: dark) {
  .tab-bar {
    background: rgba(31, 35, 36, 0.95);
    border-top-color: rgba(166, 168, 169, 0.2);
  }
}
</style>