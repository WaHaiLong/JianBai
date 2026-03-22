Page({
  data: {
    userInfo: null,
    stats: {
      totalWorkouts: 0,
      totalDuration: '0h',
      totalVolume: '0kg'
    }
  },

  onShow() {
    this._loadUserInfo()
    this._calcStats()
  },

  _loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })
  },

  _calcStats() {
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
        totalVolume: totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : '0kg'
      }
    })
  },

  // 微信授权登录
  onLogin() {
    wx.getUserProfile({
      desc: '用于展示用户信息',
      success: (res) => {
        const userInfo = res.userInfo
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
        wx.showToast({ title: '登录成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '登录取消', icon: 'none' })
      }
    })
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
        }
      }
    })
  },

  onSettingsTap() {
    wx.showToast({ title: '设置功能开发中', icon: 'none' })
  },

  onFeedbackTap() {
    wx.showToast({ title: '意见反馈功能开发中', icon: 'none' })
  },

  onAboutTap() {
    wx.showModal({
      title: '关于健百',
      content: '健百 - 你的智能健身伙伴\n版本: 1.0.0\n\n记录每一次训练，见证自己的成长。',
      showCancel: false
    })
  }
})
