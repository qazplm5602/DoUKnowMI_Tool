const { BrowserWindow } = require("electron");
const window = exports.window = undefined;

exports.init = function() {
    let _window = new BrowserWindow({
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
    _window.setMenuBarVisibility(false);
    _window.loadFile("./MainStart/index.html");

    window = _window;
}