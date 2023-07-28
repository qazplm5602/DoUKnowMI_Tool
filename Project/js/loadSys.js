ipcRenderer.once("project.openStage", function(event, path, data) {
    domiDB.projectName = data.projectName;
    domiDB.size = data.size;
    domiDB.player = data.player;
    domiDB.data = data.data;

    SaveFilePath = path;
    
    blockSys.Init();
});

ipcRenderer.once("project.openSetting", () => OpenSettingWindow());

function OpenSettingWindow(already) {
    domiWindow.show(!already ? "어서오세요!" : "설정", `
        <div class="welcome-text">프로젝트 이름</div>
        <input class="welcome-input" id="welcome-name" value="저 아세요?" type="text">

        <div class="welcome-text">크기</div>
        <input class="welcome-input" id="welcome-size" value="4" type="number">

        <div class="welcome-text">플레이어 위치</div>
        <span class="welcome-text">X</span>
        <input class="welcome-input" id="welcome-coord-x" value="0" type="number">
        <span class="welcome-text">Y</span>
        <input class="welcome-input" id="welcome-coord-y" value="0" type="number">

        <div class="welcome-error"></div>

        <button class="welcome-button">설정 적용</button>
    `);
    
    if (already) {
        $("#welcome-name").val(domiDB.projectName);
        $("#welcome-size").attr("disabled", true).attr("type", "text").css("color", "gray").val("변경 불가");
        $("#welcome-coord-x").val(domiDB.player[0]);
        $("#welcome-coord-y").val(domiDB.player[1]);
    }

    let CloseDetect
    if (!already)
        CloseDetect = setInterval(() => {
            if ($(".window-main").css("display") === "none") {
                SaveDiff = false;
                window.close();
            }
        }, 1);

    const SettingHandler = function() {
        const name = $("#welcome-name").val();
        let size = Number($("#welcome-size").val());
        const [x,y] = [Number($("#welcome-coord-x").val()), Number($("#welcome-coord-y").val())];


        if (name.length === 0) {
            $(".welcome-error").text("프로젝트 이름을 입력해야 합니다.");
            return;
        }
        
        if (already) size = domiDB.size;
        if (size === NaN || size < 2 || size > 100) {
            $(".welcome-error").text("잘못된 크기 입니다.");
            return;
        }

        if (x === NaN || y === NaN || x < 0 || y < 0) {
            $(".welcome-error").text("플레이어 위치가 잘못되었습니다.");
            return;
        }

        if (x > size-1 || y > size-1) {
            $(".welcome-error").text("플레이어 위치가 최대 크기를 넘습니다.");
            return;
        }
        
        if (already && blockSys.StatusBlock(x, y) === "enemy") {
            $(".welcome-error").text("플레이어 위치에 이미 적이 있습니다.");
            return;
        }

        domiDB.projectName = name;
        if (!already)
            domiDB.size = size;
        domiDB.player = [x,y];
        if (CloseDetect)
            clearInterval(CloseDetect);

        domiWindow.hide();

        if (already)
            $(".block-y").empty();

        blockSys.Init();
    }

    $(".welcome-button").on("click", SettingHandler);
}