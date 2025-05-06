const { app, BrowserWindow } = require('electron');
const path = require('path');
require('./gui');

//Creation of the main window for the browser.
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html')); //Loads index
}

//Electron's app lifecycle initiation.
app.on('ready', createWindow);

//Electron's app lifecycle ending.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

//Ensures if the user re-opens the app (after all windows were closed), 
//a new window is automatically created.
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});