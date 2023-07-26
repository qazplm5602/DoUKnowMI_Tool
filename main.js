const { app, BrowserWindow } = require("electron");

if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
}

const mainStart = require("./scripts/MainStart.js");
app.whenReady().then(() => {
    mainStart.init();
});

app.on('second-instance', () => {
});

app.once("window-all-closed", () => app.quit());