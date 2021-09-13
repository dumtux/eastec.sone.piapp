const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
    const mainWindow = new BrowserWindow({
    width: 440,
    height: 640,
    frame: false,
    webPreferences: {
        preload: path.join(__dirname, 'src/preload.js')
    }
    })
    mainWindow.loadFile('src/index.html')
    // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.allowRendererProcessReuse = false
