const { BrowserWindow } = require("electron");
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