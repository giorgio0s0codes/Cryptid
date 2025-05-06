//This are the imports.

const { ipcMain, dialog } = require('electron');
const path = require('path');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');


//Calls encrypt function.
ipcMain.handle('encrypt', async (event, filePath, outputImageFileName, outputKeyFileName) => {
    // object name "e" is the filepath.
    await encrypt({ e: filePath, o: outputImageFileName, p: outputKeyFileName });
});

//Calls decrypt function.
ipcMain.handle('decrypt', async (event, filePath, keyPath, outputImageFileName) => {
    // object name "d" is the filepath.
    await decrypt({ d: filePath, k: keyPath, o: outputImageFileName });
});

//Opens "open-file" file dialog.
ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });
    return result.filePaths[0];
});

//Opens "save-file" file dialog.
ipcMain.handle('save-file-dialog', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog({ defaultPath });
    return result.filePath;
});