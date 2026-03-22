const { EXERCISES } = require('../../data/exercises')

Page({
  data: {
    exercise: null,
    videoSrc: '',
    isVideoPlaying: false
  },

  onLoad(options) {
    const { id } = options
    const exercise = EXERCISES.find(e => e.id === id)
    if (exercise) {
      this.setData({ exercise })
      wx.setNavigationBarTitle({ title: exercise.name })
    }
  },

  // 播放视频讲解（云存储获取）
  onPlayVideo() {
    const { exercise } = this.data
    if (!exercise.hasTutorial) {
      wx.showToast({ title: '暂无视频讲解', icon: 'none' })
      return
    }
    // 实际场景从云存储获取视频地址
    wx.showToast({ title: '视频讲解加载中', icon: 'loading' })
    // 模拟：实际应从云数据库获取视频URL
    // wx.cloud.callFunction({
    //   name: 'getExerciseVideo',
    //   data: { exerciseId: exercise.id }
    // }).then(res => { ... })
  },

  // 添加到训练计划
  onAddToWorkout() {
    wx.showActionSheet({
      itemList: ['添加到当前训练', '新建训练并添加'],
      success: (res) => {
        if (res.tapIndex === 0) {
          const app = getApp()
          if (!app.globalData.currentWorkout) {
            wx.showToast({ title: '请先创建训练计划', icon: 'none' })
            return
          }
          wx.showToast({ title: '已添加到训练', icon: 'success' })
          wx.navigateBack()
        } else {
          wx.showToast({ title: '请到训练页面创建', icon: 'none' })
        }
      }
    })
  },

  // 拍摄动作视频（微信原生相机）
  onRecordVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['camera'],
      camera: 'back',
      maxDuration: 60,
      success: (res) => {
        const tempFile = res.tempFiles[0]
        this.uploadVideo(tempFile.tempFilePath)
      },
      fail: (err) => {
        if (err.errMsg.includes('cancel')) return
        wx.showToast({ title: '无法调用相机', icon: 'none' })
      }
    })
  },

  // 上传视频到云存储
  uploadVideo(tempFilePath) {
    const { exercise } = this.data
    wx.showLoading({ title: '上传中...' })
    const cloudPath = `videos/${exercise.id}_${Date.now()}.mp4`
    wx.cloud.uploadFile({
      cloudPath,
      filePath: tempFilePath,
      success: (res) => {
        wx.hideLoading()
        wx.showToast({ title: '上传成功', icon: 'success' })
        this.setData({ videoSrc: res.fileID })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
  }
})
