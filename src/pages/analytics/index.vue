<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1 class="page-title">数据分析</h1>
      <div class="time-selector">
        <button class="time-btn active">月度</button>
        <button class="time-btn">年度</button>
      </div>
    </div>

    <!-- 总览卡片 -->
    <div class="overview-cards">
      <div class="overview-card income">
        <div class="card-icon">
          <SvgIcon name="trending-up" :size="24" color="white" />
        </div>
        <div class="card-info">
          <div class="card-label">本月收入</div>
          <div class="card-amount">¥ 12,300</div>
          <div class="card-trend up">+15.3%</div>
        </div>
      </div>
      <div class="overview-card expense">
        <div class="card-icon">
          <SvgIcon name="trending-down" :size="24" color="white" />
        </div>
        <div class="card-info">
          <div class="card-label">本月支出</div>
          <div class="card-amount">¥ 3,880</div>
          <div class="card-trend down">-8.2%</div>
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
        <div class="chart-placeholder">
          <div class="chart-lines">
            <svg viewBox="0 0 300 120" class="trend-chart">
              <!-- 收入趋势线 -->
              <path
                d="M20 80 L60 60 L100 45 L140 35 L180 40 L220 25 L260 30 L280 20"
                stroke="#64CFB3"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <!-- 支出趋势线 -->
              <path
                d="M20 90 L60 85 L100 75 L140 70 L180 65 L220 60 L260 55 L280 50"
                stroke="#E9A0A5"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <!-- 数据点 -->
              <circle cx="280" cy="20" r="4" fill="#64CFB3"/>
              <circle cx="280" cy="50" r="4" fill="#E9A0A5"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类分析 -->
    <div class="category-section card">
      <div class="section-header">
        <h3 class="section-title">支出分类</h3>
        <button class="view-all-btn">查看全部</button>
      </div>
      <div class="category-chart">
        <div class="donut-chart">
          <div class="chart-center">
            <div class="center-amount">¥ 3,880</div>
            <div class="center-label">总支出</div>
          </div>
        </div>
        <div class="category-list">
          <div class="category-item">
            <div class="category-info">
              <div class="category-icon" style="background: #E9A0A5;">
                <SvgIcon name="food" :size="16" color="white" />
              </div>
              <div class="category-details">
                <div class="category-name">餐饮</div>
                <div class="category-percent">32%</div>
              </div>
            </div>
            <div class="category-amount">¥ 1,242</div>
          </div>
          <div class="category-item">
            <div class="category-info">
              <div class="category-icon" style="background: #ADA9E4;">
                <SvgIcon name="car" :size="16" color="white" />
              </div>
              <div class="category-details">
                <div class="category-name">出行</div>
                <div class="category-percent">18%</div>
              </div>
            </div>
            <div class="category-amount">¥ 698</div>
          </div>
          <div class="category-item">
            <div class="category-info">
              <div class="category-icon" style="background: #F2D6A7;">
                <SvgIcon name="shopping" :size="16" color="white" />
              </div>
              <div class="category-details">
                <div class="category-name">购物</div>
                <div class="category-percent">24%</div>
              </div>
            </div>
            <div class="category-amount">¥ 931</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const timeMode = ref('monthly')
</script>

<style lang="scss" scoped>
.analytics-page {
  min-height: 100vh;
  background: #F5F7FB;
  padding: 20px 20px 100px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1F2324;
    margin: 0;
  }

  .time-selector {
    display: flex;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 4px;
    border: 1px solid #EEF1F5;

    .time-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-size: 14px;
      color: #667085;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: linear-gradient(135deg, #64CFB3, #6FD8D8);
        color: white;
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

  .overview-card {
    @extend .card;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    &.income .card-icon {
      background: linear-gradient(135deg, #64CFB3, #6FD8D8);
    }

    &.expense .card-icon {
      background: linear-gradient(135deg, #E9A0A5, #F2D6A7);
    }

    .card-info {
      flex: 1;

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
    .chart-placeholder {
      height: 120px;
      position: relative;

      .trend-chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.category-section {
  padding: 20px;

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

    .view-all-btn {
      background: none;
      border: none;
      color: #6FD8D8;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .category-chart {
    display: flex;
    align-items: center;
    gap: 20px;

    .donut-chart {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: conic-gradient(
        #E9A0A5 0 115deg,
        #F2D6A7 115deg 201deg,
        #ADA9E4 201deg 266deg,
        #EEF1F5 266deg 360deg
      );
      position: relative;
      flex-shrink: 0;

      &::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
      }

      .chart-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        .center-amount {
          font-size: 14px;
          font-weight: 600;
          color: #1F2324;
        }

        .center-label {
          font-size: 10px;
          color: #A2A4A5;
        }
      }
    }

    .category-list {
      flex: 1;

      .category-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;

        .category-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .category-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .category-details {
            .category-name {
              font-size: 14px;
              color: #1F2324;
              font-weight: 500;
            }

            .category-percent {
              font-size: 12px;
              color: #A2A4A5;
            }
          }
        }

        .category-amount {
          font-size: 14px;
          font-weight: 600;
          color: #1F2324;
        }
      }
    }
  }
}
</style>