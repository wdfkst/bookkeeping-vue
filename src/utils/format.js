// 格式化金额显示
export function formatAmount(amount) {
  if (typeof amount !== 'number') return '0.00'

  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化日期
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')

  const formats = {
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'MM-DD': `${month}-${day}`,
    'HH:mm': `${hour}:${minute}`,
    'MM-DD HH:mm': `${month}-${day} ${hour}:${minute}`,
    'YYYY-MM-DD HH:mm': `${year}-${month}-${day} ${hour}:${minute}`
  }

  return formats[format] || formats['YYYY-MM-DD']
}

// 格式化相对时间
export function formatRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = now - target

  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < day * 2) {
    return '昨天'
  } else if (diff < day * 3) {
    return '前天'
  } else {
    return formatDate(date, 'MM-DD')
  }
}

// 获取月份名称
export function getMonthName(month) {
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]
  return months[month] || '1月'
}

// 生成唯一ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 深拷贝
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// 验证手机号
export function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 验证邮箱
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 获取随机颜色
export function getRandomColor() {
  const colors = [
    '#64CFB3', '#6FD8D8', '#ADA9E4', '#E9A0A5',
    '#F2D6A7', '#A78BFA', '#34D399', '#FBBF24'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 计算百分比
export function calculatePercentage(part, total) {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

// 存储相关工具
export const storage = {
  set(key, value) {
    try {
      uni.setStorageSync(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },

  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      return value ? JSON.parse(value) : defaultValue
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  },

  remove(key) {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },

  clear() {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}