const {app, BrowserWindow, Menu} = require('electron');
const path = require('node:path');
require('./communication');

const isDevelopment = process.env.NODE_ENV === 'development';

const createWindow = () => {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
      icon: path.resolve(__dirname, './assets/logo.jpeg')
    });
    Menu.setApplicationMenu(null);

    if (isDevelopment) {
        mainWindow.loadURL('http://localhost:8043/')
    } else {
        const entryPath = path.resolve(__dirname, './renderDist/index.html')
        mainWindow.loadFile(entryPath)
        // mainWindow.loadFile('index.html')
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})