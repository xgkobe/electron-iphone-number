const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const {app} = require('electron');
const fs = require('fs-extra');
const path = require('path');


const STORE_PATH = app.getPath('userData') // 获取electron应用的用户目录
console.log('存储地址', STORE_PATH);
if (!fs.pathExistsSync(STORE_PATH)) { // 如果不存在路径
    fs.mkdirpSync(STORE_PATH) // 就创建
  }

const adapter = new FileSync(path.join(STORE_PATH, '/data.json')); // 数据存储在文件中
// const adapter = new FileSync('./data.json'); // 数据存储在文件中
const db = low(adapter);
db.defaults({phone: []})
  .write();
module.exports=db // 暴露出去