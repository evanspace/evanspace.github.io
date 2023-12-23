/*2016年11月17日 23:00:03*/

$(function() {

    /* 设置 第一屏的高度 */
    var winH = document.documentElement.clientHeight;
    var winW = document.documentElement.clientWidth;
    $('#home .fore').height(winH);

    /* 判断浏览器打开时的宽度是否小于 1050，隐藏导航 */
    if (winW < 1050) {
        $('.nav ul').hide();
    }

    /* 判断滚动条的位置设置导航栏背景动画 */
    var scroll = $(window).scrollTop();
    if (scroll > 20) {
        $('header').animate({ backgroundColor: '#373737' }, 'slow');
    }

    /* 判断是否是移动设备 */
    if ($.isMobile()) {
        $('#home .foreImg').css({ 'background': 'url(assets/images/home_img.jpg) center' });
        $('.separationImg').css({ 'background': 'url(assets/images/separationImg.jpg) center', 'background-size': '100% 100%' });
        $('#resume .maxim').css({ 'background': 'url(assets/images/maxim_img.jpg) center', 'background-size': '100% 100%' });
    }

    /* 窗口大小改变 */
    $(window).resize(function() {
        winH = document.documentElement.clientHeight;
        winW = document.documentElement.clientWidth;
        $('#home .fore').height(winH);
        if (!$.isMobile() && winW >= 1050) {
            $('.nav ul').slideDown();
            $('.openNav').data('st', 'open').html('<i class="fa fa-window-close"></i>');
        }
    });

    /* 导航 */
    $('.openNav').click(function() {
        var st = $(this).data('st');
        if (st == 'open') {
            $(this).data('st', 'close').html('<i class="fa fa-bars"></i>');
            $('.nav ul').slideUp();
        } else if (st == 'close') {
            $(this).data('st', 'open').html('<i class="fa fa-window-close"></i>');
            $('.nav ul').slideDown();
        }
    }).data('st', 'close');

    /* 进度百分比 */
    var onOff = true;
    var skillProgess = function(onOff) {
        if (onOff) {
            var paArr = [95, 95, 90, 95, 85, 80, 60];
            $.progressBar('drawRing', paArr);
        }
    }
    skillProgess(onOff);

    /* 滚动 */
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        /* 淡出或淡入导航栏 */
        if (scroll < 20) {
            $('header').stop(true, true);
            $('header').animate({ backgroundColor: 'transparent' }, 'slow');
            $('#backTop').hide();
        } else if (scroll > 20) {
            $('header').animate({ backgroundColor: '#373737' }, 'slow');
            $('#backTop').show();
        }
        /* 导航根据 scroll 值改变背景 */
        if (scroll < $('#project').position().top - 10) {
            $('.nav li:eq(0) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#project').position().top - 10 && scroll < $('#plugIn').position().top - 10) {
            $('.nav li:eq(1) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#plugIn').position().top - 10 && scroll < $('#JsSpecial').position().top - 10) {
            $('.nav li:eq(2) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#JsSpecial').position().top - 10 && scroll < $('#CssSpecial').position().top - 10) {
            $('.nav li:eq(3) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#CssSpecial').position().top - 10 && scroll < $('#resume').position().top - 10) {
            $('.nav li:eq(4) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#resume').position().top - 10 && scroll < $('#about').position().top - 10) {
            onOff = true;
            $('.nav li:eq(5) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#about').position().top - 10 && scroll < $('#skill').position().top - 10) {
            $('.nav li:eq(6) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        } else if (scroll >= $('#skill').position().top - 10 && scroll < $('#map').position().top - 10) {
            $('.nav li:eq(7) a').removeClass().addClass('backgroundColor').parent().siblings().find('a').removeClass();
        }

        if (scroll > ($('#skill').position().top - winH + 400)) {
            skillProgess(onOff);
            onOff = false;
        }
    });

    /* 显示二维码 */
    $('#home .contact li:eq(0)').mouseover(function() {
        $(this).find('.ewm').show().animate({ opacity: 1 }, 'slow');
    });
    /* 隐藏二维码 */
    $('#home .contact li:eq(0)').mouseout(function() {
        $(this).find('.ewm').stop(true, true);
        $(this).find('.ewm').css('opacity', 0.2).hide();
    });

    /* 格言换显 */
    $('.maxim .extra li').click(function() {
        var index = $(this).index();
        $(this).removeClass().addClass('backgroundColor').siblings().removeClass().addClass('backgroundWhite');
        $('.maximList').animate({ left: -index * $('.maximList li').width() }, 'fast');
    });

    /* 改变全局颜色 */
    if ($.cookie("css")) {
        $("link.colorCss").attr("href", $.cookie("css"));
    }
    $('#setColor .colorWrap a').click(function() {
        $("link.colorCss").attr("href", $(this).attr("rel"));
        $.cookie("css", $(this).attr('rel'), { expires: 365, path: '/' });
        if ($.isMobile()) {
            $('#setColor').animate({ right: -200 }, 'slow');
            $('#setColor .colorBtn').data('st', 'close');            
        }
    });

    /* 隐藏与显示颜色 */
    $('#setColor .colorBtn').click(function() {
        var st = $(this).data('st');
        if (st == 'open') {
            $(this).data('st', 'close');
            $('#setColor').stop(true, true);
            $('#setColor').animate({ right: -200 }, 'slow');
        } else if (st == 'close') {
            $(this).data('st', 'open');
            $('#setColor').stop(true, true);
            $('#setColor').animate({ right: 0 }, 'slow');
        }
        return false;
    }).data('st', 'open');

    /* 改变默认滚动条样式 */
   window.nice =  $("html").niceScroll({
        cursorwidth: "10px", // 滚动条的宽度，单位：便素
        cursorborder: "none", // CSS方式定义滚动条边框
        cursorborderradius: "0", // 滚动条圆角（像素）
        zindex: "99", // 改变滚动条的DIV的z-index值
        scrollspeed: 80, // 滚动速度
        touchbehavior: false, // 激活拖拽滚动
        hwacceleration: false, // 激活硬件加速
        spacebarenabled: true // 当按下空格时使页面向下滚动
    });
    $('html').getNiceScroll(0).doScrollTop(0, 200); //滚动条置顶

   
    /* 导航定位 */
    $('.nav li').click(function(e) {
        e.preventDefault();
        var scroll = $(window).scrollTop();
        var id = $(this).index();
        var top = $('.page').eq(id).position().top;
        $.posScroll(scroll, top);
        if (winW < 1050) {
            $('.nav ul').slideUp();
            $('.openNav').data('st', 'close').html('<i class="fa fa-bars"></i>');
        }
    });

    /* hobbies 调用插件 */
    $('#hobbieSlider').owlCarousel({
        center: false,
        items: 2,
        loop: false,
        margin: 20,
        nav: true,
        dots: false,
        navText: ['<i class="fa fa-minus-square"></i>', '<i class="fa fa-plus-square"></i>'],
        responsive: { 600: { items: 3 }, 1000: { items: 4 }}
    });

    /* maximList 调用插件 */
    $('#maximList').owlCarousel({
        center: true,
        items: 1,
        loop: false,
        margin: 20,
        nav: false,
        dots: true
    });

    /* 联系我 */
    $('.contactMeBtn').click(function() {
        var scroll = $(window).scrollTop();
        var top = $('#about').position().top;
        $.posScroll(scroll, top);
    })

    /* top 动画 */
    $('#backTop a').click(function() {
        var scroll = $(window).scrollTop();
        $.posScroll(scroll, 0);
        return false;
    });

    /* 流光折线 */
    $('.brokenLine li').mousemove(function() {
        $(this).find('.filament .item:eq(0), .filament .item:eq(1)').attr('class', 'item backgroundColor long')
        $(this).find('.filament .item:eq(2), .filament .item:eq(3)').attr('class', 'item backgroundColor tall')
    });
    $('.brokenLine li').mouseout(function() {
        $(this).find('.filament .item:eq(0), .filament .item:eq(1)').attr('class', 'item backgroundColor short')
        $(this).find('.filament .item:eq(2), .filament .item:eq(3)').attr('class', 'item backgroundColor dwarf')
    });

});
