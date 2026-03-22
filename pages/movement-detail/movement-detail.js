const { EXERCISES } = require('../../data/exercises')
const { getExerciseVideos, addExerciseVideo, removeExerciseVideo } = require('../../utils/db')

Page({
  data: {
    exercise: null,
    videos: [],
    currentVideoSrc: '',
    _recordId: ''
  },

  onLoad(options) {
    const { id } = options
    const exercise = EXERCISES.find(e => e.id === id)
    if (exercise) {
      this.setData({ exercise })
      wx.setNavigationBarTitle({ title: exercise.name })
      this._loadVideos(id)
    }
  },

  // 从云数据库加载视频列表
  _loadVideos(exerciseId) {
    wx.showLoading({ title: '加载中...' })
    getExerciseVideos(exerciseId).then(res => {
      wx.hideLoading()
      if (res.data.length > 0) {
        const record = res.data[0]
        const videos = record.videos || []
        this.setData({ _recordId: record._id })

        // 批量获取临时链接
        if (videos.length > 0) {
          this._loadTempURLs(videos)
        }
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('加载视频失败', err)
    })
  },

  // 批量获取临时链接
  _loadTempURLs(videos) {
    const fileIDs = videos.map(v => v.fileID)
    wx.cloud.getTempFileURL({
      fileList: fileIDs,
      success: (res) => {
        const urlMap = {}
        res.fileList.forEach(f => {
          if (f.code === 'SUCCESS') {
            urlMap[f.fileID] = f.tempFileURL
          }
        })
        const videosWithUrl = videos.map(v => ({
          ...v,
          tempFileURL: urlMap[v.fileID] || ''
        }))
        this.setData({ videos: videosWithUrl })
      },
      fail: () => {
        this.setData({ videos })
      }
    })
  },

  // 播放视频讲解
  onPlayVideo() {
    const { exercise } = this.data
    if (!exercise.hasTutorial) {
      wx.showToast({ title: '暂无视频讲解', icon: 'none' })
      return
    }
    wx.showToast({ title: '视频讲解加载中', icon: 'loading' })
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

  // 拍摄/选择视频
  onRecordVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['camera', 'album'],
      camera: 'back',
      maxDuration: 60,
      success: (res) => {
        const tempFile = res.tempFiles[0]
        this._uploadVideo(tempFile.tempFilePath)
      },
      fail: (err) => {
        if (err && err.errMsg && err.errMsg.includes('cancel')) return
        wx.showToast({ title: '无法调用相机', icon: 'none' })
      }
    })
  },

  // 播放列表中的某个视频
  onPlayListItem(e) {
    const { index } = e.currentTarget.dataset
    const video = this.data.videos[index]
    if (!video || !video.tempFileURL) {
      wx.showToast({ title: '视频加载中', icon: 'none' })
      return
    }
    this.setData({ currentVideoSrc: video.tempFileURL })
  },

  // 关闭视频播放器
  onClosePlayer() {
    this.setData({ currentVideoSrc: '' })
  },

  // 删除某个视频
  onDeleteVideo(e) {
    const { index } = e.currentTarget.dataset
    const video = this.data.videos[index]
    wx.showModal({
      title: '删除视频',
      content: '确定删除这条视频吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          // 从云存储删除
          wx.cloud.deleteFile({
            fileList: [video.fileID],
            fail: (err) => console.warn('云存储删除失败', err)
          })
          // 从数据库删除
          removeExerciseVideo(this.data.exercise.id, video.fileID).then(() => {
            const videos = [...this.data.videos]
            videos.splice(index, 1)
            this.setData({ videos })
            wx.showToast({ title: '已删除', icon: 'success' })
          }).catch(err => {
            console.error('数据库删除失败', err)
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  // 上传视频到云存储 + 保存记录到云数据库
  _uploadVideo(tempFilePath) {
    const { exercise } = this.data
    wx.showLoading({ title: '上传中...' })
    const cloudPath = `videos/${exercise.id}_${Date.now()}.mp4`
    wx.cloud.uploadFile({
      cloudPath,
      filePath: tempFilePath,
      success: (res) => {
        const now = Date.now()
        const newVideo = {
          fileID: res.fileID,
          cloudPath,
          timestamp: now,
          tempFileURL: ''
        }

        // 获取临时链接
        wx.cloud.getTempFileURL({
          fileList: [res.fileID],
          success: (urlRes) => {
            if (urlRes.fileList[0] && urlRes.fileList[0].tempFileURL) {
              newVideo.tempFileURL = urlRes.fileList[0].tempFileURL
            }
          }
        })

        // 添加到列表头部
        const videos = [newVideo, ...this.data.videos]
        this.setData({ videos })

        // 保存到云数据库
        addExerciseVideo(exercise.id, {
          fileID: res.fileID,
          cloudPath,
          timestamp: now
        }).then(() => {
          wx.hideLoading()
          wx.showToast({ title: '上传成功', icon: 'success' })
        }).catch(err => {
          wx.hideLoading()
          console.error('保存视频记录失败', err)
          wx.showToast({ title: '保存记录失败', icon: 'none' })
        })
      },
      fail: (err) => {
        console.error('视频上传失败', err)
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
  }
})
