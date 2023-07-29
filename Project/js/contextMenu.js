const contextMenu = {
    show: function(e, menu) {
        let i = 0;
        $(".context-main").empty();
        menu.forEach(data => {
            $(".context-main").append(`<button data-id=${i} ${(data[2] === true ? "disabled" : "")}>${data[0]}</button>`);

            if (data[2] === true)
                data[1] = undefined;
            this.callbacks[i] = data[1];
            i ++;
        });

        $(".context-background").show();
        $(".context-main").fadeIn(150).css({left: e[0]+"px", top: e[1]+"px"});
    },
    callbacks: []
}

// context 버튼 메뉴 handler
$(document).on("click", ".context-main > button", function() {
    contextMenu.callbacks[$(this).data("id")]();
    $(".context-background").trigger("click");
});

$(function() {
    $(".context-background").click(function() {
        $(this).hide();
        $(".context-main").fadeOut(150);
    });
    $(document).on("click", ".block", function() {
        if ($(".context-background").css("display") === "none") return;
        $(".context-background").trigger("click");
    });
});

$(document).on("contextmenu", ".block", function(e) {
    const [x,y] = [$(this).data("x"), $(this).data("y")];
    const blockStatus = blockSys.StatusBlock(x, y);

    const menus = [
        [`x: ${x}, y: ${y}`, null, true],
        ["추가", () => domiWindow.charaterOpenWindow(x, y), blockStatus !== undefined],
        ["삭제", () => blockSys.RemoveEnemy(x, y), blockStatus !== "enemy"],
    ];

    const rotateHanlder = function(reseve) {
        const enemyData = domiDB.data[x+","+y];
        if (enemyData === undefined) return;
        
        blockSys.RemoveEnemy(x, y);
        let rotateID = enemyData.rotate;
        if (reseve)
            rotateID --;
        else
            rotateID ++;

        if (rotateID >= 4) rotateID = 0;
        if (rotateID < 0) rotateID = 3;

        const result = blockSys.SpawnEnemy(x, y, rotateID, enemyData.character);
        if (result !== true) {
            blockSys.SpawnEnemy(x,y, enemyData.rotate, enemyData.character);
            domiWindow.alertShow("회전 불가", result);
        }
    }
    
    if (blockStatus === "enemy") {
        menus.push(['오른쪽으로 회전', () => rotateHanlder(false)]);
        menus.push(['왼쪽으로 회전', () => rotateHanlder(true)]);
    }

    contextMenu.show(
        [e.pageX,e.pageY],
        menus
    );
    return false;
});