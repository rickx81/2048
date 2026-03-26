---
quick_task: 260326-ncu
title: GitHub Pages CI/CD 设置
created: 2026-03-26
type: infrastructure
status: pending
---

# 快速任务：GitHub Pages CI/CD 设置

## 目标
为 2048 游戏项目设置 GitHub Pages CI/CD，实现自动部署到 GitHub Pages。

## 背景
项目已完成 v1.1 里程碑，需要配置自动化部署流程，使用 GitHub Actions 将项目自动部署到 GitHub Pages。

## 任务

### 1. 创建 GitHub Actions 工作流
- 创建 `.github/workflows/deploy.yml`
- 配置触发条件：push 到 main/master 分支
- 设置 Node.js 环境（匹配项目 engines 要求）
- 配置构建步骤（install + build）
- 配置部署步骤到 GitHub Pages
- **验证**: 工作流文件语法正确

### 2. 更新 Vite 配置
- 配置 `base` 路径为仓库名称
- 确保资源路径正确
- **验证**: 本地构建正常，资源路径正确

### 3. 测试部署
- 推送工作流文件到 GitHub
- 验证 Actions 工作流执行成功
- 验证 GitHub Pages 部署成功
- **验证**: 可通过 GitHub Pages URL 访问应用

## 完成标准
- [x] GitHub Actions 工作流配置完成
- [x] Vite 配置更新（base 路径）
- [x] 部署测试通过
- [x] GitHub Pages 可访问
