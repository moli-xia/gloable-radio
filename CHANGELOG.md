# Changelog

所有重要变更都会记录在这里。版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [2.0.2] - 2026-06-13

### Added

- 设置页「关于」中的版本号现在会在构建时从 `package.json` 注入（通过 Vite `define`），不再硬编码
- `scripts/bump-version.mjs` 一键同步 `package.json` / Android `versionName` + `versionCode` / iOS `MARKETING_VERSION` + `CURRENT_PROJECT_VERSION`
- `npm run version:bump` 脚本入口，支持 `patch | minor | major | <显式版本>`，可选 `--tag` 一键 commit + 打 tag + push

### Changed

- Android `versionName` 同步到 2.0.2（`versionCode = 4`）
- iOS `MARKETING_VERSION` 同步到 2.0.2（`CURRENT_PROJECT_VERSION = 4`）

## [2.0.1] - 2026-06-13

### Security

- 客户端连接页不再预填本地缓存的后端 URL，避免在 Android / iOS / Windows 三端泄漏私有后端地址
- 客户端打开「服务器设置」时强制走 `?change=1` 显示空表单
- `shell/i18n.js` 中所有占位 URL 改为 `https://your-server.example.com`

### Added

- 当本地缓存了上次连接的服务器时，连接页会显示「使用上次的服务器」按钮一键复用（不显示 URL 本身）
- `stream-proxy` 新增 `/api/radio/*` 反向代理，对 `radio-browser.info` 做粘性轮询失败转移，解决移动网络下首页 "Network error"
- 前端 `radioApi` 将本地 `/api/radio` 列为最高优先级 provider，自动回落到公开镜像

### Fixed

- 移除 GET 请求里多余的 `Content-Type` / `User-Agent`，避免不必要的 CORS 预检
- E2E 脚本 `scripts/e2e-bbc.mjs` 改为读取 `E2E_TARGET` 环境变量，不再硬编码私有域名

## [2.0.0] - 2026-06-13

### Added

- **跨平台 Release 流水线**
  - `.github/workflows/release.yml`：推送 `v*` tag 自动并行编译 Android / iOS / Windows 三端，并发布到 GitHub Release
  - `scripts/release-build.sh` / `scripts/release-publish.sh`：本地一键批量构建 + 上传
- **Android 客户端**：Capacitor + 远程壳模式，支持 14 种语言原生菜单
- **iOS 客户端**：Capacitor + Swift 远程壳，支持服务器切换
- **Windows 客户端**：Electron NSIS 安装包，菜单内提供服务器设置入口
- **多用户登录与云端同步**
  - `stream-proxy` 增加 `/api/auth/*`、`/api/user/data` API
  - 收藏 / 历史 / 语言 / 主题按账号保存到服务端 `data/users/<user>.json`
  - `config/users.example.json` 提供账号配置示例
- **HLS 流代理**：`stream-proxy/` 解决 HTTPS 站点播放 BBC、NHK 等 HLS 电台的 mixed-content 问题
- **electron-builder 完整配置**：`productName`、`asar`、NSIS 桌面快捷方式、产物命名等
