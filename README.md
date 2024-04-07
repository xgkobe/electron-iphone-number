# electron-iphone-number
快速检索手机号

## 开发者须知

### 启动
`yarn || npm i` 安装外层依赖

`npm run start` 启动项目

### 打包
`npm run build` 打包项目



### 项目目录结构

- `communication/`：主进程和渲染进程通信
- `dist/`：打包出可执行的exe
- `datastore/`：lowdb 数据库初始化
- `main.js`：electron 主进程入口文件
- `renderDist`：渲染页面打包出的文件
- `render/`：渲染页面入口文件
  - `config/`：tab 页配置文件
  - `scripts/`：webpack 配置文件
  - `src/`：项目代码