<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar-section">
        <img
          class="avatar"
          src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&h=120&fit=crop&crop=face"
          alt="头像"
        />
        <div class="user-info">
          <h2 class="username">阿森</h2>
          <p class="user-status">记账达人 · 已坚持 128 天</p>
        </div>
        <button class="edit-btn">
          <svg viewBox="0 0 24 24" class="edit-icon">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-number">¥ 33,540</div>
          <div class="stat-label">总资产</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">128</div>
          <div class="stat-label">记账天数</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">¥ 2,456</div>
          <div class="stat-label">本月结余</div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="navigateTo('accounts')">
          <div class="menu-icon wallet">
            <svg viewBox="0 0 24 24">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14V1H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h16v-7h-3a2 2 0 0 1 0-4h3z"/>
              <circle cx="16" cy="12" r="1"/>
            </svg>
          </div>
          <div class="menu-content">
            <div class="menu-title">我的账户</div>
            <div class="menu-subtitle">管理银行卡和钱包</div>
          </div>
          <div class="menu-arrow">
            <svg viewBox="0 0 24 24">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="navigateTo('budgets')">
          <div class="menu-icon budget">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div class="menu-content">
            <div class="menu-title">预算管理</div>
            <div class="menu-subtitle">设置分类预算和提醒</div>
          </div>
          <div class="menu-arrow">
            <svg viewBox="0 0 24 24">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="navigateTo('categories')">
          <div class="menu-icon category">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div class="menu-content">
            <div class="menu-title">分类管理</div>
            <div class="menu-subtitle">自定义收支分类</div>
          </div>
          <div class="menu-arrow">
            <svg viewBox="0 0 24 24">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-item" @click="navigateTo('export')">
          <div class="menu-icon export">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <div class="menu-content">
            <div class="menu-title">数据导出</div>
            <div class="menu-subtitle">导出账单和报表</div>
          </div>
          <div class="menu-arrow">
            <svg viewBox="0 0 24 24">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="navigateTo('settings')">
          <div class="menu-icon settings">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div class="menu-content">
            <div class="menu-title">设置</div>
            <div class="menu-subtitle">通知、安全、主题</div>
          </div>
          <div class="menu-arrow">
            <svg viewBox="0 0 24 24">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="navigateTo('about')">
          <div class="menu-icon about">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="menu-content">
            <div class="menu-title">关于我们</div>
            <div class="menu-subtitle">版本信息和反馈</div>
          </div>
          <div class="menu-arrow">
            <svg viewBox="0 0 24 24">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="logout">
        <svg viewBox="0 0 24 24" class="logout-icon">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup>
const navigateTo = (page) => {
  console.log('导航到:', page)
  // 这里可以添加路由导航逻辑
}

const logout = () => {
  console.log('退出登录')
  // 这里可以添加退出登录逻辑
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #F5F7FB;
  padding: 0 0 100px; // 底部留出Tab栏空间
}

.profile-header {
  background: linear-gradient(135deg, #64CFB3, #6FD8D8);
  padding: 60px 20px 40px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 20px;

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
    }

    .user-info {
      flex: 1;

      .username {
        font-size: 24px;
        font-weight: 600;
        color: white;
        margin: 0 0 4px 0;
      }

      .user-status {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }

    .edit-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
      }

      .edit-icon {
        width: 20px;
        height: 20px;
        stroke: white;
        fill: none;
        stroke-width: 1.5;
      }
    }
  }
}

.stats-section {
  padding: 0 20px;
  margin-bottom: 20px;

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

    .stat-item {
      text-align: center;

      .stat-number {
        font-size: 20px;
        font-weight: 700;
        color: #1F2324;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 12px;
        color: #A2A4A5;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: #EEF1F5;
    }
  }
}

.menu-section {
  padding: 0 20px;

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

        svg {
          width: 20px;
          height: 20px;
          stroke: white;
          fill: none;
          stroke-width: 1.5;
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

        .menu-title {
          font-size: 16px;
          font-weight: 500;
          color: #1F2324;
          margin-bottom: 2px;
        }

        .menu-subtitle {
          font-size: 12px;
          color: #A2A4A5;
        }
      }

      .menu-arrow {
        svg {
          width: 16px;
          height: 16px;
          stroke: #A2A4A5;
          fill: none;
          stroke-width: 1.5;
        }
      }
    }
  }
}

.logout-section {
  padding: 20px;

  .logout-btn {
    width: 100%;
    height: 56px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px);
    border: 1px solid #EEF1F5;
    border-radius: 18px;
    box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #E76F51;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background: rgba(231, 111, 81, 0.05);
    }

    .logout-icon {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5;
    }
  }
}
</style>