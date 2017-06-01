(function($) {
    $("body").on("click", ".rules, .check", function(event) {
        event.preventDefault();
        $(".modals").each(function() {
            $(".up").addClass("down");
        });
        if ($(this).hasClass("rules")) {
            $(".dialog-rules").addClass("up").removeClass("down");
        } else {
            $(".dialog-table").addClass("up").removeClass("down");
        }
    });
    $("body").on("click", ".btn-down", function(event) {
        event.preventDefault();
        $(".modals").addClass("down").removeClass("up");
    });
    //! 调用扫码弹层
    var obj = {
        qrcodeSupport: function(event) {
            $("#pay_qrcode").find(".alert_img_qrcode").empty().qrcode({
                width: 120,
                height: 120,
                text: "http://www.baidu.com",
                render: "canvas",
                correctLevel: 1
            });
            $("#pay_qrcode").modal("show");
        },
        payFinished: function() {}
    };
    $("body").on("click", ".btn-join", function(event) {
        obj.qrcodeSupport();
    });
    var GLOBAL = {
        show: function($obj) {
            $obj.fadeIn(200);
            $(".masklayer").show();
        },
        hide: function($obj) {
            $obj.fadeOut(200);
            $(".masklayer").hide();
        }
    };
    //! 弹层
    $("body").on("click", ".btn-join", function(event) {
        event.preventDefault();
        GLOBAL.show($(".dialog-wrap").eq(0));
    });
    //! 隐藏弹层
    $("body").on("click", ".masklayer, .dialog .btn-close, .dialog .btn-sure, .dialog .btn-cancel", function(event) {
        event.preventDefault();
        GLOBAL.hide($(".dialog-wrap"));
    });
    $("body").on("click", ".myGame", function(event) {
        event.preventDefault();
        $(".four a").each(function() {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
        $(".tbl-wrap").eq(0).hide();
        $(".myGame-wrap").show();
    });
    $("body").on("click", ".refresh", function(event) {
        window.location.reload();
    });
})(jQuery);