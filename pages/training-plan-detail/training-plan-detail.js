// pages/training-plan-detail/training-plan-detail.js
Page({
  data: {
    planId: '',
    plan: null,
    workouts: [],
    isLoading: true
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ planId: id })
      this.loadPlanDetail()
      this.loadPlanWorkouts()
    }
  },

  // 加载计划详情
  async loadPlanDetail() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('jyb_training_plans')
        .doc(this.data.planId)
        .get()
      
      this.setData({
        plan: res.data
      })
    } catch (error) {
      console.error('加载计划详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 加载计划关联的训练记录
  async loadPlanWorkouts() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('jyb_workouts')
        .where({ planId: this.data.planId })
        .orderBy('timestamp', 'desc')
        .get()
      
      this.setData({
        workouts: res.data,
        isLoading: false
      })
    } catch (error) {
      console.error('加载训练记录失败:', error)
      this.setData({ isLoading: false })
    }
  },

  // 开始训练
  startTraining() {
    wx.navigateTo({
      url: `/pages/training/training?planId=${this.data.planId}`
    })
  },

  // 标记完成一天
  async completeDay() {
    const { plan } = this.data
    
    if (plan.completedDays >= plan.totalDays) {
      wx.showToast({
        title: '计划已完成',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '更新中...' })
      const db = wx.cloud.database()
      
      const newCompletedDays = plan.completedDays + 1
      const newProgress = Math.round((newCompletedDays / plan.totalDays) * 100)
      
      await db.collection('jyb_training_plans')
        .doc(this.data.planId)
        .update({
          data: {
            completedDays: newCompletedDays,
            progress: newProgress,
            updateTime: Date.now()
          }
        })
      
      wx.hideLoading()
      wx.showToast({
        title: '打卡成功！',
        icon: 'success'
      })
      
      // 重新加载计划详情
      this.loadPlanDetail()
      
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '打卡失败',
        icon: 'none'
      })
      console.error('打卡失败:', error)
    }
  },

  // 查看训练详情
  viewWorkout(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/history/detail?id=${id}`
    })
  },

  // 分享计划
  onShareAppMessage() {
    const { plan } = this.data
    return {
      title: `${plan.name} - 我的训练计划`,
      path: `/pages/training-plan-detail/training-plan-detail?id=${this.data.planId}`
    }
  }
})
