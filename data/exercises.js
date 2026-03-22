// 肌肉群分类
const MUSCLE_GROUPS = [
  { id: 'chest', name: '胸', sub: [] },
  {
    id: 'back', name: '背', sub: [
      { id: 'upper-back', name: '上背' },
      { id: 'lower-back', name: '下背' }
    ]
  },
  { id: 'legs', name: '腿', sub: [] },
  { id: 'shoulders', name: '肩', sub: [] },
  { id: 'trapezius', name: '斜方肌', sub: [] },
  { id: 'biceps', name: '二头', sub: [] },
  { id: 'triceps', name: '三头', sub: [] },
  { id: 'calves', name: '小腿', sub: [] },
  { id: 'forearms', name: '前臂', sub: [] },
  { id: 'neck', name: '颈部', sub: [] },
  { id: 'glutes', name: '臀部', sub: [] },
  { id: 'functional', name: '功能性', sub: [] },
  { id: 'core', name: '核心稳定', sub: [] },
  { id: 'abs', name: '腹部', sub: [] },
  { id: 'push-up', name: '扑', sub: [] },
  { id: 'pull', name: '拉', sub: [] }
]

// 器械分类
const EQUIPMENT_TYPES = [
  { id: 'pinned', name: '置顶' },
  { id: 'barbell', name: '杠铃' },
  { id: 'dumbbell', name: '哑铃' },
  { id: 'kettlebell', name: '壶铃' },
  { id: 'cable', name: '绳' },
  { id: 'smith', name: '史密斯' },
  { id: 'machine', name: '器械' },
  { id: 'trx', name: 'T' },
  { id: 'bodyweight', name: '自重' },
  { id: 'other', name: '其他' }
]

// 动作数据库
const EXERCISES = [
  // ========== 背部 - 杠铃 ==========
  {
    id: 'barbell-row',
    name: '杠铃划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '菱形肌', '中斜方肌'],
    secondaryMuscles: ['二头肌', '后三角'],
    difficulty: 'intermediate',
    description: '杠铃划船是训练背部厚度最经典的复合动作，主要刺激背阔肌、菱形肌和中斜方肌。',
    tips: ['保持背部挺直', '将肘部向后拉', '在顶部挤压背部肌肉']
  },
  {
    id: 'reverse-grip-row',
    name: '反手杠铃划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '二头肌'],
    secondaryMuscles: ['菱形肌', '后三角'],
    difficulty: 'intermediate',
    description: '反手握姿划船增加了对下背阔肌和二头肌的刺激。',
    tips: ['反手握杆', '肘部贴近身体', '控制下放速度']
  },
  {
    id: 'landmine-single-row',
    name: '地雷杆单手划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌'],
    secondaryMuscles: ['菱形肌', '核心'],
    difficulty: 'intermediate',
    description: '地雷杆单手划船可以更好地孤立单侧背部，减少代偿。',
    tips: ['单手握住杆端', '保持核心稳定', '感受背部发力']
  },
  {
    id: 'pendlay-row',
    name: '潘德雷划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '菱形肌', '中斜方肌'],
    secondaryMuscles: ['竖脊肌', '核心'],
    difficulty: 'advanced',
    description: '潘德雷划船是一种爆发力版的杠铃划船，每次从地面出发，适合力量运动员。',
    tips: ['从地面开始', '爆发式上拉', '上身与地面平行']
  },
  {
    id: 'half-deadlift',
    name: '半程硬拉',
    muscleGroup: 'back',
    subGroup: 'lower-back',
    equipment: 'barbell',
    hasTutorial: false,
    hasMultiAngle: true,
    isPinned: false,
    primaryMuscles: ['竖脊肌', '臀大肌', '腘绳肌'],
    secondaryMuscles: ['斜方肌', '前臂'],
    difficulty: 'intermediate',
    description: '半程硬拉从膝盖高度开始，重点训练上背和锁定力量。',
    tips: ['从膝盖高度起始', '挺胸收腹', '感受竖脊肌发力']
  },
  {
    id: 'prone-barbell-row',
    name: '俯卧杠铃划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '菱形肌'],
    secondaryMuscles: ['后三角', '二头肌'],
    difficulty: 'beginner',
    description: '俯卧于斜板上进行划船，消除腰部代偿，更好孤立背部。',
    tips: ['胸部贴紧斜板', '控制全程动作', '肘部向外张开']
  },
  {
    id: 't-bar-row-narrow',
    name: 'T杆划船（窄）',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '菱形肌'],
    secondaryMuscles: ['二头肌', '后三角'],
    difficulty: 'intermediate',
    description: 'T杆划船窄握版本，重点训练背阔肌内侧和菱形肌。',
    tips: ['窄握把手', '肘部贴近身体', '顶部充分收缩']
  },
  {
    id: 'seal-row',
    name: '海豹杠铃划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'barbell',
    hasTutorial: false,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '菱形肌', '中斜方肌'],
    secondaryMuscles: ['后三角', '二头肌'],
    difficulty: 'intermediate',
    description: '俯卧于高台上进行划船，完全消除下背代偿，极度孤立上背。',
    tips: ['俯卧于高台', '双臂自然悬垂', '充分伸展再上拉']
  },

  // ========== 背部 - 哑铃 ==========
  {
    id: 'dumbbell-row',
    name: '哑铃单臂划船',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'dumbbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌'],
    secondaryMuscles: ['菱形肌', '二头肌'],
    difficulty: 'beginner',
    description: '最经典的单侧背部训练动作。',
    tips: ['单膝跪于凳上', '拉至腰部位置', '感受背阔肌收缩']
  },
  {
    id: 'dumbbell-pull-over',
    name: '哑铃直臂下拉',
    muscleGroup: 'back',
    subGroup: 'upper-back',
    equipment: 'dumbbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['背阔肌', '前锯肌'],
    secondaryMuscles: ['胸大肌', '三头肌'],
    difficulty: 'beginner',
    description: '哑铃直臂下拉可以充分拉伸和收缩背阔肌。',
    tips: ['保持手臂微弯', '感受背阔肌拉伸', '控制速度']
  },

  // ========== 背部 - 壶铃 ==========
  {
    id: 'kettlebell-swing',
    name: '壶铃摆荡',
    muscleGroup: 'back',
    subGroup: 'lower-back',
    equipment: 'kettlebell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['臀大肌', '腘绳肌', '竖脊肌'],
    secondaryMuscles: ['核心', '肩部'],
    difficulty: 'intermediate',
    description: '壶铃摆荡是强力的臀腿和后链训练动作。',
    tips: ['髋部驱动发力', '保持背部挺直', '壶铃到达胸部高度']
  },

  // ========== 胸部 - 杠铃 ==========
  {
    id: 'barbell-bench-press',
    name: '杠铃卧推',
    muscleGroup: 'chest',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: true,
    primaryMuscles: ['胸大肌'],
    secondaryMuscles: ['三头肌', '前三角'],
    difficulty: 'beginner',
    description: '卧推是胸部训练最基础也最有效的复合动作。',
    tips: ['背部贴紧凳面', '双脚踩实地面', '控制下放速度']
  },
  {
    id: 'incline-barbell-press',
    name: '上斜杠铃卧推',
    muscleGroup: 'chest',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['胸大肌上束'],
    secondaryMuscles: ['前三角', '三头肌'],
    difficulty: 'intermediate',
    description: '上斜卧推重点刺激胸大肌上束，改善胸部形态。',
    tips: ['斜板角度30-45度', '控制下放至上胸', '顶部不要完全锁死']
  },

  // ========== 胸部 - 哑铃 ==========
  {
    id: 'dumbbell-bench-press',
    name: '哑铃卧推',
    muscleGroup: 'chest',
    subGroup: null,
    equipment: 'dumbbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['胸大肌'],
    secondaryMuscles: ['三头肌', '前三角'],
    difficulty: 'beginner',
    description: '哑铃卧推比杠铃活动范围更大，且能单独训练每侧。',
    tips: ['双手平行或稍内旋', '充分下放拉伸', '顶部哑铃靠拢']
  },
  {
    id: 'dumbbell-fly',
    name: '哑铃飞鸟',
    muscleGroup: 'chest',
    subGroup: null,
    equipment: 'dumbbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['胸大肌'],
    secondaryMuscles: ['前三角'],
    difficulty: 'beginner',
    description: '哑铃飞鸟是孤立胸大肌的经典动作，重点感受拉伸和收缩。',
    tips: ['保持肘部微弯', '感受胸部充分拉伸', '不要过度下放']
  },

  // ========== 腿部 - 杠铃 ==========
  {
    id: 'barbell-squat',
    name: '杠铃深蹲',
    muscleGroup: 'legs',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: true,
    primaryMuscles: ['股四头肌', '臀大肌'],
    secondaryMuscles: ['腘绳肌', '竖脊肌', '核心'],
    difficulty: 'intermediate',
    description: '深蹲是腿部训练之王，全身复合动作，激素分泌效果极好。',
    tips: ['脚尖稍微外展', '膝盖顺脚尖方向', '保持挺胸']
  },
  {
    id: 'romanian-deadlift',
    name: '罗马尼亚硬拉',
    muscleGroup: 'legs',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['腘绳肌', '臀大肌'],
    secondaryMuscles: ['竖脊肌', '小腿'],
    difficulty: 'intermediate',
    description: '罗马尼亚硬拉是训练腘绳肌最有效的动作之一。',
    tips: ['保持背部挺直', '髋部后推', '感受腘绳肌拉伸']
  },

  // ========== 肩部 - 杠铃 ==========
  {
    id: 'military-press',
    name: '杠铃推举',
    muscleGroup: 'shoulders',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: true,
    primaryMuscles: ['前三角', '中三角'],
    secondaryMuscles: ['三头肌', '斜方肌'],
    difficulty: 'intermediate',
    description: '杠铃推举是肩部最基础的复合动作，适合增加肩部整体力量。',
    tips: ['核心收紧', '杠铃过头顶时略前倾', '全程控制']
  },

  // ========== 肩部 - 哑铃 ==========
  {
    id: 'dumbbell-lateral-raise',
    name: '哑铃侧平举',
    muscleGroup: 'shoulders',
    subGroup: null,
    equipment: 'dumbbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['中三角'],
    secondaryMuscles: ['斜方肌'],
    difficulty: 'beginner',
    description: '侧平举是孤立中三角最有效的动作，打造宽肩必备。',
    tips: ['小拇指略高于大拇指', '不要借腰部', '控制下放']
  },

  // ========== 二头 - 杠铃 ==========
  {
    id: 'barbell-curl',
    name: '杠铃弯举',
    muscleGroup: 'biceps',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: true,
    primaryMuscles: ['肱二头肌'],
    secondaryMuscles: ['肱肌', '前臂'],
    difficulty: 'beginner',
    description: '杠铃弯举是二头肌质量训练的基础动作，可以使用大重量。',
    tips: ['肘部固定于两侧', '全程控制速度', '顶部收缩二头']
  },

  // ========== 三头 - 杠铃 ==========
  {
    id: 'skull-crusher',
    name: '杠铃颅骨破碎者',
    muscleGroup: 'triceps',
    subGroup: null,
    equipment: 'barbell',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['肱三头肌'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    description: '颅骨破碎者是孤立三头肌长头最有效的动作之一。',
    tips: ['肘部保持固定', '缓慢下放至额头旁', '充分伸展']
  },

  // ========== 核心 - 自重 ==========
  {
    id: 'plank',
    name: '平板支撑',
    muscleGroup: 'core',
    subGroup: null,
    equipment: 'bodyweight',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['腹横肌', '腹直肌'],
    secondaryMuscles: ['臀部', '肩部'],
    difficulty: 'beginner',
    description: '平板支撑是最基础的核心稳定训练动作。',
    tips: ['身体保持一条直线', '不要塌腰或撅臀', '均匀呼吸']
  },

  // ========== 腹部 - 自重 ==========
  {
    id: 'crunch',
    name: '仰卧卷腹',
    muscleGroup: 'abs',
    subGroup: null,
    equipment: 'bodyweight',
    hasTutorial: true,
    hasMultiAngle: false,
    isPinned: false,
    primaryMuscles: ['腹直肌'],
    secondaryMuscles: ['腹外斜肌'],
    difficulty: 'beginner',
    description: '卷腹是最基础的腹肌训练动作。',
    tips: ['不要拉脖子', '感受腹部收缩', '不需要完全坐起']
  }
]

module.exports = {
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  EXERCISES
}
