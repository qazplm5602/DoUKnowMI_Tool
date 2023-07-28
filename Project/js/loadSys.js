ipcRenderer.once("project.openStage", function(event, path, data) {
    domiDB.projectName = data.projectName;
    domiDB.size = data.size;
    domiDB.player = data.player;
    domiDB.data = data.data;

    SaveFilePath = path;
    
    blockSys.Init();
});

ipcRenderer.once("project.openSetting", function() {
    domiWindow.show("어서오세요!", `
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

    let CloseDetect = setInterval(() => {
        if ($(".window-main").css("display") === "none") {
            SaveDiff = false;
            window.close();
        }
    }, 1);

    const SettingHandler = function() {
        const name = $("#welcome-name").val();
        const size = Number($("#welcome-size").val());
        const [x,y] = [Number($("#welcome-coord-x").val()), Number($("#welcome-coord-y").val())];


        if (name.length === 0) {
            $(".welcome-error").text("프로젝트 이름을 입력해야 합니다.");
            return;
        }
        
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

        domiDB.projectName = name;
        domiDB.size = size;
        domiDB.player = [x,y];
        clearInterval(CloseDetect);
        domiWindow.hide();
        blockSys.Init();
    }

    $(".welcome-button").on("click", SettingHandler);
});