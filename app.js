App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'prod-jianbai',
        traceUser: true
      })
    }

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  globalData: {
    userInfo: null,
    // 当前训练计划
    currentWorkout: null
  }
})
