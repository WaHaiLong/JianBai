// pages/training-plan/training-plan.js
Page({
  data: {
    plans: [],
    currentPlan: null,
    showAddModal: false,
    formData: {
      name: '',
      description: '',
      duration: 30,
      frequency: 3,
      difficulty: 'medium'
    },
    difficultyOptions: [
      { value: 'easy', label: '初级' },
      { value: 'medium', label: '中级' },
      { value: 'hard', label: '高级' }
    ]
  },

  onLoad() {
    this.loadPlans()
  },

  onShow() {
    this.loadPlans()
  },

  // 加载训练计划
  async loadPlans() {
    try {
      wx.showLoading({ title: '加载中...' })
      const openid = this._getUserOpenId()
      const db = wx.cloud.database()
      
      const res = await db.collection('jyb_training_plans')
        .where({ _openid: openid })
        .orderBy('createTime', 'desc')
        .get()
      
      this.setData({
        plans: res.data
      })
      
      // 设置当前计划
      if (res.data.length > 0) {
        const currentPlan = res.data.find(p => p.status === 'active') || res.data[0]
        this.setData({ currentPlan })
      }
      
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      console.error('加载训练计划失败:', error)
    }
  },

  // 显示添加计划弹窗
  showAddPlan() {
    this.setData({
      showAddModal: true,
      formData: {
        name: '',
        description: '',
        duration: 30,
        frequency: 3,
        difficulty: 'medium'
      }
    })
  },

  // 隐藏添加计划弹窗
  hideAddModal() {
    this.setData({
      showAddModal: false
    })
  },

  // 表单输入处理
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    })
  },

  onDescriptionInput(e) {
    this.setData({
      'formData.description': e.detail.value
    })
  },

  onDurationChange(e) {
    this.setData({
      'formData.duration': parseInt(e.detail.value)
    })
  },

  onFrequencyChange(e) {
    this.setData({
      'formData.frequency': parseInt(e.detail.value)
    })
  },

  onDifficultyChange(e) {
    const difficulty = this.data.difficultyOptions[e.detail.value].value
    this.setData({
      'formData.difficulty': difficulty
    })
  },

  // 创建训练计划
  async createPlan() {
    const { name, description, duration, frequency, difficulty } = this.data.formData
    
    if (!name) {
      wx.showToast({
        title: '请输入计划名称',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '创建中...' })
      const openid = this._getUserOpenId()
      const db = wx.cloud.database()
      
      const planData = {
        name,
        description,
        duration,
        frequency,
        difficulty,
        status: 'active',
        progress: 0,
        totalDays: duration,
        completedDays: 0,
        createTime: Date.now(),
        updateTime: Date.now()
      }
      
      await db.collection('jyb_training_plans').add({
        data: planData
      })
      
      wx.hideLoading()
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      
      this.hideAddModal()
      this.loadPlans()
      
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      })
      console.error('创建训练计划失败:', error)
    }
  },

  // 删除训练计划
  async deletePlan(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个训练计划吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' })
            const db = wx.cloud.database()
            
            await db.collection('jyb_training_plans').doc(id).remove()
            
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            
            this.loadPlans()
          } catch (error) {
            wx.hideLoading()
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
            console.error('删除训练计划失败:', error)
          }
        }
      }
    })
  },

  // 激活计划
  async activatePlan(e) {
    const { id } = e.currentTarget.dataset
    
    try {
      wx.showLoading({ title: '激活中...' })
      const db = wx.cloud.database()
      
      // 将其他计划设为非激活状态
      await db.collection('jyb_training_plans')
        .where({ status: 'active' })
        .update({
          data: { status: 'inactive' }
        })
      
      // 激活选中的计划
      await db.collection('jyb_training_plans').doc(id).update({
        data: { status: 'active' }
      })
      
      wx.hideLoading()
      wx.showToast({
        title: '激活成功',
        icon: 'success'
      })
      
      this.loadPlans()
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '激活失败',
        icon: 'none'
      })
      console.error('激活训练计划失败:', error)
    }
  },

  // 跳转到计划详情
  goToPlanDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/training-plan-detail/training-plan-detail?id=${id}`
    })
  },

  // 获取用户 OPENID
  _getUserOpenId() {
    const app = getApp()
    return app.globalData.openid || app.globalData.OPENID || ''
  }
})
