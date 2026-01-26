# 全球电台（GlobalRadio）

这是一个基于 Vue 3 + Vite 的在线电台应用，包含播放、搜索、收藏、历史记录、主题切换与多国语言等功能，并支持 PWA 安装。

支持 Docker 一键部署（推荐）与本地开发运行。

## 功能概览

- 电台搜索（支持中文）
- 分享电台
- 播放控制
- 睡眠定时器
- 收藏与播放历史
- 亮色/暗色主题
- 全球主流语言支持
- 安卓/iphone/PC客户端

## 演示站点
### https://aabb.live

### 现已加入https://kejilion.sh 科技lion的脚本，实现一键安装并配置域名和SSL证书功能。

## 应用截图
![](demo-w.png)
![](demo-b.png)
![](demo-phone.png)

## 目录结构

```text
.
├── src/                 # 前端源码
├── public/              # 静态资源
├── dist/                # 构建产物（Vite build 输出）
├── nginx-static.conf    # 静态站点 Nginx 示例配置
├── nginx.docker.conf    # Docker 镜像内 Nginx 配置
├── Dockerfile           # Docker 构建文件
├── vite.config.ts       # Vite 配置
└── package.json         # 前端依赖与脚本
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

#### ARM/arm64 设备部署

如果你的服务器是 ARM 架构（例如 aarch64 / arm64），请使用 arm64 专用镜像：

```bash
docker pull superneed/global-radio-arm64:latest
docker run -d --name global-radio --restart unless-stopped -p 8080:80 superneed/global-radio-arm64:latest
```

### 方式 B：本地构建镜像并运行（可选）

安装 Docker（Linux 示例；也可使用官方文档的安装方式）：

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
```

构建镜像：

```bash
docker build -t global-radio:latest .
```

运行容器（映射到本机 8080 端口）：

```bash
docker run --rm -p 8080:80 global-radio:latest
```

浏览器访问：
- http://localhost:8080/

建议用于生产的运行方式：

1) 直接运行（前置 8080）：

```bash
docker run -d --name global-radio --restart unless-stopped -p 8080:80 global-radio:latest
```

2) 需要自定义域名与 HTTPS 时：在宿主机用 Nginx / Caddy 做反向代理到 `127.0.0.1:8080`，容器内只负责静态资源服务。

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

## 本地安装与开发

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

浏览器访问：
- http://localhost:4173/

局域网访问（同网段设备）：
- http://<你的电脑IP>:4173/

## 构建与预览

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

浏览器访问：
- http://localhost:4173/

## 生产部署（静态站点）

推荐用 Nginx 直接托管 `dist/`：

1) 构建：

```bash
npm run build
```

2) 部署构建产物（示例）：

```bash
rm -rf /var/www/global-radio/dist
mkdir -p /var/www/global-radio
cp -r dist /var/www/global-radio/dist
```

3) 参考 nginx-static.conf 配置站点 root 指向 `dist/`，然后重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

静态站点要点：
- SPA 路由需要回退到 index.html（nginx-static.conf 已包含示例）
- 建议对静态资源开启缓存（js/css/svg/png 等），对 index.html 关闭缓存，避免更新后仍加载旧版本

## 环境变量

如需环境变量，按 .env.example 创建 `.env`。不需要时可不创建。

## 运维建议

- 生产环境建议使用 Nginx 托管 `dist/`，前端不需要长期运行 Vite 服务。
- 如需临时自测，可用 `npm run preview` 在指定端口提供静态预览。
- 首页“音乐电台/最新电台”列表有内存缓存（默认 5 分钟），刷新按钮会绕过缓存重新拉取数据。

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

确保服务器安全组/防火墙放行对应端口。
