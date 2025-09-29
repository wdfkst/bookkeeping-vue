// Ant Design Vue 主题定制配置
export const antdTheme = {
  token: {
    // 主色彩
    colorPrimary: '#64CFB3',
    colorSuccess: '#64CFB3',
    colorWarning: '#F2D6A7',
    colorError: '#E9A0A5',
    colorInfo: '#6FD8D8',

    // 文字颜色
    colorText: '#1F2324',
    colorTextSecondary: '#667085',
    colorTextTertiary: '#A2A4A5',
    colorTextQuaternary: '#A2A4A5',

    // 背景色
    colorBgContainer: '#FFFFFF',
    colorBgElevated: 'rgba(255, 255, 255, 0.85)',
    colorBgLayout: '#F5F7FB',

    // 边框
    colorBorder: '#EEF1F5',
    colorBorderSecondary: '#EAECEF',

    // 圆角
    borderRadius: 12,
    borderRadiusLG: 18,
    borderRadiusSM: 8,

    // 字体
    fontFamily: "'PingFang SC', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 18,

    // 间距
    padding: 16,
    paddingLG: 20,
    paddingSM: 12,
    paddingXS: 8,

    // 阴影
    boxShadow: '0 12px 28px rgba(16, 24, 40, 0.06)',
    boxShadowSecondary: '0 8px 20px rgba(16, 24, 40, 0.04)',

    // 动画
    motionDurationMid: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.22, 1, 0.36, 1)'
  },

  components: {
    // 按钮组件定制
    Button: {
      borderRadius: 12,
      controlHeight: 48,
      controlHeightSM: 40,
      controlHeightLG: 56,
      paddingContentHorizontal: 20,
      fontWeight: 500,
      primaryShadow: '0 12px 28px rgba(100, 207, 179, 0.35)'
    },

    // 输入框组件定制
    Input: {
      borderRadius: 14,
      controlHeight: 48,
      paddingInline: 16,
      activeBorderColor: '#64CFB3',
      hoverBorderColor: '#6FD8D8'
    },

    // 卡片组件定制
    Card: {
      borderRadiusLG: 18,
      paddingLG: 20,
      colorBgContainer: 'rgba(255, 255, 255, 0.85)',
      boxShadowTertiary: '0 12px 28px rgba(16, 24, 40, 0.06)'
    },

    // 标签组件定制
    Tag: {
      borderRadiusSM: 12,
      paddingInline: 12,
      marginInlineEnd: 8
    },

    // 模态框组件定制
    Modal: {
      borderRadiusLG: 18,
      paddingLG: 24
    },

    // 抽屉组件定制
    Drawer: {
      borderRadiusLG: 18,
      paddingLG: 20
    },

    // 列表组件定制
    List: {
      paddingLG: 16,
      itemPaddingLG: '16px 0'
    }
  }
}

// 组件库按需引入配置
export const antdComponents = [
  'Button',
  'Input',
  'InputNumber',
  'Card',
  'List',
  'Avatar',
  'Tag',
  'Badge',
  'Progress',
  'Modal',
  'Drawer',
  'Popover',
  'Tooltip',
  'DatePicker',
  'Select',
  'Switch',
  'Radio',
  'Checkbox',
  'Form',
  'Row',
  'Col',
  'Space',
  'Divider',
  'Empty',
  'Spin',
  'message',
  'notification'
]