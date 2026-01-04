# 全球电台（radio.aabb.live）

这是一个基于 Vue 3 + Vite 的在线电台应用，包含播放、搜索、收藏、历史记录、主题切换与多语言等功能，并支持 PWA 安装。

本项目仅保留这一份说明文档（README.md），用于部署、运维与开发。

## 目录结构

```text
.
├── src/                 # 前端源码
├── public/              # 静态资源
├── dist/                # 构建产物（Vite build 输出）
├── nginx-static.conf    # 静态站点 Nginx 示例配置
├── vite.config.ts       # Vite 配置
└── package.json         # 前端依赖与脚本
```

## 本地开发

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

浏览器访问：
- http://localhost:4173/

## 构建与预览

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## 生产部署（静态站点）

推荐用 Nginx 直接托管 `dist/`：

1) 构建：

```bash
npm run build
```

2) 参考 nginx-static.conf 配置站点 root 指向 `dist/`，然后重载 Nginx。

## 环境变量

如需环境变量，按 .env.example 创建 `.env`。不需要时可不创建。

## 运维建议

- 生产环境建议使用 Nginx 托管 `dist/`，前端不需要长期运行 Vite 服务。
- 如需临时自测，可用 `npm run preview` 在指定端口提供静态预览。

## Docker 部署

构建镜像：

```bash
docker build -t radio-aabb-live:latest .
```

运行容器（映射到本机 8080 端口）：

```bash
docker run --rm -p 8080:80 radio-aabb-live:latest
```

浏览器访问：
- http://localhost:8080/

## GitHub 托管

1) 初始化本地 Git 仓库并提交：

```bash
git init
git config user.name "moli-xia"
git config user.email "yangbinbai@gmail.com"
git add .
git commit -m "Initial commit"
```

2) 在 GitHub 上新建仓库（例如：radio-aabb-live），然后添加远程并推送：

```bash
git branch -M main
git remote add origin https://github.com/moli-xia/radio-aabb-live.git
git push -u origin main
```

如需命令行认证，推荐使用 GitHub Personal Access Token（PAT）或 SSH Key，不要使用账号密码。

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
