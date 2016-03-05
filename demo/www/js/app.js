/**
 * Created by xudao on 16/2/25.
 */
angular.module('NewsApp', ['ngAnimate', 'NewsApp.controllers', 'NewsApp.services', 'NewsApp.directives', 'ui.router', 'ksSwiper', 'xu-lazy'])

    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$rootScope', function ($q, $rootScope) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },

                response: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },

                responseError: function (rejection) {
                    $rootScope.$broadcast('loading:hide');

                    if (rejection.status === 0) {
                        // net::ERR_CONNECTION_REFUSED
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
    }])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/list',
                controller: 'ListCtrl',
                templateUrl: 'template/list.html'
            })

            .state('button', {
                url: '/button',
                controller: 'ButtonCtrl',
                templateUrl: 'template/button.html'
            })

            .state('form', {
                url: '/form',
                controller: 'FormCtrl',
                templateUrl: 'template/form.html'
            })

            .state('checkbox', {
                url: '/checkbox',
                controller: 'CheckboxCtrl',
                templateUrl: 'template/checkbox.html'
            })

            .state('radio', {
                url: '/radio',
                controller: 'RadioCtrl',
                templateUrl: 'template/radio.html'
            })

            .state('switch', {
                url: '/switch',
                controller: 'SwitchCtrl',
                templateUrl: 'template/switch.html'
            })

            .state('list_frm', {
                url: '/list_frm',
                controller: 'ListFrmCtrl',
                templateUrl: 'template/list_frm.html'
            })

            .state('list_frm_arr', {
                url: '/list_frm_arr',
                controller: 'ListFrmArrCtrl',
                templateUrl: 'template/list_arrow_frm.html'
            })

            .state('list_frm_thumb', {
                url: '/list_frm_thumb',
                controller: 'ListFrmThumbCtrl',
                templateUrl: 'template/list_thumb_frm.html'
            })

            .state('list_frm_image', {
                url: '/list_frm_image',
                controller: 'ListFrmImageCtrl',
                templateUrl: 'template/list_image_frm.html'
            })

            .state('head_bar', {
                url: '/head_bar',
                controller: 'HeadBarCtrl',
                templateUrl: 'template/header_bar_frm.html'
            })

            .state('list_nine', {
                url: '/list_nine',
                controller: 'ListNineCtrl',
                templateUrl: 'template/list_nine_frm.html'
            })

            .state('list_sixteen', {
                url: '/list_sixteen',
                controller: 'listSixteenCtrl',
                templateUrl: 'template/list_sixteen_frm.html'
            })

            .state('tab_frm', {
                url: '/tab_frm',
                controller: 'TabFrmCtrl',
                templateUrl: 'template/tab_frm.html'
            })

            .state('contact_book_frm', {
                url: '/contact_book_frm',
                controller: 'ContactBookFrmCtrl',
                templateUrl: 'template/contact_book_frm.html'
            })

            .state('chat_frm', {
                url: '/chat_frm',
                controller: 'ChatFrmCtrl',
                templateUrl: 'template/chat_frm.html'
            })

            .state('iconFont_frm', {
                url: '/iconFont_frm',
                controller: 'IconFontFrmCtrl',
                templateUrl: 'template/iconfont_frm.html'
            })

            .state('list_counter_frm', {
                url: '/list_counter_frm',
                controller: 'ListCounterFrmCtrl',
                templateUrl: 'template/list_counter_frm.html'
            })

            .state('status_frm', {
                url: '/status_frm',
                controller: 'StatusFrmCtrl',
                templateUrl: 'template/status_frm.html'
            })

            .state('tips_frm', {
                url: '/tips_frm',
                controller: 'TipsFrmCtrl',
                templateUrl: 'template/tips_frm.html'
            })

            .state('search_frm', {
                url: '/search_frm',
                controller: 'SearchCtrl',
                templateUrl: 'template/searchbar_frm.html'
            })

            .state('range_frm', {
                url: '/range_frm',
                controller: 'RangeCtrl',
                templateUrl: 'template/range_frm.html'
            })

            .state('time_line_frm', {
                url: '/time_line_frm',
                controller: 'TimeLineFrmCtrl',
                templateUrl: 'template/timeline_frm.html'
            })

            .state('progress_frm', {
                url: '/progress_frm',
                controller: 'ProgressFrmCtrl',
                templateUrl: 'template/progress_frm.html'
            })

            .state('alert_frm', {
                url: '/alert_frm',
                controller: 'AlertFrmCtrl',
                templateUrl: 'template/alert_frm.html'
            })

            .state('waterfall_frm', {
                url: '/waterfall_frm',
                controller: 'WaterfallFrmCtrl',
                templateUrl: 'template/waterfall_frm.html'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                controller: 'TabCtrl',
                templateUrl: 'template/tabs.html'
            })

            .state('tab.index', {
                url: '/index',
                templateUrl: 'template/tab-index.html',
                controller: 'IndexCtrl'

            })

            .state('tab.circle', {
                url: '/circle',
                templateUrl: 'template/tab-circle.html',
                controller: 'CircleCtrl'
            })

            .state('tab.new', {
                url: '/new',
                templateUrl: 'template/tab-news.html',
                controller: 'NewCtrl'

            })

            .state('tab.my', {
                url: '/my',
                templateUrl: 'template/tab-my.html',
                controller: 'MyCtrl'
            })


        ;
        $urlRouterProvider.otherwise('/list');

    })
;
