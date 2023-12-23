/*2016年11月22日 17:54:22*/

$(function() {

    /* 中英文切换 */
    $('.language a').click(function() {
        var lag = $(this).data('lag');

        $.ajax({

            url: 'assets/xml/data.xml',
            type: 'GET',
            dataType: 'xml',
            timeout: 10000,
            error: function(xml) {
                // $.pop('Error loading XML document' + xml);
                $.pop('请求超时！！')
            },
            success: function(xml) {
                if (lag == 'ch') {

                    /* 导航栏 */
                    $(xml).find('nav chinese li').each(function(n) {
                        var nav = this.innerHTML;
                        $('.nav li').eq(n).find('a').html(nav);
                    });

                    /* 标题 */
                    $(xml).find('headline chinese li').each(function(n) {
                        var title = this.innerHTML;
                        $('.pageTitle').eq(n).html(title);
                    });
                    $('.maxim h1').html('格言');

                    /* #project, #plugIn, #JsSpecial, #CssSpecial 循环 */
                    $('#project, #plugIn, #JsSpecial, #CssSpecial').each(function() {
                        var id = this.id;
                        $(xml).find(id + ' name chinese li').each(function(n) {
                            var name = this.innerHTML;
                            $('#' + id + ' .fontColor').eq(n).html(name);
                        });
                        $(xml).find(id + ' genre chinese li').each(function(n) {
                            var genre = this.innerHTML;
                            $('#' + id +' .genre').eq(n).html(genre);
                        });
                    });

                    /* resume 单项标题 */
                    $(xml).find('resume htitle chinese li').each(function(n) {
                        var title = this.innerHTML;
                        $('#resume .resumeTitle ').eq(n).html(title)
                    });

                    /* 公司，学校名 */
                    $(xml).find('resume name title chinese li').each(function(n) {
                        var name = this.innerHTML;
                        $('#resume .title ').eq(n).html(name)
                    });

                    /* 工作职位，教育文凭 */
                    $(xml).find('resume name subtitle chinese li').each(function(n) {
                        var name = this.innerHTML;
                        $('#resume .subTitle ').eq(n).html(name)
                    });

                    /* 公司，学校简介 */
                    $(xml).find('resume content chinese li').each(function(n) {
                        var content = this.innerHTML;
                        $('#resume .textInner ').eq(n).html(content)
                    });

                    /* 格言 */
                    $(xml).find('resume maximList chinese li').each(function(n) {
                        var text = this.innerHTML;
                        $('#maximList .item ').eq(n).html(text);
                    });

                    /* 关于我的标题 */
                    $(xml).find('about title chinese li').each(function(n) {
                        var title = this.innerHTML;
                        $('#about .subHead ').eq(n).html(title)
                    });

                    /* 我的爱好 */
                    $(xml).find('about hobbies chinese li').each(function(n) {
                        var hobbies = this.innerHTML;
                        $('#hobbieSlider p').eq(n).html(hobbies)
                    });

                    /* 我的故事 */
                    $(xml).find('about story chinese').each(function(n) {
                        var text = this.innerHTML;
                        $('#about .story .text').html(text);
                    });

                    /* 联系我！ */
                    $('#skill .text').html($(xml).find('skill content chinese').text());
                    $('#skill .contactMeBtn').html($(xml).find('skill contact chinese').text()); 

                    /* 个人信息标题 */
                    $(xml).find('info title chinese li').each(function(n) {
                        var title = this.innerHTML;
                        $('.information tr').eq(n).find('td:eq(0)').html(title);
                    });

                    /* 个人信息内容 */    
                    $(xml).find('info value chinese li').each(function(n) {
                        var value = this.innerHTML;
                        $('.information .fontColor').eq(n).find('span').html(value);
                    });
                    
                } else if (lag == 'en') {

                    /* 导航栏 */
                    $(xml).find('nav english li').each(function(n) {
                        var nav = this.innerHTML;
                        $('.nav li').eq(n).find('a').html(nav);
                    });

                    /* 标题 */
                    $(xml).find('headline english li').each(function(n) {
                        var title = this.innerHTML;
                        $('.pageTitle').eq(n).html(title);
                    });
                    $('.maxim h1').html('APHORISM');

                    /* #project, #plugIn, #JsSpecial, #CssSpecial 循环 */
                    $('#project, #plugIn, #JsSpecial, #CssSpecial').each(function() {
                        var id = this.id;
                        $(xml).find(id + ' name english li').each(function(n) {
                            var name = this.innerHTML;
                            $('#' + id + ' .fontColor').eq(n).html(name);
                        });
                        $(xml).find(id + ' genre english li').each(function(n) {
                            var genre = this.innerHTML;
                            $('#' + id +' .genre').eq(n).html(genre);
                        });
                    })

                    /* resume 单项标题 */
                    $(xml).find('resume htitle english li').each(function(n) {
                        var title = this.innerHTML;
                        $('#resume .resumeTitle ').eq(n).html(title)
                    });

                    /* 公司，学校名 */
                    $(xml).find('resume name title english li').each(function(n) {
                        var name = this.innerHTML;
                        $('#resume .title ').eq(n).html(name)
                    });

                    /* 工作职位，教育文凭 */
                    $(xml).find('resume name subtitle english li').each(function(n) {
                        var name = this.innerHTML;
                        $('#resume .subTitle ').eq(n).html(name)
                    });

                    /* 公司，学校简介 */
                    $(xml).find('resume content english li').each(function(n) {
                        var content = this.innerHTML;
                        $('#resume .textInner ').eq(n).html(content)
                    });

                    /* 格言 */
                    $(xml).find('resume maximList english li').each(function(n) {
                        var text = this.innerHTML;
                        $('#maximList .item ').eq(n).html(text);
                    });                
                    
                    /* 关于我的标题 */
                    $(xml).find('about title english li').each(function(n) {
                        var title = this.innerHTML;
                        $('#about .subHead ').eq(n).html(title)
                    });

                    /* 我的爱好 */
                    $(xml).find('about hobbies english li').each(function(n) {
                        var hobbies = this.innerHTML;
                        $('#hobbieSlider p ').eq(n).html(hobbies)
                    });

                    $(xml).find('about story english').each(function(n) {
                        var text = this.innerHTML;
                        $('#about .story .text').html(text);
                    });

                    /* 联系我！ */
                    $('#skill .text').html($(xml).find('skill content english').text());
                    $('#skill .contactMeBtn').html($(xml).find('skill contact english').text());

                    /* 个人信息标题 */
                    $(xml).find('info title english li').each(function(n) {
                        var title = this.innerHTML;
                        $('.information tr').eq(n).find('td:eq(0)').html(title);
                    });

                    /* 个人信息内容 */        
                    $(xml).find('info value english li').each(function(n) {
                        var value = this.innerHTML;
                        $('.information .fontColor').eq(n).find('span').html(value);
                    });
                };
            }
        });
        $(this).removeClass('pitchOn').addClass('pitchOn');
        $(this).siblings().removeClass('pitchOn');
        if ($.isMobile()) {
            $('#setColor').animate({ right: -200 }, 'slow');
            $('#setColor .colorBtn').data('st', 'close');            
        }
    });

})
