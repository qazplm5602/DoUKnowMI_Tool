const hotkey = {
    isCtrl: false,
    CtrlLock: false
}

$(document).keydown(function(e) {
    if (e.keyCode === 17) {
        hotkey.isCtrl = true;
    }

    if (hotkey.isCtrl && !hotkey.CtrlLock) {
        switch (e.keyCode) {
            case 83: // 저장 단축키
                ipcRenderer.send("project.save", domiDB, SaveFilePath);
                hotkey.CtrlLock = true;
                break;
            case 78: // 새 프로젝트 단축키
                ipcRenderer.send("MainStart.newStage");
                hotkey.CtrlLock = true;
                break;
            default:
                break;
        }
    }
});

$(document).keyup(function(e) {
    if (e.keyCode === 17) {
        hotkey.isCtrl = false;
        hotkey.CtrlLock = false;
    }
});