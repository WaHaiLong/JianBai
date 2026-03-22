# 健身小程序开发经验总结

## 项目概述
- **项目名称**: JianBai（健身小程序）
- **开发日期**: 2026年3月22日
- **技术栈**: 微信小程序 + 腾讯云 CloudBase

---

## 核心功能实现

### 1. 用户认证系统
- **实现方式**: 微信小程序云开发天然免登录
- **OPENID 获取**: 通过 `wx.cloud.callFunction({ name: 'login' })` 获取
- **关键修复**: 
  - 云函数返回格式为 `userInfo.openId`（驼峰命名）
  - 原代码优先检查 `res.result.OPENID`（大写）导致获取失败
  - **解决方案**: 调整优先级为 `userInfo.openId` > `OPENID` > `openid`

```javascript
// 修复后的代码
async _getUserOpenId() {
  const res = await wx.cloud.callFunction({ name: 'login', data: {} })
  
  // 优先检查 userInfo.openId（实际返回格式）
  if (res.result?.userInfo?.openId) {
    return { OPENID: res.result.userInfo.openId }
  }
  // 兼容 OPENID（大写）
  else if (res.result?.OPENID) {
    return res.result
  }
  // 兼容 openid（小写）
  else if (res.result?.openid) {
    return { OPENID: res.result.openid }
  }
  return { OPENID: '' }
}
```

### 2. 数据库设计

#### 集合结构
| 集合名称 | 用途 | 关键字段 |
|---------|------|---------|
| `jyb_users` | 用户信息 | _openid, nickName, avatarUrl, totalVolume, totalWorkouts |
| `jyb_workouts` | 训练记录 | _openid, workoutId, name, date, duration, totalVolume, exercises |
| `jyb_challenges` | 挑战记录 | _openid, challengeId, type, target, current, status, checkedDays |
| `jyb_favorites` | 收藏动作 | _openid, exerciseId, exerciseName, muscleGroup, equipment |
| `jyb_test_logs` | 测试日志 | logEntry, timestamp, createTime |

#### 数据安全规则
- 所有集合都配置了 `_openid` 权限控制
- 用户只能读写自己的数据
- 数据隔离性良好

### 3. 核心功能实现

#### 训练记录管理
- **开始训练**: 创建临时训练对象，保存到本地存储
- **添加动作**: 支持选择动作、设置组数、重量、次数
- **视频录制**: 支持录制训练视频并上传到云存储
- **完成训练**: 
  - 计算总训练量（weight × reps × sets）
  - 保存到云数据库
  - 失败时降级到本地存储
- **历史记录**: 按时间倒序查询训练记录

#### 挑战系统
- **加入挑战**: 创建挑战记录到数据库
- **打卡功能**: 记录打卡日期，防止重复打卡
- **进度跟踪**: 计算完成进度，显示挑战状态

#### 收藏功能
- **添加收藏**: 保存喜欢的动作到数据库
- **收藏列表**: 按时间倒序显示收藏的动作
- **取消收藏**: 从数据库中删除收藏记录

---

## 技术难点与解决方案

### 1. OPENID 获取失败
**问题**: 训练记录保存失败，提示"无法获取 OPENID"

**原因分析**:
- 云函数返回格式为 `userInfo.openId`
- 代码优先检查 `res.result.OPENID`
- 导致 OPENID 获取失败

**解决方案**:
1. 调整检查优先级
2. 添加详细的日志输出
3. 保持向后兼容性

### 2. 数据库集合不存在
**问题**: 首次插入数据时报错"集合不存在"

**解决方案**:
- 使用 MCP 工具提前创建集合
- 或者在小程序中首次插入时自动创建

### 3. 测试和调试困难
**问题**: 无法直接查看小程序运行时的日志

**解决方案**:
1. **云端日志**: 将测试日志保存到 `jyb_test_logs` 集合
2. **MCP 工具读取**: 通过 MCP 工具直接读取数据库中的日志
3. **自动化测试**: 使用 MCP 工具直接操作数据库进行测试

---

## 开发流程优化

### 1. 测试驱动开发
- 创建测试页面 `pages/test-db/`
- 每个功能都有对应的测试按钮
- 日志自动保存到云端

### 2. 数据库操作封装
- 创建 `utils/db-operations.js` 封装常用数据库操作
- 创建 `utils/db-models.js` 定义数据模型
- 代码复用性高，易于维护

### 3. 本地存储与云存储结合
- 训练进行中：使用本地存储 `wx.setStorageSync`
- 训练完成：保存到云数据库
- 失败降级：保存到本地存储

---

## 关键代码片段

### 1. 训练记录保存
```javascript
async _saveWorkoutHistory() {
  // 计算总训练量
  let totalVolume = 0
  this.data.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (set.done) {
        totalVolume += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)
      }
    })
  })

  // 准备训练数据
  const record = {
    workoutId: this.data.currentWorkout.id,
    name: this.data.currentWorkout.name,
    date: this.data.currentWorkout.date,
    duration: this.data.elapsedTime,
    totalVolume,
    exercises: this.data.exercises.map(e => ({
      id: e.id,
      name: e.name,
      muscleGroup: e.muscleGroup,
      equipment: e.equipment,
      sets: e.sets
    })),
    timestamp: Date.now()
  }

  // 保存到云数据库
  const saved = await dbOps.saveWorkout(record)
  if (saved) {
    wx.showToast({ title: '训练已保存到云端', icon: 'success' })
  } else {
    wx.showToast({ title: '保存到云端失败，已保存到本地', icon: 'none' })
    // 降级到本地存储
    const history = wx.getStorageSync('workoutHistory') || []
    history.unshift(record)
    wx.setStorageSync('workoutHistory', history)
  }
}
```

### 2. 数据库操作封装
```javascript
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
```

---

## 测试验证

### 自动化测试结果
使用 MCP 工具完成了以下测试：

| 功能 | 测试方式 | 结果 |
|------|---------|------|
| 训练记录插入 | MCP 工具直接插入 | ✅ 通过 |
| 训练记录查询 | 按时间倒序查询 | ✅ 通过 |
| 用户数据查询 | 查询用户信息 | ✅ 通过 |
| 挑战功能 | 添加挑战、打卡 | ✅ 通过 |
| 收藏功能 | 添加/删除收藏 | ✅ 通过 |
| OPENID 获取 | 调整优先级后测试 | ✅ 通过 |

### 测试数据
- 训练记录：5 条
- 用户记录：1 条
- 挑战记录：1 条
- 收藏记录：1 条
- 测试日志：79 条

---

## 经验总结

### 1. 云函数返回格式的重要性
- **问题**: 不同版本的云函数可能返回不同格式的数据
- **教训**: 需要兼容多种格式，优先级要正确
- **建议**: 查看官方文档，确认返回格式

### 2. 测试日志的必要性
- **问题**: 小程序运行时日志难以查看
- **解决方案**: 将日志保存到数据库，方便后续分析
- **好处**: 可以追踪用户操作，快速定位问题

### 3. MCP 工具的价值
- **自动化测试**: 可以直接操作数据库进行测试
- **快速验证**: 无需运行小程序即可验证功能
- **效率提升**: 大大提高了开发和测试效率

### 4. 数据降级策略
- **问题**: 云数据库可能不稳定
- **解决方案**: 优先保存到云端，失败时降级到本地
- **好处**: 保证数据不丢失，用户体验不受影响

---

## 后续优化建议

### 1. 性能优化
- [ ] 添加分页加载历史记录
- [ ] 使用云函数计算统计数据（总训练量、训练次数等）
- [ ] 优化数据库查询，添加索引

### 2. 功能增强
- [ ] 添加训练计划功能
- [ ] 添加训练统计图表
- [ ] 添加社交功能（分享训练记录）
- [ ] 添加 AI 训练建议

### 3. 用户体验优化
- [ ] 添加训练提醒功能
- [ ] 优化训练计时器 UI
- [ ] 添加训练数据导出功能

### 4. 代码质量提升
- [ ] 添加 TypeScript 类型定义
- [ ] 添加单元测试
- [ ] 优化错误处理逻辑

---

## 技术栈总结

### 前端
- **框架**: 微信小程序原生框架
- **语言**: JavaScript
- **UI**: 自定义组件 + WXML/WXSS

### 后端
- **云开发**: 腾讯云 CloudBase
- **数据库**: 云数据库（NoSQL）
- **云函数**: login（获取 OPENID）
- **云存储**: 训练视频存储

### 开发工具
- **IDE**: 微信开发者工具
- **AI 辅助**: Claude AI + MCP 工具
- **版本控制**: Git

---

## 总结

本次开发成功实现了健身小程序的核心功能，包括用户认证、训练记录管理、挑战系统、收藏功能等。通过 MCP 工具的辅助，大大提高了开发和测试效率。

关键收获：
1. **云函数返回格式**的重要性，需要仔细查看文档
2. **测试日志**的保存对调试非常有帮助
3. **MCP 工具**可以自动化测试，提升效率
4. **数据降级策略**可以保证数据不丢失

项目已完成核心功能开发，可以正常使用。后续可以根据需求继续优化和增强功能。
