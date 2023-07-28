const { BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const project = require("./Project.js");

exports.window = undefined;

exports.init = function() {
    exports.window = new BrowserWindow({
        width: 1300,
        height: 740,
        minWidth: 1000,
        minHeight:670,
        resizable: false,
        autoHideMenuBar: true,
        center: true,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    exports.window.setMenuBarVisibility(false);
    exports.window.loadFile("./MainStart/index.html");

}

ipcMain.on("MainStart.openStage", OpenStageFile);
ipcMain.on("MainStart.newStage", NewStage);

async function OpenStageFile() {
    const result = await dialog.showOpenDialog(exports.window, {
        title: "domiDB 불러오기",
        buttonLabel: "불러오기 알아요.",
        filters: [
            { name: 'domiDB', extensions: ['json'] }
        ]
    });

    if (result.canceled === true) return;
    
    const path = result.filePaths[0];
    fs.readFile(path, (err, data) => {
        if (err) {
            dialog.showErrorBox("스테이지 불러올 수 없음", "파일을 읽을 수 없습니다.");
            return;
        }

        try {
            data = JSON.parse(data);
        } catch {
            dialog.showErrorBox("스테이지 불러올 수 없음", "스테이지 파일이 손상되었습니다.");
            return;
        }
        
        // 무결성 검사
        if (typeof(data.projectName) !== "string" || typeof(data.size) !== "number" || typeof(data.player) !== "object" || typeof(data.data) !== "object") {
            dialog.showErrorBox("스테이지 불러올 수 없음", "무결성 검사를 실패하였습니다.");
            return;
        }
        if (data.size < 2) {
            dialog.showErrorBox("domi File System Detect!", "hey bro, what r u THAT??? ＼（〇_ｏ）／");
            return;
        }

        exports.window.close();
        exports.window = undefined;

        // 창 열기
        const projectWindow = project.Add();
        projectWindow.webContents.once("did-finish-load", function() {
            projectWindow.webContents.send("project.openStage", path, data);
        });
    });
}

async function NewStage() {
    if (exports.window) {
        exports.window.close();
        exports.window = undefined;
    }

    // 창 열기
    const projectWindow = project.Add();
    projectWindow.webContents.once("did-finish-load", function() {
        projectWindow.webContents.send("project.openSetting");
    });
}