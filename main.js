const { app, BrowserWindow } = require("electron");

if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
}

app.whenReady().then(() => {

});

app.on('second-instance', () => {
});

app.once("window-all-closed", () => app.quit());