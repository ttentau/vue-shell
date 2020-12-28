// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

// 在主进程中
let mainWin

function createMainWindow() {
    mainWin = new BrowserWindow({
        width: 1200,
        height: 900,
        frame: false,//啥都没有了
        // titleBarStyle: 'hiddenInset',//有红绿灯，注：win上无效，mac没验证
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    mainWin.webContents.openDevTools({mode: 'bottom'})

    // mainWin.loadFile('index.html')
    mainWin.loadFile('../dist/index.html')

    // mainWin.webContents.session.on('will-download', (event, item, webContents) => {
    //     console.log('监听到下载了112312312', item)
    // })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createMainWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
