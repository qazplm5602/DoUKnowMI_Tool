const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const mainStart = require("./MainStart.js");
const fs = require("fs");
exports.windows = [];

exports.Add = function() {
    let window = new BrowserWindow({
        width: 1300,
        height: 740,
        minWidth: 1000,
        minHeight:670,
        autoHideMenuBar: true,
        center: true,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    window.setMenuBarVisibility(false);
    window.loadFile("./Project/index.html");

    window.once("closed", function() {
        const windowIndex = exports.windows.indexOf(window);
        if (windowIndex > -1)
            exports.windows.splice(windowIndex, 1);

        if (exports.windows.length === 0 && mainStart.window === undefined) {
            mainStart.init();
        }
    });
    exports.windows.push(window);

    return window;
}

ipcMain.on("project.save", async function(event, data, path) {
    if (data === undefined) return;
    if (path === undefined || !fs.existsSync(path)) {
        path = await ShowSaveAs()
        if (path.canceled === true) return;
        path = path.filePath;
    }

    const window = exports.windows.find((win) => win.webContents.id === event.sender.id);
    SaveFile(path, data, window);
});

ipcMain.on("project.saveAs", async function(event, data) {
    const result = await ShowSaveAs();
    if (result.canceled === true) return;

    SaveFile(result.filePath, data);
});

async function ShowSaveAs() {
    const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
        title: '저 아세요? DB 저장',
        defaultPath:"domiStageDB",
        buttonLabel: "저장 아세요?",
        filters: [
            { name: 'domiDB', extensions: ['json'] }
        ]
    });

    return result;
}

function SaveFile(path, data, window) {
    fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
    
    if (window !== undefined)
        window.webContents.send("project.saveOK", path);
}