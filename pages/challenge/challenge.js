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
        isJoined: false
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
        isJoined: false
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
        isJoined: false
      }
    ]
  },

  onJoinChallenge(e) {
    const { id } = e.currentTarget.dataset
    const challenges = this.data.challenges.map(c => {
      if (c.id === id) return { ...c, isJoined: !c.isJoined }
      return c
    })
    this.setData({ challenges })
    const challenge = challenges.find(c => c.id === id)
    wx.showToast({
      title: challenge.isJoined ? '已加入挑战！' : '已退出挑战',
      icon: challenge.isJoined ? 'success' : 'none'
    })
  }
})
