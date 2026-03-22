Page({
  data: {
    historyList: [],
    selectedRecord: null,
    showDetail: false
  },

  onShow() {
    this._loadHistory()
  },

  _loadHistory() {
    const history = wx.getStorageSync('workoutHistory') || []
    this.setData({ historyList: history })
  },

  onRecordTap(e) {
    const { index } = e.currentTarget.dataset
    const record = this.data.historyList[index]
    this.setData({ selectedRecord: record, showDetail: true })
  },

  onCloseDetail() {
    this.setData({ showDetail: false, selectedRecord: null })
  },

  onDeleteRecord(e) {
    const { index } = e.currentTarget.dataset
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条训练记录吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          const history = [...this.data.historyList]
          history.splice(index, 1)
          wx.setStorageSync('workoutHistory', history)
          this.setData({ historyList: history })
        }
      }
    })
  },

  // 播放记录中的视频
  onPlayRecordVideo(e) {
    const { fileId } = e.currentTarget.dataset
    if (!fileId) return
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: (res) => {
        const url = res.fileList[0].tempFileURL
        wx.previewMedia({
          sources: [{ url, type: 'video' }]
        })
      },
      fail: () => {
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
