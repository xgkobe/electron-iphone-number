const {ipcMain, app} = require('electron');
const {forEach, some, filter} = require('lodash');
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const fs = require('fs');
const db =require('../datastore');
// 条件查询
ipcMain.on('search-data', (event, data = {}) => {
    const dbData = db.get('phone').value();
    const newDbData = filter(dbData, (value = {}) => {
        const keys = Object.getOwnPropertyNames(data);
        return keys.every(key => {
                if (String(value[key])?.includes(data[key]) ) {
                    return true;
                } else {
                    return false;
                }
            });
    });
    setTimeout(() => {
        event.sender.send('search-data', newDbData);
    }, 500)
});

// 查询全部
ipcMain.on('search-all-data', (event, data) => {
    const dbData = db.get('phone').value();
    setTimeout(() => {
        event.sender.send('search-all-data', dbData);
    }, 500)
});

// 批量插入
ipcMain.on('add-batch-data', (event, data) => {
    const dbData = db.get('phone').value();
    forEach(data, item => {
        if (!some(dbData, item)) {
            db.get('phone').push({...item, id: uuidv4()}).write();
        }
    })
    setTimeout(() => {
        event.sender.send('add-batch-data', 'success');
    }, 500)
});

// 单条插入
ipcMain.on('add-data', (event, data) => {
    db.get('phone').push({
        ...data,
        id: uuidv4(),
    }).write()
    setTimeout(() => {
        event.sender.send('add-data', 'error');
    }, 500)
});

// 清空
ipcMain.on('clear-data', (event, data) => {
    db.get('phone').remove().write();
    setTimeout(() => {
        event.sender.send('clear-data', 'success');
    }, 500);
});

// 单条删除
ipcMain.on('delete-one-data', (event, id) => {
    const dbData = db.get('phone').remove(item => item.id === id).write();
    event.sender.send('delete-one-data', dbData);
});

// 单条修改
ipcMain.on('update-data', (event, data) => {
    const dbData = db.get('phone').find(item => item.id === data.id).assign(data).write();
    event.sender.send('update-data', dbData);
});

// 批量查询
ipcMain.on('search-batch-data', (event, data) => {
    const dbData = db.get('phone').value();
    let values = [];
    forEach(data, item => {
        let filterData = filter(dbData, {'号码': item['对方号码']});
        filterData = filterData.map(it => {
            return {
                '号码': it['号码'],
                '名称': filterData.pop()['名称'],
                '通信类型': item['通信类型'],
                '通话时间': item['起始时间'],
                '通信时长': item['通信时长'],
            }
        })
        values = values.concat(filterData);
    })
    event.sender.send('search-batch-data', values);
});

ipcMain.on('download-xlsx-template', (event, {data, name}) => {
  const filePath = path.join(app.getPath('desktop'), `${name}.xlsx`);
    console.log(filePath);
  fs.writeFile(filePath, data, 'binary', (err) => {
      event.sender.send('download-success', filePath);
  });
});