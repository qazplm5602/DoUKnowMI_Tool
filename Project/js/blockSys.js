let blockSys = {};

// TEST CODE
$(function() {
    blockSys.Init();
});

blockSys.Init = function() {
    // 블럭 생성
    for (let i = 0; i < domiDB.size; i++) {
        $(".block-y").prepend(`<section class="block-x" id="block-y-${i}" data-y=${i}></section>`);
        for (let v = 0; v < domiDB.size; v++) {
            $("#block-y-"+i).append(`<div class="block" id="block-${i}-${v}" data-y=${i} data-x=${v}></div>`);
        }
    }
    $(".block").droppable();

    // 적 생성
    for (const [coord, data] of Object.entries(domiDB.data)) {
        let [x, y] = coord.split(",");
        blockSys.SpawnEnemy(x,y, data.character);
    }
}

// 적 소환
blockSys.SpawnEnemy = function(x, y, enemyID) {
    // 형 변환
    x = Number(x);
    y = Number(y);

    const enemy = Enemy_List[enemyID];
    if (enemy === undefined) {
        console.error("[enemy spawn] enemy가 없음");
        return;
    }

    // 내 자리에 뭐가 있는지 확인
    const BlockStatus = blockSys.StatusBlock(x, y);
    if (BlockStatus === "ban") {
        console.error("[enemy spawn] 배치 하는 자리에 이미 다른 적이 공격하는 자리입니다.");
        return;
    }
    
    if (BlockStatus === "enemy") {
        console.error("[enemy spawn] 배치하는 자리에 이미 다른 적이 있습니다.");
        return;
    }

    // 다른 블럭에 충돌이 있는지 찾기
    for (let index = 0; index < enemy[2].length; index++) {
        let [domiX, domiY] = enemy[2][index];
        domiX += x;
        domiY += y;
        
        if (domiX < 0 || domiX >= domiDB.size || domiY < 0 || domiY >= domiDB.size) {
            console.error("[enemy spawn] 적이 공격할 수 있는 자리가 누락됨");
            return;
        }

        const BlockStatus = blockSys.StatusBlock(domiX, domiY);
        if (BlockStatus === "ban") {
            console.error("[enemy spawn] 적이 공격할 수 있는 자리가 겹칩니다.");
            return;
        }
        if (BlockStatus === "enemy") {
            console.error("[enemy spawn] 적이 공격할 수 있는 자리에 다른 적이 있습니다.");
            return;
        }
    }

    const $block = $(`#block-${y}-${x}`);
    $block.html(`<img class="enemy" data-enemy="${enemyID}" src="./assets/Enemys/${enemy[1]}">`);
    
    // 금지 블럭 생성
    enemy[2].forEach(([domiX, domiY]) => {
        $(`#block-${y + domiY}-${x + domiX}`).html(`<div class="x"></div>`);
    });

    $block.find(".enemy").draggable({
        zIndex: 999,
        revert: function(event) {
            console.log(event);
        }
    });
}

blockSys.StatusBlock = function(x, y) {
    const $block = $(`#block-${y}-${x}`);

    if ($block.find(".x").length > 0) {
        return "ban";
    }

    if ($block.find(".enemy").length > 0) {
        return "enemy";
    }
    
    return;
}