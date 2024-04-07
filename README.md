# electron-iphone-number
快速检索手机号

## 开发者须知

### 启动
`yarn || npm i` 安装外层依赖

`npm run start` 启动项目

### 打包
`npm run build` 打包项目

#### 文件：
1.文件命名统一驼峰，引用和实际文件名大小写保持一致

2.主进程，目录结构
└──main 主进程入口
└──communication 主进程和渲染进程通信
└──datastore 数据初始化
└──dist 打包出可执行的exe
└──renderDist 渲染进程打包出的文件

3.render渲染进程，目录结构
└──components
└──pages
	├──Black 黑名单管理 
	├──Search 批量查询


项目目录结构：

- `src/`：存放项目的源代码文件
  - `components/`：存放可复用的组件
    - `header/`：头部组件
      - `header.js`：头部组件的逻辑代码
      - `header.css`：头部组件的样式文件
    - `footer/`：底部组件
      - `footer.js`：底部组件的逻辑代码
      - `footer.css`：底部组件的样式文件
  - `pages/`：存放各页面的入口文件
    - `home/`：首页页面
      - `index.js`：首页页面的逻辑代码
    - `about/`：关于页面
      - `index.js`：关于页面的逻辑代码
- `public/`：存放公共资源文件
  - `index.html`：项目的入口 HTML 文件
- `package.json`：项目的依赖配置文件
- `README.MD`：项目的说明文档
