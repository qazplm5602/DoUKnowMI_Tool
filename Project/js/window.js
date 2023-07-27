const domiWindow = {
    delay: undefined,
    show: function(title, body) {
        this.clear();
        if (this.delay !== undefined) {
            clearTimeout(this.delay);
            this.delay = undefined;
        }

        $(".window-main").show(0, function() {
            $(this).css({
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1
            });
        });
        $(".window-background").fadeIn(300);

        $(".window-head-title").text(title);
        $(".window-main").append(body);
    },
    hide: function() {
        if (this.delay !== undefined) {
            clearTimeout(this.delay);
            this.delay = undefined;
        }

        $(".window-main").css({
            transform: "translate(-50%, -50%) scale(0.8)",
            opacity: 0
        });
        this.delay = setTimeout(() => {
            $(".window-main").hide();
            this.clear();
        }, 250);
        $(".window-background").fadeOut(300);
    },
    clear: function() {
        $.each($(".window-main").children(), function(_, element) {
            if (!$(element).hasClass('window-head'))
                $(element).remove();
        });
    },
    alertShow: function(title, content) {
        this.show(title, `<div class="alert-content">${content}</div>`);
    }
}

// 캐릭터 생성 창
domiWindow.charaterOpenWindow = function(x, y) {
    let htmlhtmlhtmlhtml = "";

    for (const [enemyID, data] of Object.entries(Enemy_List)) {
        htmlhtmlhtmlhtml += `
        <button onclick="domiWindow.hide(); domiWindow.charaterAddHandler(${x}, ${y}, '${enemyID}');">
            <div class="name">${data[0]}</div>
            <section>
                <img src="./assets/Enemys/${data[1]}">
                <div class="preview">
                    <img class="char" src="./assets/Enemys/${data[1]}">
        `;

        data[2].forEach(([domiX, domiY]) => {
            let style;
            if (domiX === 0 && domiY === 1) {
                style = `transform: translate(-50%, 0); top: 5px;`;
            } else if (domiX === 1 && domiY === 0) {
                style = `left: initial; right: 5px; transform: translate(0, -50%);`;
            } else if (domiX === 0 && domiY === -1) {
                style = `top: initial; bottom: 5px; transform: translate(-50%, 0);`;
            } else if (domiX === -1 && domiY === 0) {
                style = `left: 5px; transform: translate(0, -50%);`;
            } else if (domiX === -1 && domiY === 1) {
                style = `top: 5px; left: 5px; transform: translate(0, 0);`;
            } else if (domiX === 1 && domiY === 1) {
                style = `top: 5px; left: initial; right: 5px; transform: translate(0, 0);`;
            } else if (domiX === 1 && domiY === -1) {
                style = `top: initial; bottom: 5px; left: initial; right: 5px; transform: translate(0, 0);`;
            } else if (domiX === -1 && domiY === -1) {
                style = `top: initial; left: 5px; bottom: 5px; transform: translate(0, 0);`;
            }
            if (style === undefined) return;
            htmlhtmlhtmlhtml += `<img class="xdomi" style="${style}" src="./assets/Forbidden.svg">`;
        });

        htmlhtmlhtmlhtml += `
                </div>
            </section>
            </button>
        `;
    }
    
    domiWindow.show("캐릭터 추가", `<div class="window-character">` + htmlhtmlhtmlhtml + `</div>`);
}

domiWindow.charaterAddHandler = function(x, y, enemyID) {
    const result = blockSys.SpawnEnemy(x, y, enemyID);
    if (result !== true)
        domiWindow.alertShow("캐릭터 추가 불가", result);
}