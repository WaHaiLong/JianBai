// 云数据库工具模块
const db = wx.cloud.database()

// ===== exercise_videos 集合 =====
// 结构: { _id, _openid, exerciseId, videos: [{fileID, cloudPath, timestamp}], updatedAt }

// 获取某个动作的视频列表（仅当前用户）
function getExerciseVideos(exerciseId) {
  return db.collection('exercise_videos')
    .where({ exerciseId, _openid: '{openid}' })
    .orderBy('updatedAt', 'desc')
    .limit(1)
    .get()
}

// 添加视频记录（追加到 videos 数组，仅操作当前用户数据）
function addExerciseVideo(exerciseId, video) {
  return db.collection('exercise_videos').where({ exerciseId, _openid: '{openid}' }).get().then(res => {
    if (res.data.length > 0) {
      // 已有记录，追加
      const existing = res.data[0]
      const videos = [video, ...(existing.videos || [])]
      return db.collection('exercise_videos').doc(existing._id).update({
        data: { videos, updatedAt: db.serverDate() }
      })
    } else {
      // 新建记录
      return db.collection('exercise_videos').add({
        data: {
          exerciseId,
          videos: [video],
          updatedAt: db.serverDate()
        }
      })
    }
  })
}

// 删除某个动作的某个视频（仅操作当前用户数据）
function removeExerciseVideo(exerciseId, fileID) {
  return db.collection('exercise_videos').where({ exerciseId, _openid: '{openid}' }).get().then(res => {
    if (res.data.length === 0) return
    const existing = res.data[0]
    const videos = (existing.videos || []).filter(v => v.fileID !== fileID)
    if (videos.length === 0) {
      // 视频列表为空，删除整条记录
      return db.collection('exercise_videos').doc(existing._id).remove()
    }
    return db.collection('exercise_videos').doc(existing._id).update({
      data: { videos, updatedAt: db.serverDate() }
    })
  })
}

// ===== workout_history 集合 =====
// 结构: { _id, _openid, workoutId, name, date, duration, exercises: [...], timestamp }

// 保存训练历史
function saveWorkoutHistory(record) {
  return db.collection('workout_history').add({ data: record })
}

// 获取训练历史列表（仅当前用户）
function getWorkoutHistory(limit = 20) {
  return db.collection('workout_history')
    .where({ _openid: '{openid}' })
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get()
}

// 删除训练历史（仅删除当前用户的记录）
function deleteWorkoutHistory(id) {
  return db.collection('workout_history').where({ _openid: '{openid}' }).doc(id).remove()
}

// 加载更多训练历史（仅当前用户）
function loadMoreHistory(lastTimestamp, limit = 20) {
  const _ = db.command
  return db.collection('workout_history')
    .where({ _openid: '{openid}', timestamp: _.lt(lastTimestamp) })
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get()
}

module.exports = {
  getExerciseVideos,
  addExerciseVideo,
  removeExerciseVideo,
  saveWorkoutHistory,
  getWorkoutHistory,
  deleteWorkoutHistory,
  loadMoreHistory
}
