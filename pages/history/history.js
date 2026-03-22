const dbOps = require('../../utils/db-operations')

Page({
  data: {
    historyList: [],
    selectedRecord: null,
    showDetail: false,
    loading: false,
    loadingMore: false,
    hasMore: true,
    limit: 20,
    skip: 0
  },

  async onLoad() {
    await this._loadHistory()
  },

  async onShow() {
    // 每次显示都重新加载第一页
    this.setData({ skip: 0, hasMore: true })
    await this._loadHistory()
  },

  async _loadHistory() {
    if (this.data.loadingMore || !this.data.hasMore) return

    this.setData({ loading: this.data.skip === 0, loadingMore: this.data.skip > 0 })

    try {
      // 从云数据库加载训练记录
      const workouts = await dbOps.getWorkouts(this.data.limit, this.data.skip)

      if (this.data.skip === 0) {
        // 第一页，直接替换
        this.setData({
          historyList: workouts,
          hasMore: workouts.length >= this.data.limit
        })
      } else {
        // 加载更多，追加
        this.setData({
          historyList: [...this.data.historyList, ...workouts],
          hasMore: workouts.length >= this.data.limit
        })
      }
    } catch (error) {
      console.error('加载历史记录失败', error)
      
      // 降级到本地存储
      const history = wx.getStorageSync('workoutHistory') || []
      // 迁移旧格式：videoFileID (string) -> videos (array)
      let migrated = false
      history.forEach(record => {
        record.exercises.forEach(ex => {
          if (ex.videoFileID && (!ex.videos || ex.videos.length === 0)) {
            ex.videos = [{ fileID: ex.videoFileID, cloudPath: '', timestamp: record.timestamp }]
            migrated = true
          }
        })
      })
      if (migrated) {
        wx.setStorageSync('workoutHistory', history)
      }
      this.setData({ historyList: history })
    } finally {
      this.setData({ loading: false, loadingMore: false })
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    this.setData({ skip: 0, hasMore: true })
    await this._loadHistory()
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  async onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.setData({ skip: this.data.skip + this.data.limit })
      await this._loadHistory()
    }
  },

  onRecordTap(e) {
    const { index } = e.currentTarget.dataset
    const record = this.data.historyList[index]
    this.setData({ selectedRecord: record, showDetail: true })
  },

  onCloseDetail() {
    this.setData({ showDetail: false, selectedRecord: null })
  },

  async onDeleteRecord(e) {
    const { index } = e.currentTarget.dataset
    const record = this.data.historyList[index]
    
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条训练记录吗？',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          // 从云数据库删除
          const deleted = await dbOps.deleteWorkout(record.workoutId)
          
          if (deleted) {
            wx.showToast({ title: '删除成功', icon: 'success' })
            // 重新加载列表
            this.setData({ skip: 0, hasMore: true })
            await this._loadHistory()
          } else {
            // 降级到本地删除
            const history = [...this.data.historyList]
            history.splice(index, 1)
            this.setData({ historyList: history })
            wx.showToast({ title: '本地删除成功', icon: 'success' })
          }
        }
      }
    })
  },

  // 播放记录中的视频
  onPlayRecordVideo(e) {
    const { fileId } = e.currentTarget.dataset
    if (!fileId) return
    wx.showLoading({ title: '加载中...' })
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: (res) => {
        wx.hideLoading()
        if (res.fileList[0] && res.fileList[0].tempFileURL) {
          wx.previewMedia({
            sources: [{ url: res.fileList[0].tempFileURL, type: 'video' }]
          })
        } else {
          wx.showToast({ title: '视频不存在', icon: 'none' })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('获取视频链接失败', err)
        wx.showToast({ title: '视频加载失败', icon: 'none' })
      }
    })
  },

  // 计算总训练量
  getTotalVolume(exercises) {
    let total = 0
    exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.done) {
          total += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)
        }
      })
    })
    return total
  }
})
