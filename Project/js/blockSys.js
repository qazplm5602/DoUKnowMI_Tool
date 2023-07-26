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

    // 적 생성
    for (const [coord, data] of Object.entries(domiDB.data)) {
        let [x, y] = coord.split(",");
        x = Number(x);
        y = Number(y);

        $(`#block-${y}-${x}`).html(`<img src="./assets/Enemys/test.gif">`);
    }
}