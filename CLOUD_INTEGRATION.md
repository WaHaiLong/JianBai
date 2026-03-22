# 云数据库集成说明

## 概述

本小程序已完成云数据库集成，支持将训练数据同步到云端，实现多设备数据共享和备份。

## 数据库结构

### 1. 用户表 (jyb_users)
存储用户的基本信息
- `_openid`: 微信用户openid（系统自动）
- `nickName`: 用户昵称
- `avatarUrl`: 用户头像
- `gender`: 性别 (0-未知, 1-男, 2-女)
- `country`: 国家
- `province`: 省份
- `city`: 城市
- `createTime`: 创建时间
- `updateTime`: 更新时间

### 2. 训练记录表 (jyb_workouts)
存储用户的训练记录
- `_openid`: 用户openid
- `workoutId`: 训练ID
- `name`: 训练名称
- `date`: 训练日期
- `duration`: 训练时长
- `exercises`: 动作列表（JSON）
- `totalVolume`: 总训练量（kg）
- `timestamp`: 创建时间戳
- `createTime`: 创建时间

### 3. 挑战记录表 (jyb_challenges)
存储用户参与的挑战
- `_openid`: 用户openid
- `challengeId`: 挑战ID
- `challengeName`: 挑战名称
- `challengeType`: 挑战类型
- `totalDays`: 总天数
- `checkedDays`: 已打卡日期列表
- `startDate`: 开始时间戳
- `isCompleted`: 是否完成
- `completeTime`: 完成时间戳
- `createTime`: 创建时间
- `updateTime`: 更新时间

### 4. 收藏表 (jyb_favorites)
存储用户收藏的动作
- `_openid`: 用户openid
- `exerciseId`: 动作ID
- `exerciseName`: 动作名称
- `muscleGroup`: 肌肉群
- `equipment`: 器械
- `createTime`: 创建时间

### 5. 训练计划表 (jyb_plans)
存储用户的训练计划
- `_openid`: 用户openid
- `planId`: 计划ID
- `planName`: 计划名称
- `description`: 计划描述
- `duration`: 持续时间
- `exercises`: 动作列表（JSON）
- `isPinned`: 是否置顶
- `createTime`: 创建时间
- `updateTime`: 更新时间

## 安全规则

所有数据表都配置了基于 openid 的访问控制：
- 读取权限：用户只能读取自己的数据
- 写入权限：用户只能写入自己的数据

## 数据同步策略

### 双存储机制
1. **优先云数据库**：优先从云数据库读取数据
2. **本地降级**：当云数据库不可用时，自动降级到本地存储
3. **数据迁移**：提供工具将本地数据迁移到云端

### 训练页面 (pages/training)
- 完成训练后，同时保存到云数据库和本地存储
- 云保存失败时，自动降级到本地存储

### 挑战页面 (pages/challenge)
- 挑战状态从云数据库同步
- 打卡操作直接写入云数据库
- 支持加入/退出挑战

### 历史页面 (pages/history)
- 从云数据库分页加载训练记录
- 支持下拉刷新和上拉加载更多
- 删除操作同步到云数据库

### 我的页面 (pages/mine)
- 从云数据库加载统计数据
- 用户登录时自动同步到云端
- 提供数据迁移工具

## 使用说明

### 1. 用户登录
- 首次使用点击"我的"页面登录按钮
- 使用微信授权登录
- 用户信息自动保存到云数据库

### 2. 数据迁移
- 在"我的"页面点击"设置"
- 选择"数据迁移到云端"
- 系统自动检测本地数据并迁移

### 3. 数据同步
- 所有训练数据自动同步到云端
- 多设备登录可查看相同数据
- 云端数据永久保存

## API 接口

### dbOperations 工具类

```javascript
const dbOps = require('../../utils/db-operations')

// 用户相关
await dbOps.getUser()                    // 获取用户信息
await dbOps.upsertUser(userInfo)        // 创建/更新用户信息

// 训练记录
await dbOps.saveWorkout(workoutData)   // 保存训练记录
await dbOps.getWorkouts(limit, skip)   // 获取训练记录
await dbOps.deleteWorkout(workoutId)    // 删除训练记录

// 挑战相关
await dbOps.toggleChallenge(data)         // 加入/退出挑战
await dbOps.getChallenges()             // 获取用户挑战列表
await dbOps.checkInChallenge(challengeId) // 挑战打卡

// 收藏相关
await dbOps.toggleFavorite(data)         // 收藏/取消收藏
await dbOps.getFavorites()              // 获取收藏列表

// 训练计划
await dbOps.savePlan(planData)         // 保存训练计划
await dbOps.getPlans()                 // 获取训练计划列表
await dbOps.deletePlan(planId)          // 删除训练计划
await dbOps.pinPlan(planId, isPinned)  // 置顶/取消置顶
```

## 注意事项

1. **权限设置**：所有数据库集合都需要设置正确的安全规则
2. **错误处理**：所有数据库操作都有降级机制，确保功能可用
3. **数据迁移**：首次使用建议进行数据迁移
4. **网络要求**：云数据库需要网络连接，无网络时使用本地存储

## 云开发环境

- **环境ID**: cloud1-7ggix6sid4756a3a
- **地域**: ap-shanghai
- **数据库**: 文档型数据库
- **存储**: 云存储（训练视频）

## 更新日志

### v2.0.0 (2026-03-22)
- 集成云数据库
- 实现数据云端同步
- 添加数据迁移功能
- 支持多设备数据共享
- 优化数据加载性能
