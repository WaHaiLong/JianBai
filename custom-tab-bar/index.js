Component({
  data: {
    selected: 0,
    list: [
      {
        iconPath: '/assets/icons/training.svg',
        selectedIconPath: '/assets/icons/training-active.svg',
        text: '训练',
        pagePath: '/pages/training/training'
      },
      {
        iconPath: '/assets/icons/challenge.svg',
        selectedIconPath: '/assets/icons/challenge-active.svg',
        text: '挑战',
        pagePath: '/pages/challenge/challenge'
      },
      {
        iconPath: '/assets/icons/movements.svg',
        selectedIconPath: '/assets/icons/movements-active.svg',
        text: '动作',
        pagePath: '/pages/movements/movements'
      },
      {
        iconPath: '/assets/icons/history.svg',
        selectedIconPath: '/assets/icons/history-active.svg',
        text: '历史',
        pagePath: '/pages/history/history'
      },
      {
        iconPath: '/assets/icons/mine.svg',
        selectedIconPath: '/assets/icons/mine-active.svg',
        text: '我的',
        pagePath: '/pages/mine/mine'
      }
    ]
  },

  attached() {
    this.updateSelected()
  },

  pageLifetimes: {
    show() {
      this.updateSelected()
    }
  },

  methods: {
    updateSelected() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = `/${currentPage.route}`
      const selected = this.data.list.findIndex(item => item.pagePath === route)
      if (selected !== this.data.selected) {
        this.setData({ selected: selected >= 0 ? selected : 0 })
      }
    },

    switchTab(e) {
      const { index } = e.currentTarget.dataset
      const url = this.data.list[index].pagePath
      wx.switchTab({ url })
    }
  }
})
