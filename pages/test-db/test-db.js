const dbOps = require('../../utils/db-operations')

Page({
  data: {
    isConnected: false,
    hasUser: false,
    logs: [],
    workouts: []
  },

  onLoad() {
    this.addLog('测试页面加载完成')
    this.checkUserStatus()
  },

  // 检查用户登录状态
  async checkUserStatus() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      const hasUser = !!userInfo
      this.setData({ hasUser })

      if (hasUser) {
        this.addLog(`✅ 已登录: ${userInfo.nickName}`)
        // 自动测试连接
        this.testConnection()
      } else {
        this.addLog('⚠️ 用户未登录，请先授权登录')
      }
    } catch (error) {
      this.addLog(`检查登录状态失败: ${error.message}`)
    }
  },

  // 授权登录
  async onLogin() {
    wx.showLoading({ title: '登录中...' })

    try {
      const res = await wx.getUserProfile({
        desc: '用于展示用户信息'
      })

      const userInfo = res.userInfo
      this.addLog(`用户信息: ${userInfo.nickName}`)

      // 保存到云数据库
      const saved = await dbOps.upsertUser(userInfo)

      if (saved) {
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ hasUser: true })
        this.addLog('✅ 登录成功！')
        wx.showToast({ title: '登录成功', icon: 'success' })
        // 登录成功后自动测试连接
        setTimeout(() => {
          this.testConnection()
        }, 1000)
      } else {
        this.addLog('❌ 登录失败，请重试')
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
      }
    } catch (error) {
      console.error('登录失败', error)
      this.addLog(`❌ 登录取消: ${error.errMsg || error.message}`)
      wx.showToast({ title: '登录取消', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 添加日志
  addLog(message) {
    const logs = this.data.logs
    const time = new Date().toLocaleTimeString()
    const logEntry = `[${time}] ${message}`
    logs.unshift(logEntry)
    if (logs.length > 50) logs.pop()
    this.setData({ logs })

    // 同时保存到云数据库，方便读取
    this._saveLogToCloud(logEntry)
  },

  // 保存日志到云数据库
  async _saveLogToCloud(logEntry) {
    try {
      const db = wx.cloud.database()
      // 只保存最近的日志，避免数据过多
      await db.collection('jyb_test_logs').add({
        data: {
          logEntry,
          timestamp: Date.now(),
          createTime: Date.now()
        }
      })
    } catch (error) {
      // 日志保存失败不影响主流程
      console.log('保存日志到云端失败:', error)
    }
  },

  // 测试连接
  async testConnection() {
    this.addLog('开始测试连接...')
    this.addLog('检查云开发环境...')

    try {
      // 检查云开发是否初始化
      if (!wx.cloud) {
        this.addLog('❌ 云开发环境未初始化')
        return
      }

      // 检查环境 ID
      const env = wx.cloud.getWXContext ? wx.cloud.getWXContext().ENV : 'unknown'
      this.addLog(`环境 ID: ${env}`)

      // 检查用户登录状态
      const context = wx.cloud.getWXContext ? wx.cloud.getWXContext() : {}
      if (!context.OPENID) {
        this.addLog('⚠️ 用户未登录，获取 OPENID 中...')
        // 尝试获取用户信息
        const userInfo = await this._getUserOpenId()
        this.addLog(`OPENID: ${userInfo.OPENID || '未获取到'}`)
      } else {
        this.addLog(`OPENID: ${context.OPENID.substring(0, 8)}...`)
      }

      // 测试数据库连接
      this.addLog('测试数据库连接...')
      const res = await dbOps.db.collection('jyb_workouts').limit(1).get()
      this.setData({ isConnected: true })
      this.addLog('✅ 云数据库连接成功')
      this.addLog(`集合 jyb_workouts 存在，当前记录数: ${res.data.length}`)
    } catch (error) {
      this.setData({ isConnected: false })
      this.addLog(`❌ 连接失败: ${error.message || error.errMsg}`)
      this.addLog(`错误代码: ${error.errCode}`)

      // 如果集合不存在，说明还没插入过数据
      if (error.errCode === 'DATABASE_COLLECTION_NOT_EXIST') {
        this.addLog('提示: 数据库集合还不存在，请点击"直接添加记录"创建')
      }
    }
  },

  // 直接添加记录（使用原生 API，不封装）
  async testDirectAdd() {
    this.addLog('========================================')
    this.addLog('开始直接添加记录（原生 API）...')

    try {
      // 获取数据库实例
      const db = wx.cloud.database()

      // 在小程序端，必须通过云函数获取 OPENID
      this.addLog('获取用户 OPENID...')
      const loginRes = await this._getUserOpenId()

      if (!loginRes || !loginRes.OPENID) {
        this.addLog('❌ 无法获取 OPENID')
        this.addLog('请确保已授权登录')
        this.addLog('提示：云数据库需要用户登录才能写入')
        return
      }

      this.addLog(`✅ OPENID: ${loginRes.OPENID.substring(0, 8)}...`)

      // 准备数据
      const testData = {
        workoutId: `direct_test_${Date.now()}`,
        name: '直接测试训练',
        date: new Date().toLocaleDateString('zh-CN'),
        duration: '15:00',
        totalVolume: 500,
        exercises: [{
          id: 'test_ex',
          name: '测试动作',
          muscleGroup: '测试',
          equipment: '无',
          sets: [{ weight: 10, reps: 5, done: true }]
        }],
        timestamp: Date.now(),
        createTime: Date.now()
      }

      this.addLog('准备插入数据...')
      this.addLog(`集合: jyb_workouts`)
      this.addLog(`数据: ${JSON.stringify(testData)}`)

      // 直接插入（首次会自动创建集合）
      const res = await db.collection('jyb_workouts').add({
        data: testData
      })

      this.addLog('✅ 插入成功!')
      this.addLog(`记录 ID: ${res._id}`)
      this.addLog('提示: 首次插入会自动创建数据库集合')

      // 重新测试连接
      setTimeout(() => {
        this.testConnection()
      }, 1000)

    } catch (error) {
      this.addLog('❌ 插入失败')
      this.addLog(`错误信息: ${error.message || error.errMsg}`)
      this.addLog(`错误代码: ${error.errCode}`)

      if (error.errCode === 'PERMISSION_DENIED' || error.errCode === -502001) {
        this.addLog('⚠️ 权限被拒绝')
        this.addLog('可能原因：')
        this.addLog('1. 数据库安全规则未配置')
        this.addLog('2. 用户未登录或 OPENID 无效')
        this.addLog('解决方案：')
        this.addLog('- 在云开发控制台设置集合权限为"所有用户可读，仅创建者可写"')
      } else if (error.errMsg && error.errMsg.includes('DATABASE_COLLECTION_NOT_EXIST')) {
        this.addLog('⚠️ 数据库集合不存在')
        this.addLog('正在尝试创建集合...')
        this.addLog('提示：首次插入会自动创建集合，请稍后重试')
      }
    }

    this.addLog('========================================')
  },

  // 获取用户 OPENID
  async _getUserOpenId() {
    try {
      this.addLog('正在调用 login 云函数...')
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {}
      })

      this.addLog(`云函数调用成功: ${JSON.stringify(res.result).substring(0, 100)}...`)

      // 优先检查 userInfo.openId（实际返回格式）
      if (res.result && res.result.userInfo && res.result.userInfo.openId) {
        this.addLog(`✅ 从 userInfo.openId 获取成功`)
        return { OPENID: res.result.userInfo.openId }
      }
      // 兼容 OPENID（大写）
      else if (res.result && res.result.OPENID) {
        return res.result
      }
      // 兼容 openid（小写）
      else if (res.result && res.result.openid) {
        return { OPENID: res.result.openid }
      }
      else {
        this.addLog('❌ 云函数返回的数据格式异常')
        this.addLog(`完整返回: ${JSON.stringify(res.result)}`)
        return { OPENID: '' }
      }
    } catch (error) {
      this.addLog(`❌ 调用 login 云函数失败`)
      this.addLog(`错误信息: ${error.errMsg || error.message}`)
      this.addLog(`错误代码: ${error.errCode}`)
      return { OPENID: '' }
    }
  },

  // 测试创建用户
  async testCreateUser() {
    this.addLog('开始创建测试用户...')
    try {
      const userInfo = {
        nickname: '测试用户',
        avatar: '',
        level: 1,
        totalWorkouts: 0,
        totalVolume: 0
      }
      const result = await dbOps.upsertUser(userInfo)
      if (result) {
        this.addLog('✅ 用户创建/更新成功')
        const user = await dbOps.getUser()
        this.addLog(`用户信息: ${JSON.stringify(user)}`)
      } else {
        this.addLog('❌ 用户创建失败')
      }
    } catch (error) {
      this.addLog(`❌ 创建用户异常: ${error.message}`)
    }
  },

  // 测试保存训练记录
  async testSaveWorkout() {
    this.addLog('开始保存测试训练记录...')

    try {
      // 先检查 OPENID
      this.addLog('检查用户登录状态...')
      const context = wx.cloud.getWXContext ? wx.cloud.getWXContext() : null

      if (!context || !context.OPENID) {
        this.addLog('⚠️ 用户未登录，尝试获取 OPENID...')
        const loginRes = await this._getUserOpenId()
        if (!loginRes.OPENID) {
          this.addLog('❌ 无法获取 OPENID，请先登录')
          this.addLog('提示: 首次使用需要授权登录')
          return
        }
        this.addLog(`✅ OPENID: ${loginRes.OPENID.substring(0, 8)}...`)
      } else {
        this.addLog(`✅ 已登录，OPENID: ${context.OPENID.substring(0, 8)}...`)
      }

      this.addLog('准备保存数据...')

      const record = {
        workoutId: `test_${Date.now()}`,
        name: '测试训练',
        date: new Date().toLocaleDateString('zh-CN'),
        duration: '30:00',
        totalVolume: 1000,
        exercises: [
          {
            id: 'ex1',
            name: '深蹲',
            muscleGroup: '腿部',
            equipment: '杠铃',
            sets: [
              { weight: 100, reps: 10, done: true },
              { weight: 100, reps: 10, done: true }
            ]
          }
        ]
      }

      this.addLog(`数据: ${JSON.stringify(record)}`)

      const result = await dbOps.saveWorkout(record)

      if (result) {
        this.addLog('✅ 训练记录保存成功')
        this.addLog('提示: 首次插入会自动创建数据库集合')
        this.testGetWorkouts()
      } else {
        this.addLog('❌ 训练记录保存失败')
        this.addLog('提示: 检查控制台查看详细错误信息')
      }
    } catch (error) {
      this.addLog(`❌ 保存训练记录异常`)
      this.addLog(`错误信息: ${error.message || error.errMsg}`)
      this.addLog(`错误代码: ${error.errCode || '未知'}`)

      // 特殊处理：权限错误
      if (error.errCode === 'PERMISSION_DENIED' || error.errCode === -502001) {
        this.addLog('⚠️ 权限被拒绝')
        this.addLog('请检查数据库安全规则是否已配置')
      }
    }
  },

  // 测试获取训练记录
  async testGetWorkouts() {
    this.addLog('开始获取训练记录...')
    try {
      const workouts = await dbOps.getWorkouts(20, 0)
      this.setData({ workouts })
      this.addLog(`✅ 获取到 ${workouts.length} 条训练记录`)
      workouts.forEach(w => {
        this.addLog(`  - ${w.name}: ${w.date}, 训练量: ${w.totalVolume}`)
      })
    } catch (error) {
      this.addLog(`❌ 获取训练记录失败: ${error.message}`)
    }
  },

  // 测试挑战功能
  async testChallenge() {
    this.addLog('开始测试挑战功能...')
    try {
      // 加入挑战
      const challengeData = {
        challengeId: 'challenge_21days',
        name: '21天健身挑战',
        totalDays: 21,
        icon: '🏆'
      }
      const result = await dbOps.toggleChallenge({ ...challengeData, isJoin: true })
      if (result) {
        this.addLog('✅ 加入挑战成功')

        // 打卡
        const checkIn = await dbOps.checkInChallenge(challengeData.challengeId)
        if (checkIn.success) {
          this.addLog(`✅ 打卡成功: ${checkIn.message}`)
        } else {
          this.addLog(`⚠️ 打卡失败: ${checkIn.message}`)
        }

        // 获取挑战列表
        const challenges = await dbOps.getChallenges()
        this.addLog(`✅ 获取到 ${challenges.length} 个挑战`)
      } else {
        this.addLog('❌ 挑战操作失败')
      }
    } catch (error) {
      this.addLog(`❌ 挑战功能测试异常: ${error.message}`)
    }
  },

  // 测试收藏功能
  async testFavorite() {
    this.addLog('开始测试收藏功能...')
    try {
      const exerciseData = {
        exerciseId: 'test_ex1',
        exerciseName: '测试动作',
        muscleGroup: '胸部',
        equipment: '哑铃'
      }
      const result = await dbOps.toggleFavorite(exerciseData)
      if (result.success) {
        this.addLog(`✅ ${result.isFavorite ? '收藏' : '取消收藏'}成功`)

        // 获取收藏列表
        const favorites = await dbOps.getFavorites()
        this.addLog(`✅ 获取到 ${favorites.length} 个收藏`)
      } else {
        this.addLog('❌ 收藏操作失败')
      }
    } catch (error) {
      this.addLog(`❌ 收藏功能测试异常: ${error.message}`)
    }
  },

  // 清空所有数据
  clearAllData() {
    wx.showModal({
      title: '清空数据',
      content: '确定要清空所有测试数据吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          this.addLog('开始清空所有数据...')
          try {
            // 获取所有数据并删除
            const workouts = await dbOps.getWorkouts(100, 0)
            for (const w of workouts) {
              await dbOps.deleteWorkout(w.workoutId)
            }
            this.addLog(`✅ 已清空 ${workouts.length} 条训练记录`)
            this.setData({ workouts: [] })
            wx.showToast({ title: '清空成功', icon: 'success' })
          } catch (error) {
            this.addLog(`❌ 清空失败: ${error.message}`)
          }
        }
      }
    })
  },

  // 读取云端日志
  async readCloudLogs() {
    this.addLog('开始读取云端日志...')
    try {
      const db = wx.cloud.database()
      const res = await db.collection('jyb_test_logs')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get()

      this.addLog(`✅ 读取到 ${res.data.length} 条云端日志`)
      res.data.forEach(item => {
        this.addLog(`📋 ${item.logEntry}`)
      })
    } catch (error) {
      this.addLog(`❌ 读取云端日志失败: ${error.message}`)
    }
  }
})
