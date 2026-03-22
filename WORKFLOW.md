# 健身小程序开发流程

> 本文档详细描述了健身小程序的完整开发流程、工作规范和最佳实践。

---

## 📋 目录

1. [开发流程概览](#开发流程概览)
2. [环境准备阶段](#环境准备阶段)
3. [开发规范阶段](#开发规范阶段)
4. [标准开发工作流](#标准开发工作流)
5. [项目架构](#项目架构)
6. [功能模块](#功能模块)
7. [数据库结构](#数据库结构)
8. [开发最佳实践](#开发最佳实践)
9. [测试与调试](#测试与调试)
10. [部署与发布](#部署与发布)

---

## 🎯 开发流程概览

```
环境准备 → 需求分析 → UI 设计 → 代码开发 → 测试调试 → 部署发布
   ✅        ✅         ✅        ✅        ✅        ✅
```

### 流程阶段

| 阶段 | 核心任务 | 关键输出 | 验证方式 |
|------|---------|---------|---------|
| 环境准备 | 配置开发环境 | 开发环境可用 | 微信开发者工具正常运行 |
| 需求分析 | 理解功能需求 | 需求文档 | 与用户确认 |
| UI 设计 | 设计页面界面 | 设计规范 | 符合 UI 设计规则 |
| 代码开发 | 编写功能代码 | 完整代码 | 功能正常运行 |
| 测试调试 | 验证功能正确性 | 测试报告 | 测试通过 |
| 部署发布 | 提交代码到仓库 | Git 提交记录 | 代码已推送 |

---

## 🛠️ 环境准备阶段

### 1. 开发工具

#### 必需工具
- **微信开发者工具** - 最新稳定版
- **Git** - 版本管理工具
- **PowerShell** - Windows 命令行工具
- **CloudBase AI ToolKit** - AI 开发助手插件

#### 可选工具
- **VS Code** - 代码编辑器（可选）
- **Postman** - API 测试工具（可选）

### 2. 项目初始化

#### 创建新项目
```bash
# 1. 使用微信开发者工具创建新小程序项目
# 2. 启用云开发功能
# 3. 绑定 CloudBase 环境

# 4. 安装开发依赖
npm install
```

#### 配置 CloudBase
```json
// cloudbaserc.json
{
  "envId": "your-env-id",
  "version": "2.0"
}
```

### 3. 环境检查

#### 检查 CloudBase 环境
```javascript
// 使用 MCP 工具检查环境状态
mcp_call_tool('cloudbase', 'envQuery', {
  action: 'info'
})
```

#### 检查项目配置
```bash
# 查看项目配置
cat project.config.json

# 查看环境配置
cat cloudbaserc.json
```

---

## 📚 开发规范阶段

### 1. 必读规则文件

#### 核心规则文件

| 文件路径 | 用途 | 优先级 |
|---------|------|--------|
| `rules/ui-design/rule.md` | UI 设计规范 | ⭐⭐⭐ 最高 |
| `rules/miniprogram-development/rule.md` | 小程序开发规范 | ⭐⭐⭐ |
| `rules/no-sql-wx-mp-sdk/rule.md` | NoSQL 数据库规范 | ⭐⭐⭐ |
| `rules/auth-wechat/rule.md` | 认证规范 | ⭐⭐ |
| `CODEBUDDY.md` | CloudBase AI 规则指南 | ⭐⭐ |

#### 读取规则文件
```javascript
// 开发前必须先读取 UI 设计规范
read_file('rules/ui-design/rule.md')

// 根据项目类型读取其他规则
// 小程序项目：
read_file('rules/miniprogram-development/rule.md')
read_file('rules/no-sql-wx-mp-sdk/rule.md')
read_file('rules/auth-wechat/rule.md')
```

### 2. 开发前检查清单

#### 环境检查
- [ ] 微信开发者工具已安装并配置
- [ ] CloudBase 环境已绑定
- [ ] 项目配置文件正确
- [ ] MCP 工具已集成

#### 规则检查
- [ ] 已阅读 UI 设计规范
- [ ] 已阅读项目类型对应的规则
- [ ] 理解核心能力要求
- [ ] 了解开发工作流程

#### 场景识别
- [ ] 识别项目类型（小程序/Web/数据库/UI）
- [ ] 识别核心功能需求
- [ ] 识别技术栈要求
- [ ] 识别潜在难点

#### 用户确认
- [ ] 与用户确认需求理解
- [ ] 与用户确认技术方案
- [ ] 与用户确认开发计划

---

## 🚀 标准开发工作流

### 阶段一：需求分析与设计

#### 1. 需求理解

**需求分析步骤：**
1. 与用户沟通，明确功能需求
2. 识别核心功能点
3. 确定技术实现方案
4. 评估开发难度和时间

**需求文档模板：**
```markdown
## 功能需求

### 功能描述
[描述功能的核心目的和作用]

### 用户场景
[描述用户使用场景]

### 功能列表
- [ ] 功能点 1
- [ ] 功能点 2
- [ ] 功能点 3

### 技术方案
[描述技术实现方案]

### 数据结构
[描述需要的数据结构]
```

#### 2. UI 设计（⚠️ 必须第一步）

**⚠️ 重要提示：必须在编写任何 UI 代码之前先读取 UI 设计规范！**

```javascript
// 1. 读取 UI 设计规范
read_file('rules/ui-design/rule.md')

// 2. 输出设计规范
// Purpose Statement（目的声明）
// Aesthetic Direction（美学方向）
// Color Palette（色彩方案，含 hex 代码）
// Typography（字体选择）
// Layout Strategy（布局策略）
```

**设计规范输出示例：**
```markdown
## UI 设计规范

### Purpose Statement
创建一个现代化、专业、易用的健身训练记录应用，帮助用户高效管理训练计划和历史记录。

### Aesthetic Direction
- Modern Fitness Style（现代健身风格）
- Clean & Energetic（简洁充满活力）
- Professional & Trustworthy（专业可信）

### Color Palette
- 主色调：#FF6B35（活力橙）
- 辅助色：#2C3E50（深蓝灰）
- 背景色：#F5F7FA（浅灰白）
- 文本色：#333333（深灰）
- 成功色：#27AE60（绿色）
- 警告色：#F39C12（橙色）
- 危险色：#E74C3C（红色）

### Typography
- 主要字体：-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- 标题字体：PingFang SC, 'Microsoft YaHei', sans-serif
- 数字字体：Roboto, Arial, sans-serif

### Layout Strategy
- 卡片式布局
- 左右分栏（左侧导航，右侧内容）
- 间距统一（8px, 16px, 24px, 32px）
- 圆角统一（8px, 12px, 16px）
```

#### 3. 技术方案设计

**技术方案文档模板：**
```markdown
## 技术方案

### 技术栈
- 框架：微信小程序原生框架
- 数据库：CloudBase NoSQL 数据库
- 存储：CloudBase 云存储
- 认证：微信小程序云开发认证

### 页面结构
```javascript
{
  pages: [
    'pages/index/index',
    'pages/training/training',
    'pages/history/history'
  ]
}
```

### 数据结构
```javascript
{
  collection: 'jyb_workouts',
  fields: {
    _openid: String,
    name: String,
    date: String,
    exercises: Array,
    timestamp: Number
  }
}
```

### API 接口
- `getWorkouts()` - 获取训练记录
- `saveWorkout(data)` - 保存训练记录
- `deleteWorkout(id)` - 删除训练记录
```

---

### 阶段二：代码开发

#### 1. 页面开发

**目录结构：**
```
pages/
├── [页面名]/
│   ├── [页面名].js      # 业务逻辑
│   ├── [页面名].json    # 页面配置
│   ├── [页面名].wxml   # 页面结构
│   └── [页面名].wxss    # 页面样式
```

**页面开发步骤：**

1. **创建页面文件**
```bash
# 创建页面目录
mkdir pages/[页面名]

# 创建页面文件
touch pages/[页面名]/[页面名].js
touch pages/[页面名]/[页面名].json
touch pages/[页面名]/[页面名].wxml
touch pages/[页面名]/[页面名].wxss
```

2. **编写页面配置（[页面名].json）**
```json
{
  "usingComponents": {},
  "navigationBarTitleText": "页面标题",
  "navigationBarBackgroundColor": "#FF6B35",
  "navigationBarTextStyle": "white"
}
```

3. **编写页面结构（[页面名].wxml）**
```xml
<view class="container">
  <view class="header">
    <text class="title">{{title}}</text>
  </view>
  <view class="content">
    <block wx:for="{{items}}" wx:key="id">
      <view class="item">{{item.name}}</view>
    </block>
  </view>
</view>
```

4. **编写页面样式（[页面名].wxss）**
```css
.container {
  padding: 32rpx;
  background: #F5F7FA;
  min-height: 100vh;
}

.header {
  margin-bottom: 32rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.item {
  padding: 24rpx;
  background: white;
  border-radius: 16rpx;
}
```

5. **编写页面逻辑（[页面名].js）**
```javascript
Page({
  data: {
    title: '页面标题',
    items: []
  },

  onLoad(options) {
    this.loadData()
  },

  async loadData() {
    try {
      const res = await wx.cloud.database()
        .collection('jyb_workouts')
        .get()
      
      this.setData({
        items: res.data
      })
    } catch (error) {
      console.error('加载数据失败：', error)
    }
  }
})
```

6. **添加页面路由（app.json）**
```json
{
  "pages": [
    "pages/index/index",
    "pages/[页面名]/[页面名]"
  ]
}
```

#### 2. 组件开发（如需）

**目录结构：**
```
components/
└── [组件名]/
    ├── [组件名].js
    ├── [组件名].json
    ├── [组件名].wxml
    └── [组件名].wxss
```

**组件开发步骤：**

1. **创建组件文件**
```bash
# 创建组件目录
mkdir components/[组件名]

# 创建组件文件
touch components/[组件名]/[组件名].js
touch components/[组件名]/[组件名].json
touch components/[组件名]/[组件名].wxml
touch components/[组件名]/[组件名].wxss
```

2. **编写组件配置（[组件名].json）**
```json
{
  "component": true,
  "usingComponents": {}
}
```

3. **编写组件结构（[组件名].wxml）**
```xml
<view class="card">
  <view class="card-header">{{title}}</view>
  <view class="card-content">
    <slot></slot>
  </view>
</view>
```

4. **编写组件样式（[组件名].wxss）**
```css
.card {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.card-content {
  font-size: 28rpx;
  color: #666;
}
```

5. **编写组件逻辑（[组件名].js）**
```javascript
Component({
  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },

  data: {},

  methods: {
    onTap() {
      this.triggerEvent('tap', {})
    }
  }
})
```

6. **使用组件**
```json
// 页面配置中引用组件
{
  "usingComponents": {
    "card": "/components/[组件名]/[组件名]"
  }
}
```

```xml
<!-- 页面中使用组件 -->
<card title="卡片标题">
  <view>卡片内容</view>
</card>
```

#### 3. 工具函数开发

**目录结构：**
```
utils/
├── db-operations.js      # 数据库操作
├── storage.js            # 本地存储
├── util.js               # 通用工具
└── format.js             # 格式化工具
```

**工具函数示例：**

```javascript
// utils/db-operations.js
const db = wx.cloud.database()

/**
 * 保存训练记录
 * @param {Object} data 训练数据
 * @returns {Promise}
 */
export const saveWorkout = (data) => {
  return db.collection('jyb_workouts').add({
    data
  })
}

/**
 * 获取训练记录
 * @param {String} openid 用户 OPENID
 * @returns {Promise}
 */
export const getWorkouts = (openid) => {
  return db.collection('jyb_workouts')
    .where({ _openid: openid })
    .orderBy('timestamp', 'desc')
    .get()
}

/**
 * 删除训练记录
 * @param {String} id 记录 ID
 * @returns {Promise}
 */
export const deleteWorkout = (id) => {
  return db.collection('jyb_workouts')
    .doc(id)
    .remove()
}
```

```javascript
// utils/storage.js
const STORAGE_PREFIX = 'jyb_'

/**
 * 保存数据到本地存储
 * @param {String} key 键名
 * @param {any} value 值
 */
export const setStorage = (key, value) => {
  wx.setStorageSync(STORAGE_PREFIX + key, value)
}

/**
 * 从本地存储读取数据
 * @param {String} key 键名
 * @returns {any}
 */
export const getStorage = (key) => {
  return wx.getStorageSync(STORAGE_PREFIX + key)
}

/**
 * 从本地存储删除数据
 * @param {String} key 键名
 */
export const removeStorage = (key) => {
  wx.removeStorageSync(STORAGE_PREFIX + key)
}
```

```javascript
// utils/util.js
/**
 * 格式化日期
 * @param {Number} timestamp 时间戳
 * @returns {String}
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

/**
 * 格式化时间
 * @param {Number} seconds 秒数
 * @returns {String}
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * 生成唯一 ID
 * @returns {String}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
```

---

### 阶段三：数据库操作

#### 1. 数据库设计

**集合设计原则：**
- 每个集合对应一个业务实体
- 必须包含 `_openid` 字段用于权限控制
- 添加 `timestamp` 和 `createTime` 用于排序和追踪

**示例集合结构：**

```javascript
// jyb_workouts - 训练记录集合
{
  _id: String,              // 记录 ID（自动生成）
  _openid: String,          // 用户 OPENID（必须）
  workoutId: String,        // 训练 ID（业务 ID）
  name: String,             // 训练名称
  date: String,             // 训练日期
  duration: String,         // 训练时长
  totalVolume: Number,      // 总训练量
  exercises: Array,         // 动作列表
  timestamp: Number,        // 排序时间戳
  createTime: Number        // 创建时间
}
```

#### 2. 数据库操作封装

```javascript
// utils/db-operations.js
const db = wx.cloud.database()

/**
 * 通用查询方法
 * @param {String} collection 集合名称
 * @param {Object} query 查询条件
 * @param {Number} limit 查询数量
 * @param {Number} skip 跳过数量
 * @param {Object} orderBy 排序条件
 * @returns {Promise}
 */
export const query = async ({
  collection,
  query = {},
  limit = 20,
  skip = 0,
  orderBy = { field: 'createTime', direction: 'desc' }
}) => {
  try {
    let collectionRef = db.collection(collection)

    // 添加查询条件
    if (Object.keys(query).length > 0) {
      collectionRef = collectionRef.where(query)
    }

    // 添加排序
    collectionRef = collectionRef.orderBy(orderBy.field, orderBy.direction)

    // 添加分页
    collectionRef = collectionRef.limit(limit).skip(skip)

    // 执行查询
    const res = await collectionRef.get()
    return {
      success: true,
      data: res.data
    }
  } catch (error) {
    console.error('查询失败：', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 通用插入方法
 * @param {String} collection 集合名称
 * @param {Object|Array} documents 文档数据
 * @returns {Promise}
 */
export const insert = async ({
  collection,
  documents
}) => {
  try {
    const res = await db.collection(collection).add({
      data: Array.isArray(documents) ? documents[0] : documents
    })
    return {
      success: true,
      _id: res._id
    }
  } catch (error) {
    console.error('插入失败：', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 通用更新方法
 * @param {String} collection 集合名称
 * @param {String} id 文档 ID
 * @param {Object} data 更新数据
 * @returns {Promise}
 */
export const update = async ({
  collection,
  id,
  data
}) => {
  try {
    await db.collection(collection).doc(id).update({
      data
    })
    return {
      success: true
    }
  } catch (error) {
    console.error('更新失败：', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 通用删除方法
 * @param {String} collection 集合名称
 * @param {String} id 文档 ID
 * @returns {Promise}
 */
export const remove = async ({
  collection,
  id
}) => {
  try {
    await db.collection(collection).doc(id).remove()
    return {
      success: true
    }
  } catch (error) {
    console.error('删除失败：', error)
    return {
      success: false,
      error: error.message
    }
  }
}
```

#### 3. 通过 MCP 工具测试

```javascript
// 读取数据库
mcp_call_tool('cloudbase', 'readNoSqlDatabaseContent', {
  collectionName: 'jyb_workouts',
  limit: 10,
  sort: '[{"key": "timestamp", "direction": -1}]'
})

// 插入测试数据
mcp_call_tool('cloudbase', 'writeNoSqlDatabaseContent', {
  action: 'insert',
  collectionName: 'jyb_workouts',
  documents: [{
    _openid: 'test-openid',
    name: '测试训练',
    date: '2026/3/22',
    timestamp: Date.now(),
    createTime: Date.now()
  }]
})

// 查询特定记录
mcp_call_tool('cloudbase', 'readNoSqlDatabaseContent', {
  collectionName: 'jyb_workouts',
  query: '{"name": "测试训练"}',
  limit: 1
})
```

---

### 阶段四：测试与调试

#### 1. 前端测试

**测试清单：**
- [ ] 页面加载正常
- [ ] 数据展示正确
- [ ] 交互功能正常
- [ ] 跳转功能正常
- [ ] 样式显示正确
- [ ] 异常处理正常

**测试步骤：**
1. 在微信开发者工具中编译运行
2. 逐个测试页面功能
3. 模拟各种用户操作
4. 测试边界情况
5. 测试异常情况

#### 2. 数据库测试

**测试方法：**
1. 创建测试页面（如 `pages/test-db/`）
2. 添加测试按钮
3. 测试各种数据库操作
4. 验证数据正确性

**测试代码示例：**
```javascript
// pages/test-db/test-db.js
Page({
  async testAdd() {
    const res = await wx.cloud.database()
      .collection('jyb_workouts')
      .add({
        data: {
          name: '测试训练',
          date: '2026/3/22'
        }
      })
    console.log('添加结果：', res)
  },

  async testQuery() {
    const res = await wx.cloud.database()
      .collection('jyb_workouts')
      .get()
    console.log('查询结果：', res)
  }
})
```

#### 3. 云端日志

**日志记录方法：**
```javascript
// 保存日志到数据库
const saveLog = async (logEntry) => {
  try {
    await wx.cloud.database()
      .collection('jyb_test_logs')
      .add({
        data: {
          logEntry,
          timestamp: Date.now(),
          createTime: Date.now()
        }
      })
  } catch (error) {
    console.error('保存日志失败：', error)
  }
}

// 使用日志
await saveLog('✅ 测试通过')
await saveLog('❌ 测试失败：' + error.message)
```

**读取云端日志：**
```javascript
// 读取最新日志
const readLogs = async () => {
  const res = await wx.cloud.database()
    .collection('jyb_test_logs')
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get()
  
  console.table(res.data)
  return res.data
}
```

#### 4. 问题调试

**调试方法：**
1. 使用 `console.log()` 输出调试信息
2. 查看 CloudBase 控制台日志
3. 使用 MCP 工具查询数据库
4. 使用微信开发者工具调试器

**常见问题排查：**

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| OPENID 获取失败 | 云函数返回格式不对 | 检查返回格式，调整优先级 |
| 数据保存失败 | 权限配置错误 | 检查数据库安全规则 |
| 数据查询失败 | 查询条件错误 | 检查查询条件语法 |
| 页面加载慢 | 数据量大 | 添加分页加载 |
| 样式不生效 | 选择器优先级 | 检查样式优先级 |

---

### 阶段五：部署与发布

#### 1. 本地测试完成

**检查清单：**
- [ ] 所有功能测试通过
- [ ] 数据库操作正常
- [ ] UI 效果符合预期
- [ ] 异常处理完善
- [ ] 代码风格统一
- [ ] 注释完整

#### 2. Git 提交

**提交前准备：**
```bash
# 1. 查看修改状态
git status

# 2. 查看具体修改
git diff

# 3. 查看未跟踪文件
git clean -n
```

**提交代码：**
```bash
# 方式一：提交所有修改
git add .
git commit -m "feat: 添加新功能

- 功能描述 1
- 功能描述 2"

# 方式二：提交指定文件
git add file1.js file2.js
git commit -m "fix: 修复问题

- 问题描述
- 解决方案"
```

**提交信息规范：**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**
- `feat` - 新功能
- `fix` - 修复问题
- `docs` - 文档更新
- `style` - 样式修改
- `refactor` - 代码重构
- `perf` - 性能优化
- `test` - 测试相关
- `chore` - 构建/工具相关

**示例：**
```
feat(training): 添加视频录制功能

- 支持录制训练视频
- 视频自动上传到云存储
- 在历史记录中显示视频

Closes #123
```

#### 3. 推送到远程仓库

```bash
# 推送到远程仓库
git push origin <branch-name>

# 推送到指定分支
git push origin claude/new-session-CaYhj

# 强制推送（谨慎使用）
git push -f origin <branch-name>
```

#### 4. 更新文档

**更新项目文档：**
- 更新 `README.md` - 项目说明
- 更新 `CHANGELOG.md` - 变更日志
- 更新相关技术文档

---

## 🏗️ 项目架构

### 目录结构

```
JianBai/
├── app.js                    # 小程序入口
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式
├── sitemap.json              # 站点地图
├── project.config.json       # 项目配置
├── project.private.config.json # 私有配置
├── cloudbaserc.json          # CloudBase 配置
│
├── README.md                 # 项目说明
├── WORKFLOW.md               # 开发流程（本文档）
├── DEVELOPMENT_SUMMARY.md    # 开发经验总结
├── CLOUD_INTEGRATION.md      # CloudBase 集成文档
├── CODEBUDDY.md              # CloudBase AI 规则
│
├── commit.bat                # Git 提交脚本（Windows）
├── .env.local                # 本地环境变量
├── .gitignore                # Git 忽略文件
├── .mcp.json                 # MCP 配置
│
├── pages/                    # 页面目录
│   ├── index/                # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── library/              # 动作库
│   ├── training/             # 训练页面
│   ├── history/              # 历史记录
│   ├── challenges/           # 挑战页面
│   ├── mine/                 # 个人中心
│   └── test-db/              # 数据库测试
│
├── components/               # 组件目录
│   ├── exercise-card/        # 动作卡片组件
│   └── ...                  # 其他组件
│
├── utils/                    # 工具函数
│   ├── db-operations.js      # 数据库操作
│   ├── storage.js            # 本地存储
│   ├── util.js               # 通用工具
│   └── format.js             # 格式化工具
│
├── data/                     # 数据文件
│   └── exercises.js          # 动作库数据
│
├── assets/                   # 静态资源
│   ├── images/               # 图片资源
│   ├── icons/                # 图标资源
│   └── ...                   # 其他资源
│
├── custom-tab-bar/           # 自定义 TabBar
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
│
├── rules/                    # 开发规则
│   ├── ui-design/            # UI 设计规范
│   ├── miniprogram-development/  # 小程序开发规范
│   ├── auth-wechat/          # 认证规范
│   └── ...                   # 其他规则
│
└── cloudfunctions/           # 云函数（如需）
    └── login/                # 登录云函数
```

### 配置文件说明

#### app.json - 全局配置
```json
{
  "pages": [
    "pages/index/index",
    "pages/library/library",
    "pages/training/training",
    "pages/history/history",
    "pages/challenges/challenges",
    "pages/mine/mine"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#FF6B35",
    "navigationBarTitleText": "健身小程序",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "custom": true,
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      }
    ]
  },
  "cloud": true,
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于推荐附近的健身房"
    }
  }
}
```

#### project.config.json - 项目配置
```json
{
  "appid": "your-appid",
  "projectname": "JianBai",
  "libVersion": "2.19.4",
  "compileType": "miniprogram",
  "cloudfunctionRoot": "cloudfunctions/",
  "cloudbaseRoot": "./",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true
  }
}
```

#### cloudbaserc.json - CloudBase 配置
```json
{
  "envId": "your-env-id",
  "$schema": "https://framework-1258016615.tcloudbaseapp.com/schema/latest.json",
  "version": "2.0"
}
```

---

## 📊 功能模块

### 核心功能模块

| 模块 | 页面路径 | 功能描述 | 状态 |
|------|---------|---------|------|
| 首页 | `pages/index/` | 显示训练概况、快捷入口 | ✅ 已完成 |
| 动作库 | `pages/library/` | 浏览和选择训练动作 | ✅ 已完成 |
| 训练 | `pages/training/` | 创建和完成训练 | ✅ 已完成 |
| 历史记录 | `pages/history/` | 查看训练历史 | ✅ 已完成 |
| 挑战 | `pages/challenges/` | 参与健身挑战 | ✅ 已完成 |
| 个人中心 | `pages/mine/` | 用户信息、设置 | ✅ 已完成 |
| 数据库测试 | `pages/test-db/` | 测试数据库操作 | ✅ 已完成 |

### 功能详细说明

#### 1. 首页（index）
- 显示今日训练概况
- 快捷入口到训练、历史、挑战
- 显示最近训练记录
- 显示挑战进度

#### 2. 动作库（library）
- 按肌群分类浏览动作
- 搜索动作功能
- 查看动作详情
- 添加到训练

#### 3. 训练（training）
- 创建新训练
- 添加动作和组数
- 设置重量和次数
- 录制训练视频
- 计算训练量
- 完成训练并保存

#### 4. 历史记录（history）
- 查看训练历史
- 按时间倒序排列
- 查看训练详情
- 删除训练记录
- 导出训练数据

#### 5. 挑战（challenges）
- 查看挑战列表
- 参与挑战
- 每日打卡
- 查看挑战进度

#### 6. 个人中心（mine）
- 显示用户信息
- 统计训练数据
- 查看收藏动作
- 系统设置
- 关于我们

#### 7. 数据库测试（test-db）
- 测试数据库连接
- 测试数据插入
- 测试数据查询
- 查看云端日志

---

## 💾 数据库结构

### 集合列表

| 集合名称 | 用途 | 记录数 | 状态 |
|---------|------|--------|------|
| `jyb_users` | 用户信息 | 1 条 | ✅ 正常 |
| `jyb_workouts` | 训练记录 | 6 条 | ✅ 正常 |
| `jyb_challenges` | 挑战记录 | 1 条 | ✅ 正常 |
| `jyb_favorites` | 收藏动作 | 1 条 | ✅ 正常 |
| `jyb_test_logs` | 测试日志 | 79 条 | ✅ 正常 |

### 集合详细结构

#### jyb_users - 用户信息
```javascript
{
  _id: String,              // 用户 ID（自动生成）
  _openid: String,          // 用户 OPENID（必须）
  nickName: String,         // 昵称
  avatarUrl: String,        // 头像 URL
  gender: Number,          // 性别 0:未知 1:男 2:女
  totalVolume: Number,     // 总训练量
  totalWorkouts: Number,   // 总训练次数
  createTime: Number       // 创建时间
}
```

#### jyb_workouts - 训练记录
```javascript
{
  _id: String,              // 记录 ID（自动生成）
  _openid: String,          // 用户 OPENID（必须）
  workoutId: String,        // 训练 ID（业务 ID）
  name: String,             // 训练名称
  date: String,             // 训练日期
  duration: String,         // 训练时长
  totalVolume: Number,      // 总训练量
  exercises: Array,         // 动作列表
  videos: Object,           // 视频信息（可选）
  timestamp: Number,        // 排序时间戳
  createTime: Number        // 创建时间
}

// exercises 数组项
{
  id: String,               // 动作 ID
  name: String,             // 动作名称
  muscleGroup: String,      // 肌群
  equipment: String,        // 器械
  sets: Array,              // 组数列表
  videos: Array             // 视频列表（可选）
}

// sets 数组项
{
  weight: Number,           // 重量
  reps: Number,             // 次数
  done: Boolean             // 是否完成
}
```

#### jyb_challenges - 挑战记录
```javascript
{
  _id: String,              // 记录 ID（自动生成）
  _openid: String,          // 用户 OPENID（必须）
  challengeId: String,      // 挑战 ID
  type: String,             // 挑战类型（如：30天训练）
  target: Number,           // 目标天数
  current: Number,          // 当前天数
  status: String,           // 状态 active/completed/failed
  checkedDays: Array,       // 打卡日期列表
  startTime: Number,        // 开始时间
  endTime: Number,          // 结束时间
  createTime: Number        // 创建时间
}
```

#### jyb_favorites - 收藏动作
```javascript
{
  _id: String,              // 记录 ID（自动生成）
  _openid: String,          // 用户 OPENID（必须）
  exerciseId: String,       // 动作 ID
  exerciseName: String,     // 动作名称
  muscleGroup: String,      // 肌群
  equipment: String,        // 器械
  createTime: Number        // 创建时间
}
```

#### jyb_test_logs - 测试日志
```javascript
{
  _id: String,              // 日志 ID（自动生成）
  logEntry: String,         // 日志内容
  timestamp: Number,        // 排序时间戳
  createTime: Number        // 创建时间
}
```

---

## ✨ 开发最佳实践

### 1. UI 开发

#### ⚠️ 必须遵循的规则
- ✅ 必须先读 `rules/ui-design/rule.md`
- ✅ 输出设计规范后再写代码
- ✅ 避免通用 AI 美学风格
- ✅ 使用组件化开发

#### UI 设计流程
```javascript
// 1. 读取 UI 设计规范
read_file('rules/ui-design/rule.md')

// 2. 输出设计规范
console.log(`
  ## UI 设计规范
  - Purpose Statement: ...
  - Aesthetic Direction: ...
  - Color Palette: ...
  - Typography: ...
  - Layout Strategy: ...
`)

// 3. 编写 UI 代码
// 根据设计规范编写 WXML 和 WXSS
```

#### 样式最佳实践
```css
/* 使用 CSS 变量 */
page {
  --primary-color: #FF6B35;
  --text-color: #333333;
  --bg-color: #F5F7FA;
}

/* 使用 BEM 命名规范 */
.block {}
.block__element {}
.block--modifier {}

/* 使用 flex 布局 */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 使用统一的间距单位 */
margin: 8px;   /* 小间距 */
margin: 16px;  /* 中间距 */
margin: 24px;  /* 大间距 */
margin: 32px;  /* 超大间距 */

/* 使用统一的圆角 */
border-radius: 8px;   /* 小圆角 */
border-radius: 12px;  /* 中圆角 */
border-radius: 16px;  /* 大圆角 */
```

### 2. 数据库操作

#### 封装数据库操作
```javascript
// ✅ 推荐：封装数据库操作
export const saveWorkout = (data) => {
  return db.collection('jyb_workouts').add({
    data: {
      ...data,
      timestamp: Date.now(),
      createTime: Date.now()
    }
  })
}

// ❌ 不推荐：直接在页面中操作
Page({
  async saveData() {
    await wx.cloud.database().collection('jyb_workouts').add({
      data: {...}
    })
  }
})
```

#### 添加字段验证
```javascript
export const saveWorkout = (data) => {
  // 验证必填字段
  if (!data.name || !data.date) {
    return Promise.reject(new Error('缺少必填字段'))
  }

  // 验证数据类型
  if (typeof data.totalVolume !== 'number') {
    return Promise.reject(new Error('totalVolume 必须是数字'))
  }

  return db.collection('jyb_workouts').add({
    data: {
      ...data,
      timestamp: Date.now(),
      createTime: Date.now()
    }
  })
}
```

#### 添加错误处理
```javascript
export const saveWorkout = async (data) => {
  try {
    const res = await db.collection('jyb_workouts').add({
      data: {
        ...data,
        timestamp: Date.now(),
        createTime: Date.now()
      }
    })

    return {
      success: true,
      _id: res._id
    }
  } catch (error) {
    console.error('保存训练记录失败：', error)
    
    // 降级到本地存储
    try {
      wx.setStorageSync('workout_backup', data)
      console.log('已保存到本地存储')
    } catch (e) {
      console.error('本地存储也失败：', e)
    }

    return {
      success: false,
      error: error.message
    }
  }
}
```

### 3. 认证系统

#### 微信小程序认证
```javascript
// ✅ 微信小程序天然免登录
// 通过云函数获取 OPENID
async _getUserOpenId() {
  try {
    const res = await wx.cloud.callFunction({
      name: 'login',
      data: {}
    })

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
  } catch (error) {
    console.error('获取 OPENID 失败：', error)
    return { OPENID: '' }
  }
}
```

#### 数据隔离
```javascript
// ✅ 使用 _openid 隔离用户数据
export const getUserWorkouts = (openid) => {
  return db.collection('jyb_workouts')
    .where({ _openid: openid })  // 只查询当前用户的数据
    .orderBy('timestamp', 'desc')
    .get()
}

// ❌ 不推荐：不验证用户权限
export const getAllWorkouts = () => {
  return db.collection('jyb_workouts').get()
}
```

### 4. 错误处理

#### 云端操作降级
```javascript
export const saveData = async (data) => {
  try {
    // 尝试保存到云端
    const res = await wx.cloud.database().collection('data').add({
      data
    })
    return res
  } catch (error) {
    console.error('云端保存失败，降级到本地：', error)
    
    // 降级到本地存储
    wx.setStorageSync('data_backup', data)
    return { _id: 'local_backup' }
  }
}
```

#### 用户友好的错误提示
```javascript
Page({
  async loadData() {
    wx.showLoading({ title: '加载中...' })

    try {
      const res = await this._fetchData()
      this.setData({ data: res.data })
    } catch (error) {
      console.error('加载失败：', error)
      
      // 用户友好的错误提示
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none',
        duration: 2000
      })
    } finally {
      wx.hideLoading()
    }
  }
})
```

### 5. 代码风格

#### 命名规范
```javascript
// ✅ 推荐：驼峰命名
const userName = 'John'
const getUserInfo = () => {}
const onSaveData = () => {}

// ❌ 不推荐：下划线命名
const user_name = 'John'
const get_user_info = () => {}
```

#### 注释规范
```javascript
/**
 * 保存训练记录
 * @param {Object} data 训练数据
 * @param {String} data.name 训练名称
 * @param {Number} data.totalVolume 总训练量
 * @returns {Promise<{success: boolean, _id?: string, error?: string}>}
 */
export const saveWorkout = async (data) => {
  // 验证数据
  if (!data.name) {
    throw new Error('缺少训练名称')
  }

  // 保存到数据库
  const res = await db.collection('jyb_workouts').add({
    data: {
      ...data,
      timestamp: Date.now()
    }
  })

  return {
    success: true,
    _id: res._id
  }
}
```

---

## 🧪 测试与调试

### 1. 测试策略

#### 单元测试
```javascript
// 测试数据库操作
describe('数据库操作', () => {
  it('应该成功保存训练记录', async () => {
    const data = {
      name: '测试训练',
      totalVolume: 10000
    }

    const res = await saveWorkout(data)
    expect(res.success).toBe(true)
    expect(res._id).toBeDefined()
  })
})
```

#### 集成测试
```javascript
// 测试完整流程
describe('训练流程', () => {
  it('应该完成整个训练流程', async () => {
    // 1. 开始训练
    await startTraining()
    
    // 2. 添加动作
    await addExercise('卧推')
    
    // 3. 完成训练
    await completeTraining()
    
    // 4. 验证数据
    const workouts = await getWorkouts()
    expect(workouts.length).toBeGreaterThan(0)
  })
})
```

### 2. 调试技巧

#### 使用 console.log
```javascript
// ✅ 推荐：有意义的日志
console.log('开始加载数据，参数：', { page: 1, limit: 10 })
console.log('数据加载成功，数量：', data.length)
console.log('数据加载失败：', error.message)

// ❌ 不推荐：无意义的日志
console.log('test')
console.log(data)
console.log('error')
```

#### 使用 console.table
```javascript
// 以表格形式显示数据
console.table(workouts)

// 按指定字段显示
console.table(workouts, ['name', 'date', 'totalVolume'])
```

#### 使用 console.group
```javascript
console.group('训练详情')
console.log('训练名称：', workout.name)
console.log('训练日期：', workout.date)
console.log('总训练量：', workout.totalVolume)
console.groupEnd()
```

### 3. 性能优化

#### 添加分页加载
```javascript
Page({
  data: {
    workouts: [],
    page: 1,
    limit: 20,
    hasMore: true
  },

  async loadWorkouts() {
    if (!this.data.hasMore) return

    const res = await wx.cloud.database()
      .collection('jyb_workouts')
      .skip((this.data.page - 1) * this.data.limit)
      .limit(this.data.limit)
      .get()

    this.setData({
      workouts: [...this.data.workouts, ...res.data],
      page: this.data.page + 1,
      hasMore: res.data.length >= this.data.limit
    })
  }
})
```

#### 使用缓存
```javascript
const cache = new Map()

export const getWorkouts = async (openid, useCache = true) => {
  // 检查缓存
  if (useCache && cache.has(openid)) {
    return cache.get(openid)
  }

  // 从数据库查询
  const res = await wx.cloud.database()
    .collection('jyb_workouts')
    .where({ _openid: openid })
    .get()

  // 缓存数据
  cache.set(openid, res.data)

  return res.data
}
```

---

## 🚀 部署与发布

### 1. 本地测试完成

#### 测试清单
- [ ] 所有功能测试通过
- [ ] 数据库操作正常
- [ ] UI 效果符合预期
- [ ] 异常处理完善
- [ ] 代码风格统一
- [ ] 注释完整

#### 性能检查
```javascript
// 检查页面加载时间
console.time('页面加载')
// ... 加载数据
console.timeEnd('页面加载')

// 检查内存使用
console.log('内存使用：', performance.memory)
```

### 2. Git 提交

#### 提交前准备
```bash
# 1. 查看修改状态
git status

# 2. 查看具体修改
git diff

# 3. 查看未跟踪文件
git clean -n
```

#### 提交代码
```bash
# 提交所有修改
git add .
git commit -m "feat: 添加新功能"

# 提交指定文件
git add file1.js file2.js
git commit -m "fix: 修复问题"
```

#### 推送到远程仓库
```bash
# 推送到远程仓库
git push origin claude/new-session-CaYhj

# 查看远程分支
git branch -r

# 查看推送状态
git log --oneline -5
```

### 3. 版本发布

#### 版本号规范
```
主版本号.次版本号.修订号 (MAJOR.MINOR.PATCH)

- MAJOR：不兼容的 API 修改
- MINOR：向下兼容的功能性新增
- PATCH：向下兼容的问题修正

示例：
1.0.0 → 1.0.1 (修复问题)
1.0.1 → 1.1.0 (新增功能)
1.1.0 → 2.0.0 (重大更新)
```

#### 发布流程
```bash
# 1. 更新版本号
# app.json
{
  "version": "1.0.1"
}

# 2. 提交版本更新
git add app.json
git commit -m "chore: 更新版本号到 1.0.1"

# 3. 打标签
git tag -a v1.0.1 -m "版本 1.0.1"

# 4. 推送标签
git push origin v1.0.1

# 5. 在微信开发者工具中上传代码
# 点击"上传"按钮，填写版本号和备注
```

---

## 📚 文档资源

### 项目文档

| 文档名称 | 路径 | 说明 |
|---------|------|------|
| 项目说明 | `README.md` | 项目基本信息 |
| 开发流程 | `WORKFLOW.md` | 完整开发流程（本文档） |
| 开发经验总结 | `DEVELOPMENT_SUMMARY.md` | 完整开发经验 |
| CloudBase 集成 | `CLOUD_INTEGRATION.md` | 云开发集成文档 |
| AI 开发规则 | `CODEBUDDY.md` | CloudBase AI 规则 |

### 规则文档

| 规则名称 | 路径 | 说明 |
|---------|------|------|
| UI 设计规范 | `rules/ui-design/rule.md` | UI 设计规则（最高优先级） |
| 小程序开发规范 | `rules/miniprogram-development/rule.md` | 小程序开发规则 |
| NoSQL 数据库规范 | `rules/no-sql-wx-mp-sdk/rule.md` | NoSQL 数据库操作 |
| 认证规范 | `rules/auth-wechat/rule.md` | 微信小程序认证 |
| 云开发平台知识 | `rules/cloudbase-platform/rule.md` | CloudBase 平台知识 |

### 外部资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [微信开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

---

## 🎉 总结

### 开发流程总结

```
1. 环境准备 ✅
   - 安装微信开发者工具
   - 配置 CloudBase 环境
   - 检查项目配置

2. 需求分析 ✅
   - 理解功能需求
   - 识别技术方案
   - 设计数据结构

3. UI 设计 ✅
   - 读取 UI 设计规范
   - 输出设计规范
   - 设计页面界面

4. 代码开发 ✅
   - 开发页面功能
   - 开发组件（如需）
   - 封装工具函数
   - 配置路由

5. 数据库操作 ✅
   - 设计数据库结构
   - 封装数据库操作
   - 使用 MCP 工具测试

6. 测试调试 ✅
   - 前端测试
   - 数据库测试
   - 云端日志
   - 问题调试

7. 部署发布 ✅
   - 本地测试完成
   - Git 提交
   - 推送到远程仓库
   - 版本发布
```

### 最佳实践

1. **UI 开发**：先读规范，后写代码
2. **数据库操作**：封装函数，添加验证
3. **认证系统**：使用 `_openid` 隔离数据
4. **错误处理**：降级策略，用户友好
5. **代码风格**：命名规范，注释完整
6. **测试调试**：单元测试，性能优化
7. **版本管理**：规范提交，语义化版本

### 当前状态

- ✅ 开发环境：完整配置
- ✅ 核心功能：全部实现并测试通过
- ✅ 数据库：5 个集合，功能正常
- ✅ 文档：完整的开发文档
- ✅ Git：代码已提交并推送

---

## 🚀 后续优化建议

### 1. 性能优化
- 添加分页加载
- 优化数据库查询
- 使用缓存策略
- 图片懒加载

### 2. 功能增强
- 添加训练计划功能
- 添加数据统计图表
- 添加社交分享功能
- 添加数据导出功能

### 3. 用户体验
- 添加训练提醒
- 优化加载动画
- 添加夜间模式
- 优化交互反馈

### 4. 代码质量
- 迁移到 TypeScript
- 添加单元测试
- 代码重构优化
- 添加 CI/CD

---

**文档版本**: 1.0.0  
**最后更新**: 2026年3月22日  
**维护者**: Craft AI

---

**祝你开发顺利！💪**
