const domiHeader = {};

$(function() {
    $("#header-button-file").click(function(e) {
        contextMenu.show([e.pageX,e.pageY],
            [
                ["저장", () => ipcRenderer.send("project.save", domiDB, SaveFilePath)],
                ["다른 이름으로 저장", () => ipcRenderer.send("project.saveAs", domiDB)],
                ["새로 만들기", () => ipcRenderer.send("MainStart.newStage")],
                ["닫기", window.close],
            ]
        );
    });

    $("#header-button-setting").click(function(e) {
        OpenSettingWindow(true);
    });
});

window.onbeforeunload = function() {
    if (SaveDiff) {
        domiWindow.alertShow("님아", `저장되지 않은 변경사항이 있어요.</br>그래도 종료할까요? </br> <button style="
        background: transparent;
        border: 1px solid rgba(255,255,255,.1);
        color: #fb3e3e;
        font-size: 12px;
        font-weight: 600;
        border-radius: 6px;
        padding: 3px 10px;
        margin-top: 5px;
        cursor: help;
        " onclick="SaveDiff = false; window.close();">진짜 진짜 진짜로 종료하기</button>`);
        return true;
    }
}

ipcRenderer.on("project.saveOK", function(event, path) {
    if (path !== undefined)
        SaveFilePath = path;

    SaveDiff = false;
});