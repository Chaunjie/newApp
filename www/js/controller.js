/**
 * Created by xudao on 16/2/25.
 */
angular.module('NewsApp.controllers', [])

    .controller('AppCtrl', ['$scope', '$state', '$rootScope', '$q', 'XuPopup', function ($scope, $state, $rootScope, $q, XuPopup) {
        $scope.go = function (name, params) {
            $state.go(name, params);
        };
        $scope.goBack = function () {
            window.history.go(-1)
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            $scope.name = toState.name;//console.log(toState);
        });

        $scope.$on('$viewContentLoading', function (event, viewConfig) {
            XuPopup.loading().show();
            document.getElementById('loading').style.display = 'block';
        });

        $scope.$on('$viewContentLoaded', function (event, viewConfig) {
            XuPopup.loading().hide();
            //XuPopup.toast().show();
        });

        $rootScope.$on('loading:show', function(){
            XuPopup.loading().show();
        });

        $rootScope.$on('loading:hide', function(){
            XuPopup.loading().hide();
        });

    }])

    .controller('ListCtrl', ['$scope', '$q', '$timeout', function ($scope, $q, $timeout) {
        //$scope.pageClass = 'animated bounceInLeft';
        $scope.more = false;
        $scope.me = ''
        $scope.loadMore = function () {
            console.log('lists');
            $scope.more = false;
            $timeout(function () {
                $scope.me.lock();
                $scope.me.noData();
                $scope.me.resetload();
            }, 100)

            /*if($scope.me){
             $scope.me.lock();
             $scope.me.noData();
             //$scope.me.resetload();
             }*/
        };

        function ajax1() {
            console.log('ajax1');
        }

        function ajax2() {
            console.log('ajax2');
        }

        $scope.refresh = function () {
            console.log('refresh');
            $scope.more = true;
            $q.all([
                ajax1(),
                ajax2()
            ]).finally($timeout(function () {
                $scope.me.resetload()
            }, 3000))
        };


    }])

    .controller('ButtonCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('TabCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

    }])

    .controller('IndexCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated fadeIn';
        $scope.swiper = {};

        $scope.next = function () {
            $scope.swiper.slideNext();
        };

    }])

    .controller('CircleCtrl', ['$scope', '$q', function ($scope, $q) {
        $scope.pageClass = 'animated fadeIn';

        $scope.more = false;
        $scope.me = ''
        $scope.loadMore = function () {
            console.log('lists');
            $scope.more = false;
            if ($scope.me) {
                $scope.me.lock();
                $scope.me.noData();
                $scope.me.resetload();
            }

        };

        function ajax1() {
            console.log('ajax1');
        }

        function ajax2() {
            console.log('ajax2');
        }

        $scope.refresh = function () {
            console.log('refresh');
            $scope.more = true;
            $q.all([
                ajax1(),
                ajax2()
            ]).finally($scope.me.resetload())
        };

        $scope.reload = function () {
            console.log('circle');
        };
    }])

    .controller('NewCtrl', ['$scope', '$q', '$timeout', function ($scope, $q, $timeout) {
        $scope.pageClass = 'animated fadeIn';

        $scope.more = false;
        $scope.me = ''
        $scope.loadMore = function () {
            console.log('lists');
            $scope.more = false;
            $timeout(function () {
                $scope.me.lock();
                $scope.me.noData();
                $scope.me.resetload();
            }, 100)
        };

        function ajax1() {
            console.log('ajax1');
        }

        function ajax2() {
            console.log('ajax2');
        }

        $scope.refresh = function () {
            console.log('refresh');
            $scope.more = true;
            $q.all([
                ajax1(),
                ajax2()
            ]).finally($timeout(function () {
                $scope.me.resetload()
            }, 3000))
        };

        $scope.reload = function () {
            alert('news');
        };
    }])

    .controller('MyCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated fadeIn';
    }])

    .controller('FormCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('CheckboxCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('RadioCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('SwitchCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ListFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ListFrmArrCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ListFrmThumbCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ListFrmImageCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
        $scope.imgUrl = 'http://pic.maychoo.com/Uploads/201603/56d5683587c41.png';
        $scope.demoUrl = 'http://pic.maychoo.com/Uploads/201603/56d5683587c41.png';
    }])

    .controller('HeadBarCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ListNineCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('listSixteenCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('TabFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ContactBookFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ChatFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('IconFontFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ListCounterFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('StatusFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('TipsFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('SearchCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('RangeCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('TimeLineFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('ProgressFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';
    }])

    .controller('AlertFrmCtrl', ['$scope', 'XuPopup', '$q', '$timeout', '$window', function ($scope, XuPopup, $q, $timeout, $window) {
        $scope.pageClass = 'animated swing';

        $scope.confim = function () {
            XuPopup.confim({
                title: '提示',
                content: '哈哈哈哈',
                buttons: ['微信支付', '支付宝支付', '苹果支付']
            }, success);

            function success(index) {
                //alert(index);
            }
        };

        $scope.actionSheet = function () {
            XuPopup.actionSheet({
                cancelText: '取消',
                buttons: ['微信支付', '支付宝支付', '苹果支付']
            }, success);

            function success(index) {
                //alert(index);
            }
        };

        $scope.test = function test(){
            alert('Angular 动态添加元素');
        };

        $scope.userName='Welcome to Angular World!';

        var options = {
            scope: $scope,
            template: 'template/testModal.html',
            animate: true,
            inClass: 'rollIn',//'slideInUp',
            outClass: 'hinge',//'slideOutDown'
        };

        $scope.openModal = function () {
            XuPopup.modal(options).then(function (modal) {
                $scope.modal = modal;
                var height = angular.element('.aui-bar').height(),
                    windowHeight = angular.element($window).height();
                $timeout(function(){
                    $scope.contentHeight = {'height': windowHeight - height + 'px !important','margin-top': height + 'px'};
                })

            });
        }

        $scope.remove = function(){
            $scope.modal.removeClass(options.inClass).addClass(options.outClass);
            $timeout(function(){
                $scope.modal.remove();
            },600);
        };


    }])

    .controller('WaterfallFrmCtrl', ['$scope', function ($scope) {
        $scope.pageClass = 'animated swing';

        $scope.option = {
            col: 2,
            padding: 15,
            space: 15
        };

    }])

;