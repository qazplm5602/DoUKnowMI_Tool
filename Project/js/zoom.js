let zoom = 1;

$(document).on('mousewheel',function(e){
    const up = e.originalEvent.wheelDelta > 0;

    if (up)
        zoom += 0.1;
    else
        zoom -= 0.1;
    
    zoom = Math.min(zoom, 5);
    zoom = Math.max(zoom, 0.1);

    $(".block-y").css("transform", "translate(-50%,-50%) scale("+ zoom +")");
    $("#option-size-value").val(Math.floor(zoom * 100));
});