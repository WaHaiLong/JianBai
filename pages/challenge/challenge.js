const dbOps = require('../../utils/db-operations')
const { EXERCISES } = require('../../data/exercises')

Page({
  data: {
    challenges: [
      {
        id: 'c1',
        title: '30天深蹲挑战',
        description: '每天完成规定深蹲次数，逐步提升下肢力量',
        duration: '30天',
        difficulty: '初级',
        emoji: '🏋️',
        progress: 0,
        totalDays: 30,
        isJoined: false,
        checkedDays: [],
        startDate: null,
        dailyTarget: 50,
        challengeType: 'squat'
      },
      {
        id: 'c2',
        title: '100个俯卧撑',
        description: '挑战单次完成100个标准俯卧撑',
        duration: '4周',
        difficulty: '中级',
        emoji: '💪',
        progress: 0,
        totalDays: 28,
        isJoined: false,
        checkedDays: [],
        startDate: null,
        dailyTarget: 25,
        challengeType: 'pushup'
      },
      {
        id: 'c3',
        title: '铁人三项备赛',
        description: '系统训练计划，提升心肺功能和全身耐力',
        duration: '12周',
        difficulty: '高级',
        emoji: '🏊',
        progress: 0,
        totalDays: 84,
        isJoined: false,
        checkedDays: [],
        startDate: null,
        dailyTarget: 60,
        challengeType: 'triathlon'
      }
    ],
    selectedChallenge: null,
    showDetail: false
  },

  async onLoad() {
    await this._loadChallengeData()
  },

  async onShow() {
    await this._loadChallengeData()
  },

  async _loadChallengeData() {
    // 从云数据库加载用户参与的挑战
    const userChallenges = await dbOps.getChallenges()
    
    // 合并挑战数据
    const challenges = this.data.challenges.map(c => {
      const userChallenge = userChallenges.find(uc => uc.challengeId === c.id)
      if (userChallenge) {
        return {
          ...c,
          ...userChallenge,
          progress: userChallenge.checkedDays ? userChallenge.checkedDays.length : 0
        }
      }
      return c
    })
    
    this.setData({ challenges })
  },

  async onJoinChallenge(e) {
    const { id } = e.currentTarget.dataset
    const challenges = this.data.challenges.map(c => {
      if (c.id === id) {
        if (c.isJoined) {
          // 退出挑战
          return {
            ...c,
            isJoined: false,
            progress: 0,
            checkedDays: [],
            startDate: null
          }
        } else {
          // 加入挑战
          return {
            ...c,
            isJoined: true,
            startDate: Date.now(),
            checkedDays: []
          }
        }
      }
      return c
    })

    const challenge = challenges.find(c => c.id === id)
    this.setData({ challenges })

    // 保存到云数据库
    const result = await dbOps.toggleChallenge({
      challengeId: id,
      challengeName: challenge.title,
      challengeType: challenge.challengeType,
      totalDays: challenge.totalDays,
      isJoin: challenge.isJoined
    })

    if (result) {
      wx.showToast({
        title: challenge.isJoined ? '已加入挑战！' : '已退出挑战',
        icon: challenge.isJoined ? 'success' : 'none'
      })
    } else {
      wx.showToast({ title: '操作失败，请重试', icon: 'none' })
    }
  },

  onChallengeTap(e) {
    const { id } = e.currentTarget.dataset
    const challenge = this.data.challenges.find(c => c.id === id)
    this.setData({ selectedChallenge: challenge, showDetail: true })
  },

  onCloseDetail() {
    this.setData({ showDetail: false, selectedChallenge: null })
  },

  async onCheckIn(e) {
    const { id } = e.currentTarget.dataset
    const result = await dbOps.checkInChallenge(id)

    if (result.success) {
      const challenges = this.data.challenges.map(c => {
        if (c.id === id) {
          const checkedDays = [...(c.checkedDays || []), new Date().toDateString()]
          return {
            ...c,
            checkedDays,
            progress: checkedDays.length,
            isCompleted: result.isCompleted,
            completeTime: result.isCompleted ? Date.now() : null
          }
        }
        return c
      })

      this.setData({ challenges })
      wx.showToast({ title: '打卡成功！', icon: 'success' })

      // 检查是否完成挑战
      if (result.isCompleted) {
        const challenge = challenges.find(c => c.id === id)
        wx.showModal({
          title: '🎉 恭喜完成挑战！',
          content: `你已经完成了${challenge.title}，坚持就是胜利！`,
          showCancel: false,
          confirmText: '太棒了'
        })
      }
    } else {
      wx.showToast({ title: result.message || '打卡失败', icon: 'none' })
    }
  }
})
