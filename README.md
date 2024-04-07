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
