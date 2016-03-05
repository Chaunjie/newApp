angular.module('NewsApp.directives', [])
    .directive('tap1Mode', [function () {
        return {
            link: function (scope, element, attrs) {
                /*element.bind('touchstart touchmove', function () {
                 this.classList.add('activated');
                 });*/
                element.bind('touchend', function () {
                    this.classList.remove('activated');
                });

                element.addEventListener('touchstart', function () {
                    this.classList.add('activated');
                }, false);
            }
        };
    }])

    .directive('uScroll', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                element.dropload({
                    scrollArea: $(element).parent(),//window,
                    domUp: {
                        domClass: 'dropload-up',
                        domRefresh: '<div class="dropload-refresh">↓下拉刷新-自定义内容</div>',
                        domUpdate: '<div class="dropload-update">↑释放更新-自定义内容</div>',
                        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中-自定义内容...</div>'
                    },
                    domDown: {
                        domClass: 'dropload-down',
                        domRefresh: '<div class="dropload-refresh">↑上拉加载更多-自定义内容</div>',
                        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中-自定义内容...</div>',
                        domNoData: '<div class="dropload-noData">暂无数据-自定义内容</div>'
                    },

                    loadUpFn: function (me) {
                        scope.$apply(function () {
                            scope.me = me;
                        });

                        scope.$apply(attrs.loadup);
                    },
                    loadDownFn: function (me) {
                         $timeout(function () {
                         scope.$apply(function () {
                         scope.me = me;
                         });
                         scope.$apply(attrs.loaddown);
                         });
                    }
                });
            }
        };
    }])

    .directive("ngXpull", [function () {
        return function (scope, elm, attr) {
            return $(elm[0]).xpull({
                'callback': function () {
                    return scope.$apply(attr.ngXpull);
                }
            });
        };
    }])

    .directive('tipSearch',  ['$timeout', function($timeout){
        return {
            link: function(scope, element, attrs){
                element.find('.aui-searchbar').bind('click', function(){
                    element.addClass('focus');
                    $timeout(function(){
                        element.find('.aui-searchbar-input input').focus();
                    })
                })

                element.find('.aui-icon-roundclosefill').bind('click', function(){
                    element.find('.aui-searchbar-input input').val('');
                })

                element.find('.aui-searchbar-cancel').bind('click', function(){
                    element.removeClass('focus');
                    element.find('.aui-searchbar-input input').val('');
                    $timeout(function(){
                        element.find('.aui-searchbar-input input').blur();
                    })
                })
            }
        }
    }])

    .directive('waterfallBlock', [function(){
        return {
            link: function(scope, element, attrs){
                var col = 2,//行数
                    padding  = 15,//padding
                    space = 15,//列间距
                    waterfall = {},
                    option = scope[attrs.option] ? scope[attrs.option] : {};

                waterfall._initOption = function(){
                    col = option.col ? option.col : col;
                    padding = option.padding ? option.padding : padding;
                    space = option.space ? option.space : space
                };

                waterfall._initWaterfall = function(){
                    var el_w = element.width();
                    var list_w = (el_w/col)-padding-space;
                    element.css({
                        '-webkit-column-width':list_w+'px',
                        '-webkit-column-count': col,
                        'padding':padding+'px',
                        '-webkit-column-gap':space+'px'
                    });
                };

                waterfall._initOption();
                waterfall._initWaterfall();
            }
        }
    }])

;