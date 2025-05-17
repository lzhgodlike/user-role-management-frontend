# 用户角色管理系统前端

## 项目介绍

这是一个基于Vue.js和Vite开发的用户角色管理系统前端，提供用户注册、登录和角色管理等功能的界面。

> **注意**: 完整的项目文档请查看[文档仓库](https://github.com/lzhgodlike/user-role-management-docs)。

## 技术栈

- Vue 3 (组合式API)
- Vue Router (路由管理)
- Pinia (状态管理)
- Element Plus (UI组件库)
- Vite (构建工具)
- SCSS (样式预处理器)
- Fetch API (网络请求)

## 功能特性

- 用户注册与登录表单（带验证）
- 用户角色管理界面，包含：
  - 角色列表展示与搜索
  - 添加新角色功能
  - 编辑已有角色信息
  - 启用/禁用角色状态
  - 删除角色（带确认对话框）
- 响应式设计
- 全局状态管理
- 动态路由导航
- HTTP请求封装
- 表单验证

## 安装与运行

### 前置条件

- Node.js 14+
- npm 6+ 或 yarn 1.22+

### 步骤

1. 克隆项目到本地

```bash
git clone https://github.com/lzhgodlike/user-role-management-frontend.git
cd user-role-management-frontend
```

2. 安装依赖

```bash
npm install
# 或
yarn
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

应用将在 `http://localhost:5173` 启动。

4. 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件将位于 `dist` 目录。

## 项目结构

```
src/
├── App.vue               - 应用入口组件
├── main.js               - 应用入口文件
├── router/               - 路由配置
│   └── index.js          - 路由定义和导航守卫
├── stores/               - Pinia 状态管理
│   └── user.js           - 用户身份验证和信息存储
├── styles/               - 全局样式
│   └── theme.scss        - 主题变量和样式定义
├── utils/                - 工具函数
│   └── request.js        - Fetch API封装的HTTP请求工具
└── views/                - 页面组件
    ├── Login.vue         - 登录页面
    ├── Register.vue      - 注册页面
    └── UserRole.vue      - 用户角色管理页面
```

## 配置后端 API

在 `src/utils/request.js` 文件中配置后端 API 地址：

```javascript
// 基础URL，如需修改为其他地址，只需更改此处
const BASE_URL = '/api';
```

应用运行时会自动处理API请求，关键功能包括：
- 自动添加认证头（Bearer Token）
- 处理全局错误（包括401未授权）
- JSON转换
- 查询参数处理

## 组件介绍

### Login.vue
登录页面，包含表单验证和用户登录逻辑，使用Pinia store进行状态管理。

### Register.vue
注册页面，提供新用户注册功能，同样带有表单验证。

### UserRole.vue
用户角色管理页面，核心功能组件，提供完整的角色CRUD操作：
- 角色列表展示
- 通过名称搜索角色
- 添加新角色
- 编辑现有角色
- 启用/禁用角色
- 删除角色

## 协作与贡献

欢迎提交问题和合并请求。

## 部署指南

### 开发环境部署

项目开发环境下使用Vite的开发服务器，自带热重载功能，适合开发阶段使用。

### 生产环境部署

1. 构建生产版本

```bash
npm run build
# 或
yarn build
```

2. 部署静态文件

构建完成后，`dist` 目录包含所有静态资源，可以部署到任何静态服务器：

- Nginx示例配置:

```nginx
server {
    listen 80;
    server_name yoursite.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求到后端服务
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 环境变量配置

项目支持通过`.env`文件配置环境变量：

1. 创建`.env.development`文件用于开发环境:

```
VITE_API_BASE_URL=/api
```

2. 创建`.env.production`文件用于生产环境:

```
VITE_API_BASE_URL=https://你的生产后端地址/api
```

## 开发规范

- 组件使用Vue 3组合式API (Composition API)
- 状态管理使用Pinia
- HTTP请求使用封装的Fetch API
- 样式使用SCSS预处理器

## 许可证

本项目使用 MIT 许可证，详情请参阅 [LICENSE](./LICENSE) 文件。
