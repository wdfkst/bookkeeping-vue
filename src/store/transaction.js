import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // 所有交易记录
    categories: [], // 分类列表
    accounts: [], // 账户列表
    budgets: [], // 预算列表
    loading: false
  }),

  getters: {
    // 获取当月收入
    monthlyIncome: (state) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      return state.transactions
        .filter(t => {
          const date = new Date(t.date)
          return date.getMonth() === currentMonth &&
                 date.getFullYear() === currentYear &&
                 t.type === 'income'
        })
        .reduce((sum, t) => sum + t.amount, 0)
    },

    // 获取当月支出
    monthlyExpense: (state) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      return state.transactions
        .filter(t => {
          const date = new Date(t.date)
          return date.getMonth() === currentMonth &&
                 date.getFullYear() === currentYear &&
                 t.type === 'expense'
        })
        .reduce((sum, t) => sum + t.amount, 0)
    },

    // 获取月度趋势（与上月比较）
    monthlyTrend: (state) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

      const currentMonthTotal = state.transactions
        .filter(t => {
          const date = new Date(t.date)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)

      const lastMonthTotal = state.transactions
        .filter(t => {
          const date = new Date(t.date)
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        })
        .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)

      if (lastMonthTotal === 0) return 0
      return Math.round(((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
    },

    // 获取最近的交易记录
    recentTransactions: (state) => {
      return state.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(t => {
          const category = state.categories.find(c => c.id === t.categoryId)
          const account = state.accounts.find(a => a.id === t.accountId)
          const date = new Date(t.date)

          // 格式化时间
          const now = new Date()
          const isToday = date.toDateString() === now.toDateString()
          const isYesterday = date.toDateString() === new Date(now.getTime() - 86400000).toDateString()

          let timeString
          if (isToday) {
            timeString = `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
          } else if (isYesterday) {
            timeString = `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
          } else {
            timeString = `${date.getMonth() + 1}/${date.getDate()}`
          }

          return {
            ...t,
            categoryIcon: category?.icon || '💰',
            categoryColor: category?.color || '#64CFB3',
            categoryName: category?.name || '其他',
            accountName: account?.name || '未知账户',
            time: timeString
          }
        })
    },

    // 按分类统计支出
    expenseByCategory: (state) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const expenses = state.transactions.filter(t => {
        const date = new Date(t.date)
        return date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear &&
               t.type === 'expense'
      })

      const categoryStats = {}
      expenses.forEach(t => {
        if (!categoryStats[t.categoryId]) {
          categoryStats[t.categoryId] = 0
        }
        categoryStats[t.categoryId] += t.amount
      })

      return Object.entries(categoryStats).map(([categoryId, amount]) => {
        const category = state.categories.find(c => c.id === categoryId)
        return {
          categoryId,
          categoryName: category?.name || '其他',
          categoryIcon: category?.icon || '💰',
          categoryColor: category?.color || '#64CFB3',
          amount,
          percentage: Math.round((amount / this.monthlyExpense) * 100)
        }
      }).sort((a, b) => b.amount - a.amount)
    }
  },

  actions: {
    // 初始化数据
    initData() {
      this.loadTransactions()
      this.loadCategories()
      this.loadAccounts()
      this.loadBudgets()
    },

    // 加载交易记录
    loadTransactions() {
      const savedTransactions = this.getFromStorage('transactions') || []
      this.transactions = savedTransactions

      // 如果没有数据，添加一些示例数据
      if (savedTransactions.length === 0) {
        this.initSampleData()
      }
    },

    // 保存交易记录
    saveTransactions() {
      this.setToStorage('transactions', this.transactions)
    },

    // 添加交易记录
    addTransaction(transaction) {
      const newTransaction = {
        id: Date.now().toString(),
        ...transaction,
        date: transaction.date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      this.transactions.unshift(newTransaction)
      this.saveTransactions()
      return newTransaction
    },

    // 更新交易记录
    updateTransaction(id, updates) {
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        this.transactions[index] = { ...this.transactions[index], ...updates }
        this.saveTransactions()
      }
    },

    // 删除交易记录
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id)
      this.saveTransactions()
    },

    // 加载分类
    loadCategories() {
      const savedCategories = this.getFromStorage('categories') || []
      this.categories = savedCategories.length > 0 ? savedCategories : this.getDefaultCategories()
      if (savedCategories.length === 0) {
        this.setToStorage('categories', this.categories)
      }
    },

    // 获取默认分类
    getDefaultCategories() {
      return [
        { id: '1', name: '餐饮', icon: 'food', color: 'linear-gradient(135deg, #E9A0A5, #F2D6A7)', type: 'expense' },
        { id: '2', name: '出行', icon: 'car', color: 'linear-gradient(135deg, #ADA9E4, #6FD8D8)', type: 'expense' },
        { id: '3', name: '购物', icon: 'shopping', color: 'linear-gradient(135deg, #64CFB3, #6FD8D8)', type: 'expense' },
        { id: '4', name: '住房', icon: 'home', color: 'linear-gradient(135deg, #ADA9E4, #E9A0A5)', type: 'expense' },
        { id: '5', name: '娱乐', icon: 'entertainment', color: 'linear-gradient(135deg, #F2D6A7, #E9A0A5)', type: 'expense' },
        { id: '6', name: '医疗', icon: 'plus', color: 'linear-gradient(135deg, #6FD8D8, #64CFB3)', type: 'expense' },
        { id: '7', name: '学习', icon: 'computer', color: 'linear-gradient(135deg, #ADA9E4, #64CFB3)', type: 'expense' },
        { id: '8', name: '工资', icon: 'work', color: 'linear-gradient(135deg, #64CFB3, #6FD8D8)', type: 'income' },
        { id: '9', name: '理财', icon: 'finance', color: 'linear-gradient(135deg, #ADA9E4, #6FD8D8)', type: 'income' },
        { id: '10', name: '其他', icon: 'money', color: 'linear-gradient(135deg, #64CFB3, #6FD8D8)', type: 'both' }
      ]
    },

    // 加载账户
    loadAccounts() {
      const savedAccounts = this.getFromStorage('accounts') || []
      this.accounts = savedAccounts.length > 0 ? savedAccounts : this.getDefaultAccounts()
      if (savedAccounts.length === 0) {
        this.setToStorage('accounts', this.accounts)
      }
    },

    // 获取默认账户
    getDefaultAccounts() {
      return [
        { id: '1', name: '工资卡', type: 'bank', balance: 24560, icon: '💳', color: '#64CFB3' },
        { id: '2', name: '储蓄卡', type: 'bank', balance: 8340, icon: '💳', color: '#ADA9E4' },
        { id: '3', name: '现金', type: 'cash', balance: 560, icon: '💵', color: '#E9A0A5' },
        { id: '4', name: '支付宝', type: 'alipay', balance: 1200, icon: '📱', color: '#6FD8D8' },
        { id: '5', name: '微信', type: 'wechat', balance: 800, icon: '📱', color: '#64CFB3' }
      ]
    },

    // 加载预算
    loadBudgets() {
      const savedBudgets = this.getFromStorage('budgets') || []
      this.budgets = savedBudgets
    },

    // localStorage 操作方法
    getFromStorage(key) {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error(`读取 ${key} 失败:`, error)
        return null
      }
    },

    setToStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`保存 ${key} 失败:`, error)
      }
    },

    // 初始化示例数据
    initSampleData() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const sampleTransactions = [
        // 今天的交易
        {
          id: '1',
          type: 'expense',
          amount: 32,
          categoryId: '1',
          accountId: '4',
          title: '午餐 · 拉面',
          note: '和同事一起吃的',
          date: new Date(today.getTime() - 4 * 3600000).toISOString(), // 今天下午1点
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'expense',
          amount: 25.5,
          categoryId: '1',
          accountId: '4',
          title: '下午茶',
          note: '星巴克咖啡',
          date: new Date(today.getTime() - 1 * 3600000).toISOString(), // 今天下午4点
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'expense',
          amount: 31,
          categoryId: '2',
          accountId: '4',
          title: '打车',
          note: '回家',
          date: new Date(today.getTime() + 1 * 3600000).toISOString(), // 今天晚上7点
          createdAt: new Date().toISOString()
        },

        // 昨天的交易
        {
          id: '4',
          type: 'income',
          amount: 8000,
          categoryId: '8',
          accountId: '1',
          title: '工资',
          note: '月薪到账',
          date: new Date(today.getTime() - 86400000 + 9 * 3600000).toISOString(), // 昨天上午9点
          createdAt: new Date(today.getTime() - 86400000).toISOString()
        },
        {
          id: '5',
          type: 'expense',
          amount: 120.58,
          categoryId: '3',
          accountId: '1',
          title: '超市购物',
          note: '买菜和日用品',
          date: new Date(today.getTime() - 86400000 + 19 * 3600000).toISOString(), // 昨天晚上7点
          createdAt: new Date(today.getTime() - 86400000).toISOString()
        },

        // 前天的交易
        {
          id: '6',
          type: 'income',
          amount: 520,
          categoryId: '9',
          title: '理财收益',
          note: '基金分红',
          date: new Date(today.getTime() - 2 * 86400000 + 10 * 3600000).toISOString(),
          createdAt: new Date(today.getTime() - 2 * 86400000).toISOString()
        },
        {
          id: '7',
          type: 'expense',
          amount: 68,
          categoryId: '1',
          accountId: '5',
          title: '晚餐',
          note: '日料',
          date: new Date(today.getTime() - 2 * 86400000 + 19 * 3600000).toISOString(),
          createdAt: new Date(today.getTime() - 2 * 86400000).toISOString()
        },

        // 本周其他交易
        {
          id: '8',
          type: 'expense',
          amount: 2500,
          categoryId: '4',
          accountId: '1',
          title: '房租',
          note: '月租',
          date: new Date(today.getTime() - 3 * 86400000).toISOString(),
          createdAt: new Date(today.getTime() - 3 * 86400000).toISOString()
        },
        {
          id: '9',
          type: 'expense',
          amount: 89,
          categoryId: '5',
          accountId: '4',
          title: '电影票',
          note: '和朋友看电影',
          date: new Date(today.getTime() - 4 * 86400000).toISOString(),
          createdAt: new Date(today.getTime() - 4 * 86400000).toISOString()
        },
        {
          id: '10',
          type: 'expense',
          amount: 150,
          categoryId: '6',
          accountId: '2',
          title: '体检费',
          note: '年度体检',
          date: new Date(today.getTime() - 5 * 86400000).toISOString(),
          createdAt: new Date(today.getTime() - 5 * 86400000).toISOString()
        },
        {
          id: '11',
          type: 'expense',
          amount: 299,
          categoryId: '7',
          accountId: '1',
          title: '在线课程',
          note: 'Vue进阶课程',
          date: new Date(today.getTime() - 6 * 86400000).toISOString(),
          createdAt: new Date(today.getTime() - 6 * 86400000).toISOString()
        },

        // 上月数据（用于计算趋势）
        {
          id: '12',
          type: 'income',
          amount: 7800,
          categoryId: '8',
          accountId: '1',
          title: '工资',
          note: '上月工资',
          date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString(),
          createdAt: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString()
        },
        {
          id: '13',
          type: 'expense',
          amount: 3200,
          categoryId: '4',
          accountId: '1',
          title: '各种支出',
          note: '上月支出',
          date: new Date(today.getFullYear(), today.getMonth() - 1, 20).toISOString(),
          createdAt: new Date(today.getFullYear(), today.getMonth() - 1, 20).toISOString()
        }
      ]

      this.transactions = sampleTransactions
      this.saveTransactions()
    }
  }
})