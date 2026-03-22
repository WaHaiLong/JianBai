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
    videoMap: {} // exerciseId -> fileID
  },

  _timerInterval: null,
  _restInterval: null,

  onLoad() {
    // 恢复上次未完成的训练
    const savedWorkout = wx.getStorageSync('activeWorkout')
    if (savedWorkout) {
      this.setData({
        currentWorkout: savedWorkout.workout,
        exercises: savedWorkout.exercises,
        isWorkoutActive: true,
        startTime: savedWorkout.startTime
      })
      this._startTimer()
    }
  },

  onUnload() {
    this._clearTimers()
  },

  // ===== 训练管理 =====

  // 开始训练
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
      elapsedTime: '00:00'
    })
    this._startTimer()
    this._saveActiveWorkout()
  },

  // 完成训练
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
            videoMap: {}
          })
          wx.showToast({ title: '训练已保存', icon: 'success' })
        }
      }
    })
  },

  // 放弃训练
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
            videoMap: {}
          })
        }
      }
    })
  },

  // ===== 动作管理 =====

  // 添加动作（跳转到动作库选择）
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

  // 添加组数
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

  // 完成一组
  onToggleSet(e) {
    const { exIndex, setIndex } = e.currentTarget.dataset
    const exercises = [...this.data.exercises]
    exercises[exIndex].sets[setIndex].done = !exercises[exIndex].sets[setIndex].done
    this.setData({ exercises })

    // 自动开始休息计时
    if (exercises[exIndex].sets[setIndex].done) {
      this._startRest(90) // 默认90秒休息
    }
    this._saveActiveWorkout()
  },

  // 更新组数数据
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

  // 删除动作
  onDeleteExercise(e) {
    const { index } = e.currentTarget.dataset
    wx.showModal({
      title: '删除动作',
      content: '确定删除这个动作吗？',
      success: (res) => {
        if (res.confirm) {
          const exercises = [...this.data.exercises]
          exercises.splice(index, 1)
          this.setData({ exercises })
          this._saveActiveWorkout()
        }
      }
    })
  },

  // ===== 视频录制 =====

  // 录制动作视频
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
        this._uploadVideo(exercise.id, tempFilePath, index)
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) return
        wx.showToast({ title: '录制失败', icon: 'none' })
      }
    })
  },

  // 播放已录制视频
  onPlayVideo(e) {
    const { exerciseId } = e.currentTarget.dataset
    const fileID = this.data.videoMap[exerciseId]
    if (!fileID) return

    // 获取临时链接播放
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: (res) => {
        const url = res.fileList[0].tempFileURL
        wx.previewMedia({
          sources: [{ url, type: 'video' }]
        })
      }
    })
  },

  // 上传视频到云存储
  _uploadVideo(exerciseId, tempFilePath) {
    const cloudPath = `workouts/${exerciseId}_${Date.now()}.mp4`

    // 用 uploadTask 支持进度回调
    const uploadTask = wx.cloud.uploadFile({
      cloudPath,
      filePath: tempFilePath,
      success: (res) => {
        const videoMap = { ...this.data.videoMap }
        videoMap[exerciseId] = res.fileID
        this.setData({ videoMap, recordingExerciseIndex: -1, uploadProgress: 0 })
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
      startTime: this.data.startTime
    })
  },

  _saveWorkoutHistory() {
    const history = wx.getStorageSync('workoutHistory') || []
    const record = {
      id: this.data.currentWorkout.id,
      name: this.data.currentWorkout.name,
      date: this.data.currentWorkout.date,
      duration: this.data.elapsedTime,
      exercises: this.data.exercises.map(e => ({
        id: e.id,
        name: e.name,
        sets: e.sets,
        videoFileID: this.data.videoMap[e.id] || null
      })),
      timestamp: Date.now()
    }
    history.unshift(record)
    wx.setStorageSync('workoutHistory', history)
  }
})
