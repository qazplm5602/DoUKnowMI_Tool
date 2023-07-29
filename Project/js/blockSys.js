let blockSys = {};

blockSys.Init = function() {
    // 제목 수정
    document.title = "DoYouknowMI Tools - "+domiDB.projectName;

    // 블럭 생성
    for (let i = 0; i < domiDB.size; i++) {
        $(".block-y").prepend(`<section class="block-x" id="block-y-${i}" data-y=${i}></section>`);
        for (let v = 0; v < domiDB.size; v++) {
            $("#block-y-"+i).append(`<div class="block" id="block-${i}-${v}" data-y=${i} data-x=${v}></div>`);
        }
    }
    
    // 플레이어 소환
    $(`#block-${domiDB.player[1]}-${domiDB.player[0]}`).html(`<img class="player" src="./assets/player.gif">`);

    $(".block").droppable();

    // 적 생성
    for (const [coord, data] of Object.entries(domiDB.data)) {
        let [x, y] = coord.split(",");
        blockSys.SpawnEnemy(x,y, data.rotate, data.character);
    }
}

// Couldn't figure out a way to use the coordinates
// that jQuery also stores, so let's record our own.
var click = {
    x: 0,
    y: 0
};

// 적 소환
blockSys.SpawnEnemy = function(x, y, rotate, enemyID) {
    // 형 변환
    x = Number(x);
    y = Number(y);

    const enemy = Enemy_List[enemyID];
    if (enemy === undefined) {
        console.error("[enemy spawn] enemy가 없음");
        return "enemy가 없음";
    }

    // 내 자리에 뭐가 있는지 확인
    const BlockStatus = blockSys.StatusBlock(x, y);
    if (BlockStatus === "ban") {
        console.error("[enemy spawn] 배치 하는 자리에 이미 다른 적이 공격하는 자리입니다.");
        return "배치 하는 자리에 이미 다른 적이 공격하는 자리입니다.";
    }
    
    if (BlockStatus === "enemy") {
        console.error("[enemy spawn] 배치하는 자리에 이미 다른 적이 있습니다.");
        return "배치하는 자리에 이미 다른 적이 있습니다.";
    }
    
    if (BlockStatus === "player") {
        console.error("[enemy spawn] 배치하는 자리에 플레이어가 있습니다.");
        return "배치하는 자리에 플레이어가 있습니다.";
    }

    const banBlocks = blockSys.rotateBlocks([x,y], enemy[2].map(([defaultX,defaultY]) => [defaultX + x, defaultY + y]), blockSys.GetAngle(rotate));
    console.log(banBlocks);

    // 다른 블럭에 충돌이 있는지 찾기
    for (let index = 0; index < banBlocks.length; index++) {
        let [domiX, domiY] = banBlocks[index];
        
        if (domiX < 0 || domiX >= domiDB.size || domiY < 0 || domiY >= domiDB.size) {
            console.error("[enemy spawn] 적이 공격할 수 있는 자리가 누락됨");
            return "적이 공격할 수 있는 자리가 누락됨";
        }

        const BlockStatus = blockSys.StatusBlock(domiX, domiY);
        if (BlockStatus === "ban") {
            console.error("[enemy spawn] 적이 공격할 수 있는 자리가 겹칩니다.");
            return "적이 공격할 수 있는 자리가 겹칩니다.";
        }
        if (BlockStatus === "enemy") {
            console.error("[enemy spawn] 적이 공격할 수 있는 자리에 다른 적이 있습니다.");
            return "적이 공격할 수 있는 자리에 다른 적이 있습니다.";
        }
        // if (BlockStatus === "player") {
        //     console.error("[enemy spawn] 적이 공격할 수 있는 자리에 플레이어가 있습니다.");
        //     return "적이 공격할 수 있는 자리에 플레이어가 있습니다.";
        // }
    }

    const $block = $(`#block-${y}-${x}`);
    $block.html(`<img class="enemy" data-enemy="${enemyID}" src="./assets/Enemys/${enemy[1]}">`);
    
    // 금지 블럭 생성
    banBlocks.forEach(([domiX, domiY]) => {
        $(`#block-${domiY}-${domiX}`).append(`<div class="x"></div>`);
    });

    $block.find(".enemy").draggable({
        zIndex: 999,
        start: function(event) {
            click.x = event.clientX;
            click.y = event.clientY;
        },
        drag: function(event, ui) {
            var original = ui.originalPosition;
    
            // jQuery will simply use the same object we alter here
            ui.position = {
                left: (event.clientX - click.x + original.left) / zoom,
                top:  (event.clientY - click.y + original.top ) / zoom
            };
    
        },
        revert: function(event) {
            if (event === false) return true;

            const [targetX, targetY] = [$(event).data("x"), $(event).data("y")];
            if (targetX === x && targetY === y) return true;
            const targetStatus = blockSys.StatusBlock(targetX, targetY);
            if (targetStatus !== "enemy" && targetStatus !== undefined) {
                return true;
            }

            let targetEnemyID;
            let targetData;
            if (targetStatus === "enemy") {
                targetEnemyID = $(event).find(".enemy").data("enemy");
                if (targetEnemyID === undefined) return true;
                targetData = domiDB.data[targetX+","+targetY];
                if (targetData === undefined) return true;

                blockSys.RemoveEnemy(targetX, targetY);
            }
            
            blockSys.RemoveEnemy(x, y);
            const editOK = blockSys.SpawnEnemy(targetX, targetY, rotate, enemyID);
            if (editOK !== true) { // 스폰 실패
                blockSys.SpawnEnemy(x, y, rotate, enemyID);
                domiWindow.alertShow("수정 불가", editOK);
                return true;
            }

            // 바꿔치기
            if (targetStatus === "enemy") {
                blockSys.SpawnEnemy(x, y, targetData.rotate, targetEnemyID);
            }

            return true;
        }
    });

    domiDB.data[x+","+y] = {
        character: enemyID,
        rotate: rotate
    };

    SaveDiff = true;
    return true;
}

// 적 삭제
blockSys.RemoveEnemy = function(x, y) {
    // 형 변환
    x = Number(x);
    y = Number(y);

    const $block = $(`#block-${y}-${x}`);
    const $enemy = $block.find(".enemy");
    if ($enemy.length === 0) {
        console.error("[enemy remove] 해당 자리에 적이 없습니다.");
        return;
    }

    const enemyID = $enemy.data("enemy");
    if (enemyID === undefined) {
        console.error("[enemy remove] 적 ID 를 찾을 수 없습니다.");
        return;
    }
    const enemyInfo = Enemy_List[enemyID];
    if (enemyInfo === undefined) {
        console.error("[enemy remove] 적 데이터가 없습니다. ("+ enemyID +")");
        return;
    }
    const enemyData = domiDB.data[x+","+y];
    if (enemyData === undefined) {
        console.error("[enemy remove] 적 위치 데이터가 누락되었습니다. ("+ enemyID +") ("+x+","+y+")");
        return;
    }

    // 제거 ㄱㄱ
    $enemy.remove();
    // 금지 블럭 제거
    const banBlocks = blockSys.rotateBlocks([x,y], enemyInfo[2].map(([defaultX,defaultY]) => [defaultX + x, defaultY + y]), blockSys.GetAngle(enemyData.rotate));
    banBlocks.forEach(([domiX, domiY]) => {
        $(`#block-${domiY}-${domiX}`).find(".x").remove();
    });

    delete domiDB.data[x+","+y];
    SaveDiff = true;
}

blockSys.StatusBlock = function(x, y) {
    const $block = $(`#block-${y}-${x}`);

    if ($block.find(".enemy").length > 0) {
        return "enemy";
    }

    if ($block.find(".x").length > 0) {
        return "ban";
    }

    if ($block.find(".player").length > 0) {
        return "player";
    }
    
    return;
}

blockSys.rotateBlocks = function(center, blocks, angle) {
    // 각도를 라디안으로 변환
    const radian = (angle * Math.PI) / 180;
    
    // 회전 변환 행렬
    const rotationMatrix = [
      [Math.cos(radian), -Math.sin(radian)],
      [Math.sin(radian), Math.cos(radian)],
    ];
  
    // 결과를 담을 배열
    const rotatedBlocks = [];
  
    // 각 블럭을 회전 및 기준좌표 이동하여 결과 배열에 추가
    for (const block of blocks) {
      const translatedBlock = [block[0] - center[0], block[1] - center[1]];
      const rotatedBlock = [
        Math.round(
          rotationMatrix[0][0] * translatedBlock[0] + rotationMatrix[0][1] * translatedBlock[1]
        ),
        Math.round(
          rotationMatrix[1][0] * translatedBlock[0] + rotationMatrix[1][1] * translatedBlock[1]
        ),
      ];
      const finalBlock = [rotatedBlock[0] + center[0], rotatedBlock[1] + center[1]];
      rotatedBlocks.push(finalBlock);
    }
  
    return rotatedBlocks;
}

blockSys.GetAngle = function(id) {
    return 90 * Math.floor(id);
}