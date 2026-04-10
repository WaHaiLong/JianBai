/**
 * 云数据库操作工具类
 * 封装常用的数据库操作
 */

const { UserModel, WorkoutModel, ChallengeModel, FavoriteModel, PlanModel } = require('./db-models')

class DBOperations {
  constructor() {
    this.db = wx.cloud.database()
    this._ = this.db.command
  }

  /**
   * 获取用户信息
   */
  async getUser() {
    try {
      const res = await this.db.collection(UserModel.collectionName).get()
      return res.data[0] || null
    } catch (error) {
      console.error('获取用户信息失败', error)
      return null
    }
  }

  /**
   * 创建/更新用户信息
   */
  async upsertUser(userInfo) {
    try {
      const existingUser = await this.getUser()
      const data = {
        ...userInfo,
        updateTime: Date.now()
      }

      if (existingUser) {
        // 更新
        await this.db.collection(UserModel.collectionName).doc(existingUser._id).update({
          data
        })
      } else {
        // 创建
        data.createTime = Date.now()
        await this.db.collection(UserModel.collectionName).add({
          data
        })
      }
      return true
    } catch (error) {
      console.error('保存用户信息失败', error)
      return false
    }
  }

  /**
   * 保存训练记录
   */
  async saveWorkout(workoutData) {
    try {
      const data = {
        ...workoutData,
        createTime: Date.now(),
        timestamp: Date.now()
      }
      await this.db.collection(WorkoutModel.collectionName).add({ data })
      return true
    } catch (error) {
      console.error('保存训练记录失败', error)
      return false
    }
  }

  /**
   * 获取训练记录列表
   */
  async getWorkouts(limit = 20, skip = 0) {
    try {
      const res = await this.db.collection(WorkoutModel.collectionName)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .skip(skip)
        .get()
      return res.data
    } catch (error) {
      console.error('获取训练记录失败', error)
      return []
    }
  }

  /**
   * 删除训练记录（仅删除当前用户的记录）
   */
  async deleteWorkout(workoutId) {
    try {
      const res = await this.db.collection(WorkoutModel.collectionName)
        .where({ workoutId, _openid: '{openid}' })
        .remove()
      return res.stats.removed > 0
    } catch (error) {
      console.error('删除训练记录失败', error)
      return false
    }
  }

  /**
   * 加入/退出挑战
   */
  async toggleChallenge(challengeData) {
    try {
      const { challengeId, isJoin } = challengeData
      const existing = await this.db.collection(ChallengeModel.collectionName)
        .where({ challengeId, _openid: '{openid}' })
        .get()

      if (isJoin) {
        if (existing.data.length === 0) {
          // 加入挑战
          const data = {
            ...challengeData,
            isCompleted: false,
            checkedDays: [],
            createTime: Date.now(),
            updateTime: Date.now()
          }
          await this.db.collection(ChallengeModel.collectionName).add({ data })
        }
      } else {
        // 退出挑战
        if (existing.data.length > 0) {
          await this.db.collection(ChallengeModel.collectionName)
            .doc(existing.data[0]._id)
            .remove()
        }
      }
      return true
    } catch (error) {
      console.error('操作挑战失败', error)
      return false
    }
  }

  /**
   * 获取用户参与的挑战列表
   */
  async getChallenges() {
    try {
      const res = await this.db.collection(ChallengeModel.collectionName)
        .where({ _openid: '{openid}' })
        .get()
      return res.data
    } catch (error) {
      console.error('获取挑战列表失败', error)
      return []
    }
  }

  /**
   * 挑战打卡
   */
  async checkInChallenge(challengeId) {
    try {
      const res = await this.db.collection(ChallengeModel.collectionName)
        .where({ challengeId, _openid: '{openid}' })
        .get()

      if (res.data.length === 0) {
        throw new Error('挑战不存在')
      }

      const challenge = res.data[0]
      const today = new Date().toDateString()

      if (challenge.checkedDays.includes(today)) {
        return { success: false, message: '今日已打卡' }
      }

      const newCheckedDays = [...challenge.checkedDays, today]
      const isCompleted = newCheckedDays.length >= challenge.totalDays

      await this.db.collection(ChallengeModel.collectionName)
        .doc(challenge._id)
        .update({
          data: {
            checkedDays: newCheckedDays,
            isCompleted,
            completeTime: isCompleted ? Date.now() : null,
            updateTime: Date.now()
          }
        })

      return { success: true, message: '打卡成功', isCompleted }
    } catch (error) {
      console.error('挑战打卡失败', error)
      return { success: false, message: error.message || '打卡失败' }
    }
  }

  /**
   * 收藏/取消收藏动作
   */
  async toggleFavorite(exerciseData) {
    try {
      const { exerciseId, exerciseName, muscleGroup, equipment } = exerciseData
      const existing = await this.db.collection(FavoriteModel.collectionName)
        .where({ exerciseId, _openid: '{openid}' })
        .get()

      if (existing.data.length > 0) {
        // 取消收藏
        await this.db.collection(FavoriteModel.collectionName)
          .doc(existing.data[0]._id)
          .remove()
        return { success: true, isFavorite: false }
      } else {
        // 添加收藏
        const data = {
          exerciseId,
          exerciseName,
          muscleGroup,
          equipment,
          createTime: Date.now()
        }
        await this.db.collection(FavoriteModel.collectionName).add({ data })
        return { success: true, isFavorite: true }
      }
    } catch (error) {
      console.error('操作收藏失败', error)
      return { success: false, message: '操作失败' }
    }
  }

  /**
   * 获取收藏列表
   */
  async getFavorites() {
    try {
      const res = await this.db.collection(FavoriteModel.collectionName)
        .where({ _openid: '{openid}' })
        .orderBy('createTime', 'desc')
        .get()
      return res.data
    } catch (error) {
      console.error('获取收藏列表失败', error)
      return []
    }
  }

  /**
   * 保存训练计划
   */
  async savePlan(planData) {
    try {
      const { planId } = planData
      const existing = await this.db.collection(PlanModel.collectionName)
        .where({ planId, _openid: '{openid}' })
        .get()

      const data = {
        ...planData,
        updateTime: Date.now()
      }

      if (existing.data.length > 0) {
        // 更新
        await this.db.collection(PlanModel.collectionName)
          .doc(existing.data[0]._id)
          .update({ data })
      } else {
        // 创建
        data.createTime = Date.now()
        await this.db.collection(PlanModel.collectionName).add({ data })
      }
      return true
    } catch (error) {
      console.error('保存训练计划失败', error)
      return false
    }
  }

  /**
   * 获取训练计划列表
   */
  async getPlans() {
    try {
      const res = await this.db.collection(PlanModel.collectionName)
        .where({ _openid: '{openid}' })
        .orderBy('isPinned', 'desc')
        .orderBy('updateTime', 'desc')
        .get()
      return res.data
    } catch (error) {
      console.error('获取训练计划失败', error)
      return []
    }
  }

  /**
   * 删除训练计划（仅删除当前用户的计划）
   */
  async deletePlan(planId) {
    try {
      const res = await this.db.collection(PlanModel.collectionName)
        .where({ planId, _openid: '{openid}' })
        .remove()
      return res.stats.removed > 0
    } catch (error) {
      console.error('删除训练计划失败', error)
      return false
    }
  }

  /**
   * 置顶/取消置顶训练计划（仅操作当前用户的计划）
   */
  async pinPlan(planId, isPinned) {
    try {
      const res = await this.db.collection(PlanModel.collectionName)
        .where({ planId, _openid: '{openid}' })
        .get()

      if (res.data.length === 0) {
        return false
      }

      await this.db.collection(PlanModel.collectionName)
        .doc(res.data[0]._id)
        .update({
          data: {
            isPinned,
            updateTime: Date.now()
          }
        })
      return true
    } catch (error) {
      console.error('置顶训练计划失败', error)
      return false
    }
  }
}

module.exports = new DBOperations()
