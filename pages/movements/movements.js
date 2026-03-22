const { MUSCLE_GROUPS, EQUIPMENT_TYPES, EXERCISES } = require('../../data/exercises')

Page({
  data: {
    searchKeyword: '',
    muscleGroups: MUSCLE_GROUPS,
    equipmentTypes: EQUIPMENT_TYPES,
    selectedMuscleGroup: 'back',
    selectedSubGroup: null,
    selectedEquipment: 'barbell',
    exercises: [],
    filteredExercises: [],
    // 右侧快捷导航器械列表（去除已在tab显示的）
    sideEquipments: []
  },

  onLoad() {
    this.setData({ exercises: EXERCISES })
    this._buildSideEquipments()
    this._filterExercises()
  },

  _buildSideEquipments() {
    // 右侧快捷栏显示的器械（tab栏显示前4个，右侧显示剩余）
    const tabEquipments = ['pinned', 'barbell', 'dumbbell', 'kettlebell']
    const sideEquipments = EQUIPMENT_TYPES.filter(e => !tabEquipments.includes(e.id))
    this.setData({ sideEquipments })
  },

  _filterExercises() {
    const { exercises, selectedMuscleGroup, selectedSubGroup, selectedEquipment, searchKeyword } = this.data

    let result = exercises

    // 按肌肉群筛选
    if (selectedMuscleGroup) {
      result = result.filter(e => e.muscleGroup === selectedMuscleGroup)
    }

    // 按子分组筛选
    if (selectedSubGroup) {
      result = result.filter(e => e.subGroup === selectedSubGroup)
    }

    // 按器械筛选
    if (selectedEquipment === 'pinned') {
      result = result.filter(e => e.isPinned)
    } else if (selectedEquipment && selectedEquipment !== 'pinned') {
      result = result.filter(e => e.equipment === selectedEquipment)
    }

    // 按关键字搜索
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      result = result.filter(e =>
        e.name.toLowerCase().includes(kw) ||
        e.primaryMuscles.some(m => m.includes(kw))
      )
    }

    this.setData({ filteredExercises: result })
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    this._filterExercises()
  },

  // 清空搜索
  onSearchClear() {
    this.setData({ searchKeyword: '' })
    this._filterExercises()
  },

  // 点击肌肉群
  onMuscleGroupTap(e) {
    const { id } = e.currentTarget.dataset
    const group = this.data.muscleGroups.find(g => g.id === id)
    const hasSubGroups = group && group.sub && group.sub.length > 0

    this.setData({
      selectedMuscleGroup: id,
      selectedSubGroup: hasSubGroups ? null : null
    })
    this._filterExercises()
  },

  // 点击子分组
  onSubGroupTap(e) {
    const { id } = e.currentTarget.dataset
    const currentSub = this.data.selectedSubGroup
    this.setData({
      selectedSubGroup: currentSub === id ? null : id
    })
    this._filterExercises()
  },

  // 点击器械Tab
  onEquipmentTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedEquipment: id })
    this._filterExercises()
  },

  // 点击右侧快捷器械
  onSideEquipmentTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedEquipment: id })
    this._filterExercises()
  },

  // 点击动作卡片
  onExerciseTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/movement-detail/movement-detail?id=${id}`
    })
  },

  // 点击添加动作按钮
  onAddExercise() {
    wx.showActionSheet({
      itemList: ['添加自定义动作', '从已有动作添加到训练'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '功能开发中', icon: 'none' })
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '请先选择动作', icon: 'none' })
        }
      }
    })
  },

  // 跳转到训练饮食页面
  onTrainingDietTap() {
    wx.showToast({ title: '训练饮食功能开发中', icon: 'none' })
  },

  // 获取当前选中肌肉群的名称
  getSelectedMuscleGroupName() {
    const group = this.data.muscleGroups.find(g => g.id === this.data.selectedMuscleGroup)
    return group ? group.name : ''
  },

  // 获取当前选中器械的名称
  getSelectedEquipmentName() {
    const eq = this.data.equipmentTypes.find(e => e.id === this.data.selectedEquipment)
    return eq ? eq.name : ''
  }
})
