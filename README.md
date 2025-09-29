# 清新记账 Vue + uniapp 项目

## 📱 项目简介

这是一个基于 **Vue 3 + uniapp** 开发的清新风格记账应用，主打简洁美观的界面设计和快速记账体验。采用薄荷绿配色和毛玻璃质感设计，完美还原原型图的视觉效果，支持一键编译为微信小程序和H5应用。

## ✨ 主要特性

- 🎨 **清新设计**: 薄荷绿主色调，毛玻璃质感，圆角卡片设计
- ⚡ **快速记账**: 3秒完成一笔记录，支持计算器输入
- 📊 **数据可视化**: 环形图、折线图展示收支趋势
- 🔄 **跨平台**: 一套代码同时支持微信小程序和H5
- 🎯 **智能分类**: 8大预设分类，支持自定义扩展
- 💳 **多账户**: 支持银行卡、现金、电子钱包管理
- 📈 **预算管理**: 分类预算设置和超支预警
- 🌙 **主题切换**: 浅色/深色主题适配

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.3+ | 前端框架 |
| uniapp | 3.0+ | 跨平台开发框架 |
| Vite | 4.0+ | 构建工具 |
| Pinia | 2.1+ | 状态管理 |
| SCSS | 1.60+ | CSS预处理器 |
| Ant Design Vue | 4.0+ | UI组件库（定制化） |

## 📁 项目结构

```
vue-jizhang/
├── src/
│   ├── components/          # 公共组件
│   │   ├── AppCard.vue     # 卡片组件
│   │   ├── AppButton.vue   # 按钮组件
│   │   └── AppModal.vue    # 弹窗组件
│   ├── store/              # 状态管理
│   │   └── transaction.js  # 交易记录状态
│   ├── styles/             # 样式文件
│   │   ├── global.scss     # 全局样式
│   │   └── iconfont.scss   # 图标字体
│   ├── utils/              # 工具函数
│   │   └── format.js       # 格式化工具
│   ├── config/             # 配置文件
│   │   └── antd.js         # Ant Design 主题配置
│   └── api/                # 接口管理
├── pages/                  # 页面文件
│   ├── home/              # 首页
│   ├── add/               # 记账页面
│   ├── list/              # 流水列表
│   ├── analysis/          # 数据分析
│   └── settings/          # 设置页面
├── static/                # 静态资源
│   └── tabbar/            # 底部导航图标
├── manifest.json          # 应用配置
├── pages.json             # 页面路由配置
├── vite.config.js         # Vite配置
└── package.json           # 依赖管理
```

## 🎨 设计规范

### 色彩规范
```scss
// 主色调
$primary-color: #64CFB3;      // 薄荷绿
$secondary-color: #6FD8D8;    // 青蓝色
$accent-color: #ADA9E4;       // 淡紫色

// 功能色
$expense-color: #E9A0A5;      // 支出色(珊瑚红)
$income-color: #64CFB3;       // 收入色(薄荷绿)
$warning-color: #F2D6A7;      // 警告色(金黄色)

// 文字色
$text-primary: #1F2324;       // 主要文字
$text-secondary: #A2A4A5;     // 次要文字
$text-light: #667085;         // 浅色文字

// 背景色
$bg-color: #F5F7FB;           // 页面背景
$border-color: #EEF1F5;       // 边框色
```

### 组件规范
- **卡片**: 18px圆角，毛玻璃背景，细腻投影
- **按钮**: 12px圆角，渐变背景，按压缩放效果
- **图标**: 24px标准尺寸，1.5px描边，支持多种状态

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn
- HBuilderX (推荐) 或 CLI 开发

### 安装依赖
```bash
cd vue-jizhang
npm install
```

### 开发运行
```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin
```

### 项目构建
```bash
# 构建H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin
```

## 📱 功能模块

### 1. 首页仪表盘
- ✅ 月度收支概览
- ✅ 环形图展示收支比例
- ✅ 快捷记账入口
- ✅ 最近交易记录
- ✅ 悬浮记账按钮

### 2. 快速记账
- ✅ 收入/支出/转账类型切换
- ✅ 计算器式金额输入
- ✅ 智能分类选择
- ✅ 多账户支持
- ✅ 日期时间设置
- ✅ 备注信息

### 3. 流水管理
- 🔄 交易记录列表
- 🔄 多维度筛选
- 🔄 搜索功能
- 🔄 批量操作

### 4. 数据分析
- 🔄 收支趋势图表
- 🔄 分类占比统计
- 🔄 月度/年度对比
- 🔄 财务健康评分

### 5. 预算管理
- 🔄 分类预算设置
- 🔄 预算使用进度
- 🔄 超支预警提醒
- 🔄 预算建议

### 6. 设置中心
- 🔄 个人信息管理
- 🔄 账户安全设置
- 🔄 主题切换
- 🔄 数据导入导出

**图例**: ✅ 已完成 | 🔄 进行中 | ⏳ 计划中

## 🔧 开发指南

### 添加新页面
1. 在 `pages/` 目录下创建页面文件
2. 在 `pages.json` 中配置路由
3. 使用统一的页面模板和样式

### 自定义组件
1. 在 `src/components/` 目录下创建组件
2. 遵循设计规范，使用预定义的样式变量
3. 支持主题切换和响应式设计

### 状态管理
```javascript
// 使用 Pinia store
import { useTransactionStore } from '@/store/transaction'

const transactionStore = useTransactionStore()
```

### 样式开发
```scss
// 使用全局样式变量
.my-component {
  background: $gradient-primary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}
```

## 📦 部署指南

### 微信小程序部署
1. 在微信开发者工具中导入 `dist/build/mp-weixin` 目录
2. 配置小程序 appid
3. 上传审核发布

### H5部署
1. 将 `dist/build/h5` 目录上传到服务器
2. 配置 nginx 或其他 web 服务器
3. 设置 HTTPS 和域名

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔮 未来规划

### v1.5 增强版
- [ ] 预算管理功能
- [ ] 高级数据筛选
- [ ] 数据导入导出
- [ ] 多主题支持

### v2.0 AI版本
- [ ] 智能分类识别
- [ ] 消费习惯分析
- [ ] AI财务建议
- [ ] 语音记账

### v2.5 社交版
- [ ] 家庭共享账本
- [ ] 好友记账PK
- [ ] 消费分享功能

## 📞 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 作者邮箱: [Your Email]

---

**享受记账，轻松理财 💰**