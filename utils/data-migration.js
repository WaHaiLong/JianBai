/**
 * 数据迁移工具
 * 将本地存储的数据迁移到云数据库
 */

const dbOps = require('./db-operations')

class DataMigration {
  constructor() {
    this.isMigrating = false
  }

  /**
   * 执行完整的数据迁移
   */
  async migrateAll() {
    if (this.isMigrating) {
      return { success: false, message: '正在迁移中，请勿重复操作' }
    }

    this.isMigrating = true
    wx.showLoading({ title: '数据迁移中...' })

    try {
      // 1. 迁移用户信息
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        const userSaved = await dbOps.upsertUser(userInfo)
        if (!userSaved) {
          console.error('用户信息迁移失败')
        }
      }

      // 2. 迁移训练记录
      const workoutHistory = wx.getStorageSync('workoutHistory') || []
      let migratedWorkouts = 0
      for (const workout of workoutHistory) {
        let totalVolume = 0
        workout.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.done) {
              totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)
            }
          })
        })

        const workoutData = {
          workoutId: workout.id,
          name: workout.name,
          date: workout.date,
          duration: workout.duration,
          totalVolume,
          exercises: workout.exercises,
          timestamp: workout.timestamp || Date.now()
        }

        const saved = await dbOps.saveWorkout(workoutData)
        if (saved) {
          migratedWorkouts++
        }
      }

      // 3. 迁移挑战数据
      const userChallenges = wx.getStorageSync('userChallenges') || []
      let migratedChallenges = 0
      for (const challenge of userChallenges) {
        const challengeData = {
          challengeId: challenge.id,
          challengeName: '', // 需要根据ID匹配名称
          challengeType: '',
          totalDays: challenge.totalDays || 0,
          checkedDays: challenge.checkedDays || [],
          startDate: challenge.startDate,
          isCompleted: false
        }

        const saved = await dbOps.toggleChallenge({
          ...challengeData,
          isJoin: true
        })
        if (saved) {
          migratedChallenges++
        }
      }

      wx.hideLoading()
      const message = `数据迁移完成！\n训练记录: ${migratedWorkouts}条\n挑战记录: ${migratedChallenges}条`
      
      wx.showModal({
        title: '迁移成功',
        content: message,
        showCancel: false,
        confirmText: '确定',
        success: () => {
          // 迁移成功后，清除本地存储（可选）
          // wx.removeStorageSync('workoutHistory')
          // wx.removeStorageSync('userChallenges')
        }
      })

      return {
        success: true,
        message,
        stats: {
          workouts: migratedWorkouts,
          challenges: migratedChallenges
        }
      }
    } catch (error) {
      console.error('数据迁移失败', error)
      wx.hideLoading()
      wx.showModal({
        title: '迁移失败',
        content: error.message || '数据迁移失败，请稍后重试',
        showCancel: false,
        confirmText: '确定'
      })
      return { success: false, message: error.message }
    } finally {
      this.isMigrating = false
    }
  }

  /**
   * 检查是否需要迁移
   */
  checkNeedMigration() {
    const localWorkouts = wx.getStorageSync('workoutHistory') || []
    const localChallenges = wx.getStorageSync('userChallenges') || []
    
    // 如果本地有数据，可能需要迁移
    return {
      need: localWorkouts.length > 0 || localChallenges.length > 0,
      localWorkoutsCount: localWorkouts.length,
      localChallengesCount: localChallenges.length
    }
  }

  /**
   * 清除本地数据
   */
  clearLocalData() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有本地数据吗？\n此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('workoutHistory')
          wx.removeStorageSync('userChallenges')
          wx.removeStorageSync('activeWorkout')
          wx.showToast({ title: '本地数据已清除', icon: 'success' })
        }
      }
    })
  }
}

module.exports = new DataMigration()
