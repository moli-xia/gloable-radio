# 全球电台（GlobalRadio）

这是一个基于 Vue 3 + Vite 的在线电台应用，包含播放、搜索、收藏、历史记录、主题切换与多国语言等功能，并支持 PWA 安装。

除 Web 版本外，仓库还内置了**多用户登录与云端同步**、**HLS 流代理后端**，以及 **Android / iOS / Windows 客户端**，可单独使用也可一起部署。

支持 Docker 一键部署（推荐）与本地开发运行。

## 功能概览

- 电台搜索（支持中文）
- 分享电台
- 播放控制
- 睡眠定时器
- 收藏与播放历史
- 亮色/暗色主题
- 全球主流语言支持
- Android / iPhone / Windows 客户端
- 多用户登录，收藏 / 历史 / 语言 / 主题云端同步
- BBC、NHK 等 HLS 电台在 HTTPS 站点的播放支持（内置 stream-proxy）

## 演示站点

### https://aabb.live

### 现已加入 https://kejilion.sh 科技 lion 的脚本，实现一键安装并配置域名和 SSL 证书功能。

## 应用截图

![](demo-w.png)
![](demo-b.png)
![](demo-phone.png)

## 目录结构

```text
.
├── src/                    # 前端源码（Vue 应用）
├── shell/                  # 客户端壳页面（输入后台 URL）
├── stream-proxy/           # 后端：流代理 + 认证 + 用户数据 API
├── config/                 # 部署配置示例（users.example.json）
├── android/                # Android Capacitor 工程
├── ios/                    # iOS Capacitor 工程
├── desktop/                # Windows Electron 桌面壳
├── scripts/                # 构建 / 发布 / 版本同步脚本
├── .github/workflows/      # 三端自动构建 + 发布工作流
├── dist/                   # Web 构建产物（npm run build）
├── nginx-static.conf       # 静态站点 Nginx 示例配置
├── nginx.docker.conf       # Docker 镜像内 Nginx 配置
├── Dockerfile              # Docker 构建文件
├── vite.config.ts          # Vite 配置
└── package.json
```

## Docker 部署

适用场景：不想安装 Node.js，只想用容器快速部署；或者希望用 Nginx 直接提供静态站点服务。

### 方式 A：Docker Hub 一键部署（推荐）

```bash
docker pull superneed/global-radio:latest
docker run -d --name global-radio --restart unless-stopped -p 8080:80 superneed/global-radio:latest
```

浏览器访问：

- http://localhost:8080/

#### ARM / arm64 设备部署

如果你的服务器是 ARM 架构（例如 aarch64 / arm64），请使用 arm64 专用镜像：

```bash
docker pull superneed/global-radio-arm64:latest
docker run -d --name global-radio --restart unless-stopped -p 8080:80 superneed/global-radio-arm64:latest
```

### 方式 B：本地构建镜像并运行

```bash
docker build -t global-radio:latest .
docker run -d \
  --name global-radio \
  --restart unless-stopped \
  -p 8080:80 \
  -v ./data/users:/app/stream-proxy/data/users \
  -v ./config/users.json:/app/stream-proxy/config/users.json:ro \
  global-radio:latest
```

镜像内包含两部分：

- **Nginx**：托管 `dist/` 静态前端
- **stream-proxy**：HLS 代理、`/api/auth/*`、`/api/user/data`

需要自定义域名与 HTTPS 时，在宿主机用 Nginx / Caddy 做反向代理到 `127.0.0.1:8080`。

### 用户账号配置

```bash
mkdir -p config data/users
cp config/users.example.json config/users.json
```

编辑 `config/users.json`，按 `{ "username": "...", "password": "..." }` 格式添加账号。修改后**无需重启容器**，下次登录时会重新读取。

> 注意：请勿将真实 `config/users.json` 提交到 Git。仓库仅保留 `config/users.example.json` 示例。

### 数据持久化

| 挂载路径 | 作用 |
|---|---|
| `./data/users` | 各用户的收藏 / 历史 / 设置 JSON |
| `./config/users.json` | 多用户账号密码（明文，部署侧自行保管） |

更新部署（Docker）：

```bash
docker build -t global-radio:latest .
docker rm -f global-radio || true
docker run -d --name global-radio --restart unless-stopped -p 8080:80 global-radio:latest
```

## 获取源码

```bash
git clone https://github.com/moli-xia/global-radio.git
cd global-radio
```

## 环境要求

- Node.js 18+（推荐 18 LTS）
- npm 9+（建议使用 `npm ci`）
- Docker 20+（仅 Docker 部署需要）
- Android Studio + Android SDK（打 Android APK，可选）
- macOS + Xcode（打 iOS 包，可选）
- Windows 或装好 wine 的 Linux（打 Windows 安装包，可选）

## 本地安装与开发

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

浏览器访问：

- http://localhost:4173/

局域网访问（同网段设备）：

- http://&lt;你的电脑IP&gt;:4173/

## 构建与预览

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## 多用户登录与数据同步

1. 打开站点后会进入登录页
2. 登录成功后，收藏 / 播放历史 / 语言 / 主题会同步到服务端
3. 在「设置 → 账号」可修改密码、退出登录
4. 切换账号时会清空本地缓存并从服务端拉取对应用户数据

相关 API：

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `GET / PUT /api/user/data`

## stream-proxy

`stream-proxy/` 同时承担三件事：

| 路径前缀 | 作用 |
|---|---|
| `/stream-proxy/*` | 代理 BBC / NHK 等 HLS 流，解决 HTTPS 页面播放 HTTP 流的 mixed-content 问题 |
| `/api/auth/*`, `/api/user/data` | 多用户登录与云端数据同步 |
| `/api/radio/*` | 反向代理 `radio-browser.info`，避免移动网络下直连失败的「Network error」 |

`/api/radio/*` 默认在多个公开节点之间做粘性轮询失败转移，超时可通过环境变量 `RADIO_TIMEOUT_MS` 调整（默认 8 秒）。

## 客户端（Android / iOS / Windows）

三个客户端都采用**远程壳**模式：

1. 启动后先显示 `shell/` 连接页，输入后台 URL（如 `https://global-radio.example.com`）
2. 连接成功后跳转到远程 Web 应用
3. 在远程站点完成登录、收听、收藏同步
4. 需要换服务器时，通过原生菜单「服务器设置」回到壳页

| 平台 | 换服务器入口 | 构建命令 |
|---|---|---|
| Android | 右上角「服务器设置」 | `npm run android:build` → Android Studio 或 `npm run apk:release` |
| iOS | 顶部「服务器设置」 | `npm run ios:build` → macOS 上 `pod install` + Xcode |
| Windows | 菜单「应用 → 服务器设置」 | `npm run desktop:dev` 调试；`npm run desktop:pack:win`（x64 NSIS） |

> 出于安全考虑，连接页**不会**预填上次保存的后端 URL；如果本地有记录，会显示一个「使用上次的服务器」按钮一键复用，URL 本身不会暴露在界面里。

## 一键三端 Release 构建

仓库提供两种构建发布方式：

### 本地批量构建

```bash
npm run release:build             # 编译所有可用平台 → release/
npm run release:build android     # 仅 Android
npm run release:build windows     # 仅 Windows
npm run release:build ios         # 仅 iOS（需要 macOS + Xcode + CocoaPods）

npm run release:publish           # 通过 gh CLI 上传 release/ 到 GitHub Release
```

产物命名：

- `release/GlobalRadio-v<version>.apk`
- `release/GlobalRadio-<version>.ipa`
- `release/GlobalRadio_<version>_x64-setup.exe`

### GitHub Actions 自动构建

`.github/workflows/release.yml` 在以下两种情况下会自动并行编译三端并发布到 GitHub Release：

- 推送 `v*` 形式的 tag（例如 `git push origin v2.0.3`）
- 在 Actions 页面手动选择 `Release` 工作流并 `Run workflow`

工作流四个 Job：`android`（Ubuntu）、`ios`（macos-14，未签名 IPA）、`windows`（Windows-latest）、`publish`（Ubuntu，聚合产物并创建 Release）。

### 版本号一键同步

应用内「设置 → 关于」显示的版本号会在构建时从 `package.json` 注入，并随 release tag 一同更新。需要发新版时只要：

```bash
npm run version:bump -- patch        # 2.0.3 → 2.0.4
npm run version:bump -- minor        # 2.0.3 → 2.1.0
npm run version:bump -- major        # 2.0.3 → 3.0.0
npm run version:bump -- 2.5.0        # 显式指定

npm run version:bump -- patch --tag  # 同时 commit + 打 tag + 推送，CI 自动出包
```

脚本会同步以下三处版本号：

- `package.json`（Web 端 / Electron 显示）
- `android/app/build.gradle`（`versionName` 与自增 `versionCode`）
- `ios/App/App.xcodeproj/project.pbxproj`（`MARKETING_VERSION` 与自增 `CURRENT_PROJECT_VERSION`）

## 多语言

Web 端支持 14 种语言：中文、English、Español、Français、Deutsch、日本語、한국어、Русский、العربية、Português、Italiano、हिन्दी、ไทย、Tiếng Việt。

- Web：设置页或顶栏语言切换，键名保存在用户云端数据中
- Shell：连接页自带语言选择器
- Android / iOS 原生菜单：跟随系统语言（Android 已提供 14 套 `values-*` 文案）

## 生产部署（静态站点，无 Docker）

如果仅需要 Web 端（不需要多用户登录与 stream-proxy），可直接托管 `dist/`：

```bash
npm run build
```

参考 `nginx-static.conf` 配置 Nginx，注意 SPA 路由需要回退到 `index.html`。

静态站点要点：

- SPA 路由需要回退到 index.html（nginx-static.conf 已包含示例）
- 建议对静态资源开启缓存（js/css/svg/png 等），对 index.html 关闭缓存，避免更新后仍加载旧版本

## 环境变量

如需环境变量，按 `.env.example` 创建 `.env`。不需要时可不创建。

stream-proxy 支持的环境变量：

| 变量 | 默认 | 说明 |
|---|---|---|
| `PORT` | `3001` | stream-proxy 监听端口 |
| `RADIO_TIMEOUT_MS` | `8000` | `/api/radio/*` 单次上游请求超时（毫秒） |
| `USERS_FILE` | `config/users.json` | 用户账号密码文件路径 |
| `USER_DATA_DIR` | `data/users` | 用户云端数据存储目录 |

## 运维建议

- 生产环境建议使用 Docker 或 Nginx 托管 `dist/`，前端不需要长期运行 Vite 服务
- 首页"音乐电台 / 最新电台"列表有内存缓存（默认 5 分钟），刷新按钮会绕过缓存重新拉取数据
- 修改 `users.json` 后无需重启容器；用户数据文件位于挂载卷 `data/users/`

## 常见问题：无法访问

1) 先确认 dist 是否存在且有 index.html：

```bash
npm run build
ls -la dist/
```

2) 如果使用 nginx-static.conf：

- 该配置默认使用 80 端口提供静态站点服务，不依赖 HTTPS 证书
- 修改 server_name 与 root 路径后，重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

3) 如果用 `npm run preview`：

```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

确保服务器安全组 / 防火墙放行对应端口。

## 常见问题：其他

### BBC / NHK 等 HLS 无法播放

确认站点走 HTTPS，且容器内 `stream-proxy` 正常运行；前端会通过 `/stream-proxy/` 拉流。直接 Nginx 静态托管（无 Docker）模式下没有 stream-proxy，BBC HLS 会因为 mixed-content 被浏览器拦截。

### 首页提示 Network error

通常是手机网络下直连 `radio-browser.info` 失败。已部署 stream-proxy 后会自动走 `/api/radio/*` 反向代理；如果你是纯静态部署，可改用 `radio-browser.info` 的镜像列表或自行加 CORS 代理。

### 收藏丢失

请确认已登录账号；未登录时数据仅保存在浏览器本地。登录后会与服务端同步。

### Android 构建提示 SDK not found

设置 `ANDROID_HOME` 或在 `android/local.properties` 中指定：

```properties
sdk.dir=/path/to/Android/Sdk
```
