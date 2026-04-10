const dbOps = require('../../utils/db-operations')

Page({
  data: {
    currentWorkout: null,
    exercises: [],
    isWorkoutActive: false,
    startTime: null,
    elapsedTime: '00:00',
    restTimer: null,
    restTimeLeft: 0,
    isResting: false,
    // 录像相关
    recordingExerciseIndex: -1,
    uploadProgress: 0,
    // videoMap: exerciseId -> [{fileID, cloudPath, timestamp}]
    videoMap: {},
    expandVideoIndex: -1
  },

  // 迁移旧格式 videoMap
  _migrateVideoMap(videoMap) {
    if (!videoMap || typeof videoMap !== 'object') return {}
    let migrated = false
    const map = {}
    for (const key of Object.keys(videoMap)) {
      const val = videoMap[key]
      if (typeof val === 'string' && val.length > 0) {
        map[key] = [{ fileID: val, cloudPath: '', timestamp: Date.now() }]
        migrated = true
      } else if (Array.isArray(val)) {
        map[key] = val
      } else {
        map[key] = []
      }
    }
    return { map, migrated }
  },

  _timerInterval: null,
  _restInterval: null,

  onLoad() {
    const savedWorkout = wx.getStorageSync('activeWorkout')
    if (savedWorkout) {
      // 迁移旧格式 videoMap
      const { map: videoMap, migrated } = this._migrateVideoMap(savedWorkout.videoMap)
      if (migrated) {
        savedWorkout.videoMap = videoMap
        wx.setStorageSync('activeWorkout', savedWorkout)
      }
      this.setData({
        currentWorkout: savedWorkout.workout,
        exercises: savedWorkout.exercises,
        isWorkoutActive: true,
        startTime: savedWorkout.startTime,
        videoMap
      })
      this._startTimer()
    }
  },

  onUnload() {
    this._clearTimers()
  },

  onHide() {
    // 页面隐藏时暂停计时器，避免后台消耗性能
    this._clearTimers()
  },

  onShow() {
    // 页面显示时恢复计时器
    if (this.data.isWorkoutActive) {
      this._startTimer()
    }
  },

  // ===== 训练管理 =====

  onStartWorkout() {
    const startTime = Date.now()
    const workout = {
      id: `workout_${startTime}`,
      name: '今日训练',
      date: new Date().toLocaleDateString('zh-CN'),
      exercises: []
    }
    this.setData({
      currentWorkout: workout,
      exercises: [],
      isWorkoutActive: true,
      startTime,
      elapsedTime: '00:00',
      videoMap: {}
    })
    this._startTimer()
    this._saveActiveWorkout()
  },

  onFinishWorkout() {
    wx.showModal({
      title: '完成训练',
      content: `本次训练时长 ${this.data.elapsedTime}，确认完成吗？`,
      confirmText: '完成',
      success: (res) => {
        if (res.confirm) {
          this._saveWorkoutHistory()
          this._clearTimers()
          wx.removeStorageSync('activeWorkout')
          this.setData({
            currentWorkout: null,
            exercises: [],
            isWorkoutActive: false,
            startTime: null,
            elapsedTime: '00:00',
            videoMap: {},
            expandVideoIndex: -1
          })
          wx.showToast({ title: '训练已保存', icon: 'success' })
        }
      }
    })
  },

  onCancelWorkout() {
    wx.showModal({
      title: '放弃训练',
      content: '确定要放弃本次训练吗？数据将不会保存。',
      confirmText: '放弃',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          this._clearTimers()
          wx.removeStorageSync('activeWorkout')
          this.setData({
            currentWorkout: null,
            exercises: [],
            isWorkoutActive: false,
            startTime: null,
            elapsedTime: '00:00',
            videoMap: {},
            expandVideoIndex: -1
          })
        }
      }
    })
  },

  // ===== 动作管理 =====

  onAddExercise() {
    wx.navigateTo({
      url: '/pages/movements/movements?fromTraining=1',
      events: {
        selectExercise: (exercise) => {
          this._addExercise(exercise)
        }
      }
    })
  },

  _addExercise(exercise) {
    const exercises = [...this.data.exercises]
    exercises.push({
      ...exercise,
      sets: [{ weight: '', reps: '', done: false }],
      notes: ''
    })
    this.setData({ exercises })
    this._saveActiveWorkout()
  },

  onAddSet(e) {
    const { index } = e.currentTarget.dataset
    const exercises = [...this.data.exercises]
    const lastSet = exercises[index].sets[exercises[index].sets.length - 1]
    exercises[index].sets.push({
      weight: lastSet.weight,
      reps: lastSet.reps,
      done: false
    })
    this.setData({ exercises })
    this._saveActiveWorkout()
  },

  onToggleSet(e) {
    const { exIndex, setIndex } = e.currentTarget.dataset
    const exercises = [...this.data.exercises]
    exercises[exIndex].sets[setIndex].done = !exercises[exIndex].sets[setIndex].done
    this.setData({ exercises })
    if (exercises[exIndex].sets[setIndex].done) {
      this._startRest(90)
    }
    this._saveActiveWorkout()
  },

  onWeightInput(e) {
    const { exIndex, setIndex } = e.currentTarget.dataset
    const exercises = [...this.data.exercises]
    exercises[exIndex].sets[setIndex].weight = e.detail.value
    this.setData({ exercises })
    this._saveActiveWorkout()
  },

  onRepsInput(e) {
    const { exIndex, setIndex } = e.currentTarget.dataset
    const exercises = [...this.data.exercises]
    exercises[exIndex].sets[setIndex].reps = e.detail.value
    this.setData({ exercises })
    this._saveActiveWorkout()
  },

  onDeleteExercise(e) {
    const { index } = e.currentTarget.dataset
    wx.showModal({
      title: '删除动作',
      content: '确定删除这个动作吗？',
      success: (res) => {
        if (res.confirm) {
          const exercises = [...this.data.exercises]
          const deletedExercise = exercises.splice(index, 1)[0]
          // 同时清理 videoMap 中对应的视频记录，避免孤儿数据
          const videoMap = { ...this.data.videoMap }
          delete videoMap[deletedExercise.id]
          this.setData({ exercises, videoMap })
          this._saveActiveWorkout()
        }
      }
    })
  },

  // ===== 视频录制 =====

  onRecordVideo(e) {
    const { index } = e.currentTarget.dataset
    const exercise = this.data.exercises[index]

    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['camera', 'album'],
      camera: 'back',
      maxDuration: 60,
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ recordingExerciseIndex: index })
        this._uploadVideo(exercise.id, tempFilePath)
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) {
          this.setData({ recordingExerciseIndex: -1 })
          return
        }
        this.setData({ recordingExerciseIndex: -1 })
        wx.showToast({ title: '录制失败', icon: 'none' })
      }
    })
  },

  // 展开/收起视频列表
  onToggleVideoList(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      expandVideoIndex: this.data.expandVideoIndex === index ? -1 : index
    })
  },

  // 播放列表中的某个视频
  onPlayVideo(e) {
    const { fileID } = e.currentTarget.dataset
    if (!fileID) return

    wx.showLoading({ title: '加载中...' })
    wx.cloud.getTempFileURL({
      fileList: [fileID],
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
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '视频加载失败', icon: 'none' })
      }
    })
  },

  // 上传视频到云存储
  _uploadVideo(exerciseId, tempFilePath) {
    const cloudPath = `workouts/${exerciseId}_${Date.now()}.mp4`

    const uploadTask = wx.cloud.uploadFile({
      cloudPath,
      filePath: tempFilePath,
      success: (res) => {
        const videoMap = { ...this.data.videoMap }
        const now = Date.now()
        const newVideo = { fileID: res.fileID, cloudPath, timestamp: now }
        // 追加到数组（最新的在前面）
        const existing = videoMap[exerciseId] || []
        videoMap[exerciseId] = [newVideo, ...existing]

        this.setData({
          videoMap,
          recordingExerciseIndex: -1,
          uploadProgress: 0,
          expandVideoIndex: -1 // 重置展开状态
        })
        wx.showToast({ title: '视频已保存', icon: 'success' })
        this._saveActiveWorkout()
      },
      fail: (err) => {
        console.error('视频上传失败', err)
        this.setData({ recordingExerciseIndex: -1, uploadProgress: 0 })
        wx.showToast({ title: '上传失败，请重试', icon: 'none' })
      }
    })

    uploadTask.onProgressUpdate(({ progress }) => {
      this.setData({ uploadProgress: progress })
      wx.showLoading({ title: `上传中 ${progress}%` })
      if (progress >= 100) wx.hideLoading()
    })
  },

  // ===== 休息计时 =====

  _startRest(seconds) {
    this._clearRestTimer()
    this.setData({ isResting: true, restTimeLeft: seconds })
    this._restInterval = setInterval(() => {
      const left = this.data.restTimeLeft - 1
      if (left <= 0) {
        this._clearRestTimer()
        this.setData({ isResting: false, restTimeLeft: 0 })
        wx.vibrateShort({ type: 'heavy' })
        wx.showToast({ title: '休息结束！', icon: 'none' })
        return
      }
      this.setData({ restTimeLeft: left })
    }, 1000)
  },

  onSkipRest() {
    this._clearRestTimer()
    this.setData({ isResting: false, restTimeLeft: 0 })
  },

  _clearRestTimer() {
    if (this._restInterval) {
      clearInterval(this._restInterval)
      this._restInterval = null
    }
  },

  // ===== 训练计时 =====

  _startTimer() {
    this._clearTimers()
    this._timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.data.startTime) / 1000)
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0')
      const seconds = (elapsed % 60).toString().padStart(2, '0')
      this.setData({ elapsedTime: `${minutes}:${seconds}` })
    }, 1000)
  },

  _clearTimers() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
    this._clearRestTimer()
  },

  // ===== 数据持久化 =====

  _saveActiveWorkout() {
    wx.setStorageSync('activeWorkout', {
      workout: this.data.currentWorkout,
      exercises: this.data.exercises,
      startTime: this.data.startTime,
      videoMap: this.data.videoMap
    })
  },

  async _saveWorkoutHistory() {
    // 计算总训练量
    let totalVolume = 0
    this.data.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.done) {
          totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)
        }
      })
    })

    // 准备训练数据
    const record = {
      workoutId: this.data.currentWorkout.id,
      name: this.data.currentWorkout.name,
      date: this.data.currentWorkout.date,
      duration: this.data.elapsedTime,
      totalVolume,
      exercises: this.data.exercises.map(e => ({
        id: e.id,
        name: e.name,
        muscleGroup: e.muscleGroup,
        equipment: e.equipment,
        sets: e.sets,
        // 保存视频列表（不含 tempFileURL，仅 fileID）
        videos: (this.data.videoMap[e.id] || []).map(v => ({
          fileID: v.fileID,
          cloudPath: v.cloudPath,
          timestamp: v.timestamp
        }))
      })),
      timestamp: Date.now()
    }

    // 保存到云数据库
    const saved = await dbOps.saveWorkout(record)

    if (saved) {
      wx.showToast({ title: '训练已保存到云端', icon: 'success' })
    } else {
      wx.showToast({ title: '保存到云端失败，已保存到本地', icon: 'none' })
      // 降级到本地存储
      const history = wx.getStorageSync('workoutHistory') || []
      history.unshift(record)
      wx.setStorageSync('workoutHistory', history)
    }
  }
})
