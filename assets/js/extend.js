/* 2016年11月20日 13:40:47 */

;
(function($) {

    $.extend({

        /* 左右选跳 */
        pick: function(ele1, w, type, ele2) {
            var target = new this(ele1);
            var node = new this(ele2);
            node.hide();

            function Anim() {
                this.is = 0;
                this.len = target.children().length - 4;
                this.pw = target.position().left;
                this.n = 0;
                if (type == 'prev') {
                    this.n = w / 10;
                } else if (type == 'next') {
                    this.n = -w / 10;
                };
                this.fn();
            }
            Anim.prototype = {
                fn: function() {
                    var self = this;
                    this.is += 1;
                    target.css('left', this.pw);
                    if (this.is > 10) {
                        node.show();
                        return this.is = 0;
                    };
                    if (type == 'prev') {
                        if (this.pw >= 0 && this.pw < w) {
                            this.pw = -this.len * w;
                        };
                    }
                    this.pw += this.n;
                    if (type == 'next') {
                        if (this.pw <= -this.len * w && this.pw > -(this.len + 1) * w) {
                            this.pw = 0;
                        };
                    };
                    setTimeout(function() {
                        self.fn();
                    }, 20);
                }
            };

            return new Anim();
        },

        /* 上下滚动 */
        posScroll: function(scrSt, scrEn) {
            function scrPos() {
                this.is = 0;
                this.pos = scrSt;
                this.n = (scrEn - scrSt) / 20;
                this.fn();
            };
            scrPos.prototype = {
                fn: function() {
                    var self = this;
                    this.is++;
                    $(window).scrollTop(self.pos);
                    if (this.is > 20) {
                        return this.is = 0;
                    };
                    self.pos += this.n;
                    setTimeout(function() {
                        self.fn();
                    }, 40);
                }
            };
            return new scrPos();
        },

        /* 进度条 */
        progressBar: function(obj, arr) {
            function progBar() {
                this.obj = obj;
                this.arr = arr;
                this.fn();
            }
            progBar.prototype = {
                fn: function() {
                    $('.' + this.obj).html('');
                    for (var i = 0; i < $('.' + this.obj).length; i++) {
                        // console.time('用时');
                        drawRing({
                            parent: document.getElementsByClassName(this.obj)[i],
                            animated: true,
                            width: 100,
                            radius: 45,
                            arc: 5,
                            perent: this.arr[i],
                            color: ['#fff', '#373737'],
                            textColor: '#373737',
                            textSize: '30px',
                            after: function() {
                                // console.timeEnd('用时');
                            }
                        });
                    }
                }
            }

            return new progBar();

        },

        /* 文字弹窗 */
        pop: function(val) {
            function Pop() {
                this.val = val;
                /*获取显示屏的高度*/
                this.y = document.documentElement.clientHeight;
                this.x = document.documentElement.clientWidth;
                this.fn();
            }
            Pop.prototype = {
                fn: function() {
                    var self = this;
                    $('#pop').remove();
                    $(document.body).append('<div id="pop"></div>');
                    $('#pop').html(self.val);
                    var pop_w = $("#pop").width();
                    $("#pop").css({
                        "top": self.y / 2,
                        "left": self.x / 2
                    }).animate({ "opacity": 0.5 }, 1500, function() {
                        $(this).remove();
                    });
                }
            }
            return new Pop();
        },

        isMobile: function() {
            var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (!mobile) return false;
            return true;
        }
    });

})(jQuery);
