@echo off
echo 开始 Git 提交...
echo.

echo 添加所有修改...
git add .
if errorlevel 1 (
    echo 添加文件失败！
    pause
    exit /b 1
)

echo.
echo 提交修改...
git commit -m "添加开发经验总结文档和修复 OPENID 获取问题

- 创建 DEVELOPMENT_SUMMARY.md 记录完整的开发经验
- 修复 _getUserOpenId() 方法，优先检查 userInfo.openId
- 调整 OPENID 获取优先级：userInfo.openId > OPENID > openid
- 添加云端日志保存功能，便于调试和测试
- 添加'读取云端日志'按钮到测试页面
- 通过 MCP 工具完成数据库功能自动化测试
- 验证所有核心功能正常：训练记录、挑战、收藏
- 技术总结包含：项目概述、核心功能、难点分析、代码片段"

if errorlevel 1 (
    echo 提交失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo 提交成功！
echo ========================================
echo.
echo 如果需要推送到远程仓库，请执行：
echo   git push origin claude/new-session-CaYhj
echo.
pause
