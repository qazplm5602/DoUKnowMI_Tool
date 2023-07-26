const contextMenu = {
    show: function() {

    }
}

$(function() {
    $(".context-background").click(function() {
        $(this).hide();
        $(".context-main").fadeOut(200);
    });
    $(document).on("click", ".block", function() {
        if ($(".context-background").css("display") === "none") return;

        $(".context-background").trigger("click");
    });
});

$(document).on("contextmenu", ".block", function(e) {
    console.log(this);

    $(".context-background").show();
    $(".context-main").fadeIn(200).css({left: e.pageX+"px", top: e.pageY+"px"});

    return false;
});