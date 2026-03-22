const dbOps = require('../../utils/db-operations')
const dataMigration = require('../../utils/data-migration')

Page({
  data: {
    userInfo: null,
    stats: {
      totalWorkouts: 0,
      totalDuration: '0h',
      totalVolume: '0kg',
      activeChallenges: 0
    },
    loading: false
  },

  async onShow() {
    await this._loadUserInfo()
    await this._calcStats()
  },

  async _loadUserInfo() {
    // 先从本地读取
    const localUserInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo: localUserInfo })

    // 从云数据库同步用户信息
    if (wx.cloud) {
      const cloudUserInfo = await dbOps.getUser()
      if (cloudUserInfo) {
        this.setData({ userInfo: cloudUserInfo })
        wx.setStorageSync('userInfo', cloudUserInfo)
      }
    }
  },

  async _calcStats() {
    this.setData({ loading: true })

    try {
      // 从云数据库获取训练记录
      const workouts = await dbOps.getWorkouts(1000)
      
      // 从云数据库获取挑战记录
      const challenges = await dbOps.getChallenges()

      let totalVolume = 0
      let completedWorkouts = 0

      workouts.forEach(record => {
        if (record.totalVolume) {
          totalVolume += record.totalVolume
        }
        completedWorkouts++
      })

      // 统计活跃挑战数（未完成的）
      const activeChallenges = challenges.filter(c => !c.isCompleted).length

      this.setData({
        stats: {
          totalWorkouts: completedWorkouts,
          totalVolume: totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : '0kg',
          activeChallenges
        },
        loading: false
      })
    } catch (error) {
      console.error('统计数据加载失败', error)
      
      // 降级到本地存储
      const history = wx.getStorageSync('workoutHistory') || []
      let totalVolume = 0
      history.forEach(record => {
        record.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.done) {
              totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)
            }
          })
        })
      })

      this.setData({
        stats: {
          totalWorkouts: history.length,
          totalVolume: totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : '0kg',
          activeChallenges: 0
        },
        loading: false
      })
    }
  },

  // 微信授权登录
  async onLogin() {
    wx.showLoading({ title: '登录中...' })
    
    try {
      const res = await wx.getUserProfile({
        desc: '用于展示用户信息'
      })
      
      const userInfo = res.userInfo
      
      // 保存到云数据库
      const saved = await dbOps.upsertUser(userInfo)
      
      if (saved) {
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
        wx.showToast({ title: '登录成功', icon: 'success' })
        // 刷新统计数据
        await this._calcStats()
      } else {
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
      }
    } catch (error) {
      console.error('登录失败', error)
      wx.showToast({ title: '登录取消', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          this.setData({ userInfo: null })
          // 清空统计数据
          this.setData({
            stats: {
              totalWorkouts: 0,
              totalVolume: '0kg',
              activeChallenges: 0
            }
          })
        }
      }
    })
  },

  // 跳转到数据库测试页面
  onTestDbTap() {
    wx.navigateTo({
      url: '/pages/test-db/test-db'
    })
  },

  onSettingsTap() {
    wx.showActionSheet({
      itemList: ['数据迁移到云端', '清除本地数据', '设置（开发中）'],
      success: async (res) => {
        if (res.tapIndex === 0) {
          // 数据迁移
          const checkResult = dataMigration.checkNeedMigration()
          if (checkResult.need) {
            wx.showModal({
              title: '数据迁移',
              content: `检测到本地有数据：\n训练记录 ${checkResult.localWorkoutsCount}条\n挑战记录 ${checkResult.localChallengesCount}条\n\n是否迁移到云数据库？`,
              success: (confirmRes) => {
                if (confirmRes.confirm) {
                  dataMigration.migrateAll()
                }
              }
            })
          } else {
            wx.showToast({ title: '没有需要迁移的数据', icon: 'none' })
          }
        } else if (res.tapIndex === 1) {
          // 清除本地数据
          dataMigration.clearLocalData()
        } else {
          wx.showToast({ title: '设置功能开发中', icon: 'none' })
        }
      }
    })
  },

  onFeedbackTap() {
    wx.showToast({ title: '意见反馈功能开发中', icon: 'none' })
  },

  onAboutTap() {
    wx.showModal({
      title: '关于健百',
      content: '健百 - 你的智能健身伙伴\n版本: 2.0.0\n\n记录每一次训练，见证自己的成长。\n数据已同步至云端。',
      showCancel: false
    })
  }
})
