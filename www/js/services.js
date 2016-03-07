angular.module('NewsApp.services', [])

    .factory('XuPopup', ['$q', '$timeout', '$http', '$compile', function ($q, $timeout, $http, $compile) {
        function getIndexTest(DOM){
           var attrArrs =  DOM[0].currentTarget.attributes;
            for(var i in attrArrs){
                if(attrArrs[i].name === 'index'){
                    return attrArrs[i].value;
                }
            }
        }

        function getIndex(DOMArr, obj){
            for(var i=0; i<DOMArr.length; i++){
                if(DOMArr[i]==obj) {
                    return i;
                }
            }
        }

        return {
            loading: function(){
                return {
                    show: function(){
                        var html = '<div class="aui-toast" id="loading">'
                            + '<div class="aui-toast-loading"></div>'
                            + '<div class="aui-toast-content">加载中</div></div>';
                        var loading = angular.element('#loading');
                        if(loading[0]){
                            loading.remove();
                            angular.element('body').append(html);
                        }else{
                            angular.element('body').append(html);
                        }
                    },

                    hide: function(){
                        var loading = angular.element('#loading');
                        loading.remove();
                    }
                }
            },

            toast: function(){
                return {
                    show: function(options){
                        options = options ? options : {};
                        options.icon = options.icon ? options.icon : 'aui-icon-check';
                        options.text = options.text ? options.text : '提交成功';
                        var html = '<div class="aui-toast" id="toast">'
                            + '<i class="aui-iconfont '+options.icon+'"></i>'
                            + '<div class="aui-toast-content">'+options.text+'</div></div>';
                        var toast = angular.element('#toast');
                        if(toast[0]){
                            toast.remove();
                            angular.element('body').append(html);
                        }else{
                            angular.element('body').append(html);
                        }

                        $timeout(function(){
                            angular.element('#toast').remove();
                        },2000)
                    },

                    hide: function(){
                        var toast = angular.element('#toast');
                        toast.remove();
                    }
                }
            },

            confim : function(option, callback){
                var title = option.title ? option.title : '提示',
                    content = option.content ? option.content : '内容',
                    buttons = option.buttons ? option.buttons : ['确定'],
                    radius = option.radius ? option.radius : 6,
                    titleColor = option.titleColor ? option.titleColor : '#ff3300',
                    contColor = option.contColor ? option.contColor : '#333',
                    btnColor = option.btnColor ? option.btnColor : '';

                var body = angular.element('body'),
                    xu_box = '<div class="overflow"><div class="animated bounceIn" id="aui-box" style="border-radius:'+radius+'px"></div></div>',
                    his_box = angular.element('#aui-box'),
                    overflow = angular.element('.overflow');

                if(overflow[0]){
                    overflow.remove();
                    body.append(xu_box);
                }else{
                    body.append(xu_box);
                }

                var header = '<div id="aui-box-header">'+title+'</div>',
                    content = '<div id="aui-box-body">'+content+'</div>',
                    footer = '<div id="aui-box-footer">'+mapBtns()+'</div>';

                angular.element('#aui-box').append(header);
                angular.element('#aui-box').append(content);
                angular.element('#aui-box').append(footer);
                var height = angular.element('#aui-box').height();
                document.getElementById('aui-box').style.marginTop = - Math.floor(height/2) + 'px';
                angular.element('.aui-box-btn').bind('click', function(r){
                    var index = getIndex(angular.element('#aui-box-footer > .aui-box-btn'), this);
                    callback && callback(index);
                    angular.element('#aui-box').removeClass('bounceIn').addClass('bounceOut');
                    $timeout(function(){
                        angular.element('.overflow').remove();
                    },500);

                })

                function mapBtns(){
                    var html = '',
                        btnWidth = 100/buttons.length;
                    for(var i = 0; i<buttons.length;i++){
                        html += '<div class="aui-box-btn" id="btn-'+i+'" index='+i+'  style="color:'+btnColor+';width:'+btnWidth+'%">'+buttons[i]+'</div>';
                    }

                    return html;

                }

            },

            actionSheet: function(option, callback){
                option.cancelText = option.cancelText ? option.cancelText : '取消';
                var html = '<div class="animated slideInUp overflow">'
                         + '<div class="actionSheet">'
                         + '<div class="actionSheet-menus">'
                         +  mapButtons(option.buttons)
                         + '</div>'
                         + '<div class="actionSheet-cencel actionSheet-btn">'+option.cancelText+'</div>'

                         + '</div></div>';

                function mapButtons(r){
                    var html = '';
                    for(var i = 0; i< r.length;i++){
                        html += '<div class="actionSheet-btn sure-btn" index="'+i+'">'+ r[i]+'</div>'
                    }
                    return html;
                }

                angular.element('body').append(html);

                angular.element('.overflow, .actionSheet-cencel').bind('click', function(){
                    domServe();
                });

                angular.element('.actionSheet').bind('click', function(e){
                    e.stopPropagation();
                });

                angular.element('.sure-btn').bind('click', function(r){
                    var index = getIndex(angular.element('.actionSheet-menus > .sure-btn'), this);
                    callback && callback(index);
                    domServe();
                });

                function domServe(){
                    angular.element('.overflow').removeClass('slideInUp').addClass('slideOutDown');
                    $timeout(function(){
                        angular.element('.overflow').remove();
                    },600)
                }

            },

            modal: function(options){
                var deferred = $q.defer();
                $http.get(options.template).success(function(data) {
                    var html =  angular.element(data);
                    if(options.animate){
                        var animateStyle = options.inClass ? options.inClass : 'slideInUp';
                        html.addClass('animated');
                        html.addClass(animateStyle);
                    }
                    var mobileDialogElement = $compile(html)(options.scope);
                    angular.element(document.body).append(mobileDialogElement);
                    deferred.resolve(mobileDialogElement);

                });
                return deferred.promise;
            }


        }
    }])
;
