ipcRenderer.once("project.openStage", function(event, path, data) {
    domiDB.projectName = data.projectName;
    domiDB.size = data.size;
    domiDB.player = data.player;
    domiDB.data = data.data;

    SaveFilePath = path;
    
    blockSys.Init();
});

ipcRenderer.once("project.openSetting", function() {
    domiWindow.alertShow("어서오세요!", "암튼 셋팅창...");
});