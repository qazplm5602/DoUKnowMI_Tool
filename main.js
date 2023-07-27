const { app, BrowserWindow, dialog } = require("electron");

if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
}

const mainStart = require("./scripts/MainStart.js");
const project = require("./scripts/Project.js");

app.whenReady().then(() => {
    mainStart.init();
    project.Add();
});

app.on('second-instance', () => {
});

app.once("window-all-closed", () => app.quit());