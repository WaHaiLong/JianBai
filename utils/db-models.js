/**
 * 数据库模型定义
 * 所有的数据库集合结构定义在这里，作为数据结构的唯一真实来源
 */

// 用户信息集合
const USER_COLLECTION = 'jyb_users'

const UserModel = {
  // 集合名称
  collectionName: USER_COLLECTION,

  // 数据结构
  schema: {
    _openid: String, // 微信用户openid（系统自动创建）
    nickName: String, // 昵称
    avatarUrl: String, // 头像URL
    gender: Number, // 性别 0-未知 1-男 2-女
    country: String, // 国家
    province: String, // 省份
    city: String, // 城市
    createTime: Number, // 创建时间（时间戳）
    updateTime: Number, // 更新时间（时间戳）
  }
}

// 训练记录集合
const WORKOUT_COLLECTION = 'jyb_workouts'

const WorkoutModel = {
  collectionName: WORKOUT_COLLECTION,

  schema: {
    _openid: String, // 用户openid
    workoutId: String, // 训练ID
    name: String, // 训练名称
    date: String, // 训练日期
    duration: String, // 训练时长
    exercises: Array, // 动作列表
      // {
      //   id: String,
      //   name: String,
      //   muscleGroup: String,
      //   equipment: String,
      //   sets: Array, // 组数 {weight, reps, done}
      //   videos: Array, // 视频列表 {fileID, cloudPath, timestamp}
      // }
    totalVolume: Number, // 总训练量（kg）
    timestamp: Number, // 创建时间戳
    createTime: Number, // 创建时间
  }
}

// 挑战记录集合
const CHALLENGE_COLLECTION = 'jyb_challenges'

const ChallengeModel = {
  collectionName: CHALLENGE_COLLECTION,

  schema: {
    _openid: String, // 用户openid
    challengeId: String, // 挑战ID
    challengeName: String, // 挑战名称
    challengeType: String, // 挑战类型
    totalDays: Number, // 总天数
    checkedDays: Array, // 已打卡日期列表
    startDate: Number, // 开始时间戳
    isCompleted: Boolean, // 是否完成
    completeTime: Number, // 完成时间戳
    createTime: Number, // 创建时间
    updateTime: Number, // 更新时间
  }
}

// 动作收藏集合
const FAVORITE_COLLECTION = 'jyb_favorites'

const FavoriteModel = {
  collectionName: FAVORITE_COLLECTION,

  schema: {
    _openid: String, // 用户openid
    exerciseId: String, // 动作ID
    exerciseName: String, // 动作名称
    muscleGroup: String, // 肌肉群
    equipment: String, // 器械
    createTime: Number, // 创建时间
  }
}

// 训练计划集合
const PLAN_COLLECTION = 'jyb_plans'

const PlanModel = {
  collectionName: PLAN_COLLECTION,

  schema: {
    _openid: String, // 用户openid
    planId: String, // 计划ID
    planName: String, // 计划名称
    description: String, // 计划描述
    duration: String, // 持续时间
    exercises: Array, // 动作列表
      // {
      //   exerciseId: String,
      //   exerciseName: String,
      //   sets: Number,
      //   reps: Number,
      //   weight: Number
      // }
    isPinned: Boolean, // 是否置顶
    createTime: Number, // 创建时间
    updateTime: Number, // 更新时间
  }
}

module.exports = {
  UserModel,
  WorkoutModel,
  ChallengeModel,
  FavoriteModel,
  PlanModel
}
