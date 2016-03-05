angular.module('NewsApp.services', [])

    .factory('MemberService', [function () {
        return {
            getInfo: function () {
                var info = localStorage['member'];// jshint ignore:line
                var userInfo;
                if (info) {
                    userInfo = JSON.parse(info);
                }
                return userInfo;
            },

            setInfo: function (data) {
                var userData = JSON.stringify(data);
                localStorage['member'] = userData;// jshint ignore:line
            },

            getAccessKey: function () {
                var info = localStorage['member'];// jshint ignore:line
                var userInfo;
                if (info) {
                    userInfo = JSON.parse(info);
                } else {
                    return '';
                }

                return userInfo.accesskey;
            },

            deleteMember: function () {
                localStorage.removeItem('member');
            }

        };
    }])

    .factory('LocalService', [function () {
        var LocalService = {
            getInfo: function (name, callback) {
                var info = LocalService.getLocal(name),
                    JSONInfo;
                if (info) {
                    JSONInfo = JSON.parse(info);
                }
                callback && callback(JSONInfo);// jshint ignore:line
            },

            setInfo: function (name, data) {
                LocalService.getLocal(name, JSON.stringify(data));
            },

            getLoacalItem: function (name, item, callback) {
                var info = LocalService.getLocal(name),
                    JSONInfo = JSON.parse(info);
                callback && callback(JSONInfo[item]);// jshint ignore:line
            },

            initLoacal: function (name) {
                LocalService.setInfo(name, '');
            },

            setLocalItem: function (name, item, data) {
                var info = LocalService.getLocal(name),
                    JSONInfo = JSON.parse(info);
                JSONInfo[item] = data;
                LocalService.getLocal(name, JSON.stringify(JSONInfo));
            },

            getLocal: function (name, data) {
                var returnData = localStorage[name];
                if (returnData && !data) {
                    return returnData;
                } else if (!returnData && !data) {
                    localStorage[name] = '';
                    return '';
                } else if (data) {
                    localStorage[name] = data;
                }
            }

        };

        return LocalService;
    }])

    .factory('AuthorService', ['ConfigurationService', 'ApiResource', 'MemberService', function (ConfigurationService, ApiResource, MemberService) {
        var AuthorService = {
            getCode: function (returnUrl) {
                //var url = window.location.origin+window.location.pathname;
                console.log(ConfigurationService.wechatPay.getway);
                var localUrl = 'http://wx.tao3w.com/youyan/www/index.html#/tab/my';//window.location.href,
                url = ConfigurationService.wechatPay.getway + 'authorize?appid=' + ConfigurationService.wechatPay.testId + '&redirect_uri=' + encodeURIComponent(returnUrl) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

                window.location = url;
            },

            getAccessToken: function (code, callback) {
                var url = ConfigurationService.wechatPay.accessway + 'access_token?appid=' + ConfigurationService.wechatPay.testId + '&secret=' + ConfigurationService.wechatPay.testSecret + '&code=' + code + '&grant_type=authorization_code',
                    postUrl = encodeURIComponent(url);
                AuthorService.doAjax(postUrl, function (data) {
                    var openId = data.openid,
                        access_token = data.access_token;
                    //alert(JSON.stringify(data));
                    AuthorService.getUserInfo(openId, access_token, function (data) {

                        callback && callback(data);
                    });
                });
            },

            getUserInfo: function (openid, access_token, callback) {
                var url = ConfigurationService.wechatPay.infoway + 'userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',
                    postUrl = encodeURIComponent(url);
                AuthorService.doAjax(postUrl, function (data) {
                    //alert(JSON.stringify(data));
                    callback && callback(data);
                })
            },

            getInfo: function (code, callback) {
                AuthorService.getAccessToken(code, function (data) {
                    //alert(JSON.stringify(data));

                    callback && callback(data);
                })
            },

            doAjax: function (url, callback) {
                $.ajax({
                    type: 'GET',
                    url: ConfigurationService.doAjax,
                    data: {
                        url: url
                    },
                    dataType: 'json',
                    success: function (data) {
                        callback && callback(data);
                    },
                    error: function (data) {
                        alert('error');
                    }
                });
            },

            getAccesskey: function (openid, callback) {
                ApiResource.getAccesskey(openid, function (data) {
                    MemberService.setInfo(data);
                    callback && callback();
                });
            },

            doRefreshAccesskey: function () {
                ApiResource.doRefreshAccesskey(function (res) {
                    MemberService.setInfo(res);
                });
            }

        }

        return AuthorService;
    }])

    .factory('ApiAuthenticate', ['ConfigurationService', function (ConfigurationService) {
        return {
            sortParams: function (params) {
                var sorted = {};
                var a = [];

                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        a.push(key);
                    }
                }

                a.sort();

                for (var i = 0; i < a.length; i++) {
                    sorted[a[i]] = params[a[i]];
                }

                return sorted;
            },

            concatSortedParamsValues: function (params) {
                var a = [];
                params.encrypt = 'none';
                params.platform = 'web';
                params.appkey = ConfigurationService.huaooApiPrivateKey;
                params = this.sortParams(params);
                for (var key in params) {
                    if (params.hasOwnProperty(key) && !(params[key] instanceof File) && !(params[key] instanceof Array)) {
                        if (params[key] !== undefined) {
                            if (params[key] || key == 'anonymous' || key == 'userid' || key == 'parentid') {
                                a.push(key);
                                a.push(params[key]);
                            }
                        }

                    }
                }
                //console.log(a);
                return a.join('');
            },

            getTimestamp: function (time) {
                if (typeof time === 'undefined') {
                    time = new Date();
                }

                return Math.floor(new Date(time).getTime() / 1000);
            },

            appendTimestampAndConcatSortedParamsValues: function (params) {
                params.timestamp = this.getTimestamp(new Date());

                return this.concatSortedParamsValues(params);
            },

            computeDynamicPrivateKey: function (params) {
                var orgstr = this.appendTimestampAndConcatSortedParamsValues(params) + ConfigurationService.huaooApiSecret;
                return orgstr;
            },

            computeDynamicPublicKey: function (params) {
                return md5(this.computeDynamicPrivateKey(params));//.toUpperCase();
            },

            processParams: function (params) {
                params.signature = this.computeDynamicPublicKey(params);
            },

            interceptHttpRequest: function (config) {
                if (!config.url || !config.url.startsWithOneOf(ConfigurationService.huaooApi)) {
                    return config;
                }

                if (/GET|JSONP/i.test(config.method)) {
                    if (config.params === undefined) {
                        config.params = {};
                    }

                    this.processParams(config.params);
                } else {
                    if (config.data === undefined) {
                        config.data = {};
                    }

                    this.processParams(config.data);
                }
                return config;
            }
        };
    }])

    .factory('ApiAuthenticateInterceptor', ['ApiAuthenticate', function (ApiAuthenticate) {
        return {
            'request': function (config) {
                //console.log(config);
                //console.log(HuaooApiAuthenticate.interceptHttpRequest(config));
                return ApiAuthenticate.interceptHttpRequest(config);
            }
        };
    }])

    //负责处理ApiResource传递过来的逻辑并传给Angular http服务
    .factory('ApiService', ['$q', '$http', 'ConfigurationService', 'MemberService', function ($q, $http, ConfigurationService, MemberService) {
        function promiseResponse(ApiPromiseResponse, successCallback, errorCallback) {
            ApiPromiseResponse
                .success(function (data, status, fun, promise) {
                    if (data && (typeof data.data !== 'undefined') && (typeof data.info !== 'undefined')) {
                        data.code = -1;
                        data.message = data.info + ' (API 返回的数据违反了约定)';
                    }

                    if (data && (typeof data.code !== 'undefined') && data.code.toString() === '0' && (typeof data.data !== 'undefined')) {
                        successCallback(data, status, fun, promise);
                    } else {
                        console.error('=== error returned by 200 OK ===');
                        console.error(data);
                        errorCallback(data, status, fun, promise);
                    }
                })
                .error(function (data, status, fun, promise) {
                    errorCallback(data, status, fun, promise);
                });
        }

        function returnPromiseResponse(res) {
            var deferred = $q.defer();
            promiseResponse(res, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        return {
            getUserFollow: function (data) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.getUserFollow,
                    params: data
                }));
            },

            getProductrecommendList: function (data) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.getProductrecommendList,
                    params: data
                }));

            },
            getHomeModel: function (pageIndex) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.getHomeModel,
                    params: {
                        page: pageIndex
                    }
                }));
            },

            queryProducts: function (data) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.queryProducts,
                    params: {
                        page: data.pageIndex,
                        category : data.category,
                        attribute : data.attribute,
                        provider : data.provider
                    }

                }));
            },

            timeSale: function () {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.timeSale
                }));
            },

            queryProductDetails: function (id) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    params: {
                        id: id
                    },
                    url: ConfigurationService.huaooApi.queryProductDetails
                }));
            },

            queryCategorys: function () {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.queryCategorys
                }));
            },

            regist: function (data) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.regist,
                    params: {
                        info: data
                    }
                }));
            },

            getAccesskey: function (openid) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.accesskey,
                    params: {
                        openid: openid
                    }
                }));
            },

            queryOrders: function (page, state) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    params: {
                        page: page,
                        state: state,
                        accesskey: MemberService.getAccessKey()
                    },
                    url: ConfigurationService.huaooApi.queryOrders
                }));
            },

            doRefreshAccesskey: function () {
                var info = MemberService.getInfo(),
                    accesskey = info.accesskey;
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.doRefreshAccesskey,
                    params: {
                        accesskey: accesskey
                    }
                }));
            },

            orderBuy: function (id) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.order,
                    params: {
                        accesskey: MemberService.getAccessKey(),
                        productid: id
                    }
                }));
            },

            orderStats: function () {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.orderStats,
                    params: {
                        accesskey: MemberService.getAccessKey()
                    }
                }));
            },

            queryOrder: function (sn) {
                return returnPromiseResponse($http({
                    method: 'GET',
                    url: ConfigurationService.huaooApi.queryOrder,
                    params: {
                        sn: sn,
                        accesskey: MemberService.getAccessKey()
                    }
                }));
            }

        };
    }])

    //负责处理ApiResource传递给ApiService的逻辑并统一处理回调错误的服务
    .factory('ApiHandler', ['ApiService', '$rootScope', function (ApiService, $rootScope) {
        var ApiHandler = {};
        for (var methodName in ApiService) {
            ApiHandler[methodName] = (function (m) {// jshint ignore:line
                return function () {
                    var successCallback = null;
                    var errorCallback = null;
                    var args = Array.prototype.slice.call(arguments);

                    if (typeof arguments[arguments.length - 1] === 'function') {
                        successCallback = arguments[arguments.length - 1];

                        args.splice(args.length - 1, 1);

                        if (typeof arguments[arguments.length - 2] === 'function') {
                            successCallback = arguments[arguments.length - 2];
                            errorCallback = arguments[arguments.length - 1];

                            args.splice(args.length - 1, 1);
                        }
                    }

                    $rootScope.$broadcast('loading:show', '正在加载中，请稍候...');
                    var promise = ApiService[m]
                        .apply(this, args);
                    //console.log(promise);
                    if (!promise) {
                        $rootScope.$broadcast('loading:hide');
                        return '';
                    }

                    promise
                        .then(function (data) {
                            $rootScope.$broadcast('loading:hide');
                            if (typeof successCallback !== 'function') {
                                //DialogsService.alertHuaooApiMessage(data);
                                //var message = data;
                                //if (typeof data === 'object') {
                                //    message = JSON.stringify(data);
                                //}

                                //console.log('>>> Got data from api <<<');
                                //console.log(message);
                                //console.log('=== Got data from api ===');
                            } else {
                                successCallback(data);
                            }

                            return data;
                        }, function (data) {
                            console.log(data);
                            $rootScope.$broadcast('loading:hide');
                            var message = '调用方法 "' + m + '" 时遇到错误。';
                            console.error(message + '参数如下：');
                            console.error(args);
                            console.error(message + 'Error Statck 如下：');
                            console.trace();
                            if (typeof errorCallback !== 'function') {
                                //console.log('===========');
                                //console.log(data);
                                //ErrorReportingService.alertHuaooApiMessage(data, m);
                            } else {
                                errorCallback(data);
                            }

                            return data;
                        });

                    return promise;
                };
            })(methodName);
        }

        return ApiHandler;
    }])

    //负责处理controller传递过来的逻辑并传给ApiService服务
    .factory('ApiResource', ['ApiHandler', 'ApiMapper', function (ApiHandler, ApiMapper) {
        return {
            getHomeModel: function (pageIndex, callback) {
                return ApiHandler.getHomeModel(pageIndex, function (res) {
                    var returnData = res.data.recommend.map(ApiMapper.mapHomeModel);
                    callback && callback(returnData);// jshint ignore:line
                });
            },

            timeSale: function (callback) {
                return ApiHandler.timeSale(function (res) {
                    var returnData = ApiMapper.mapTimeSale(res.data);
                    callback && callback(returnData);// jshint ignore:line
                });
            },

            queryProducts: function (data, callback) {
                return ApiHandler.queryProducts(data, function (res) {
                    var returnData = res.data.products.map(ApiMapper.mapQueryProducts);
                    callback && callback(returnData);// jshint ignore:line
                });
            },

            queryProductDetails: function (id, callback) {
                return ApiHandler.queryProductDetails(id, function (res) {
                    var returnData = ApiMapper.mapQueryPrductDetails(res.data);
                    callback && callback(returnData);// jshint ignore:line
                });
            },

            queryCategorys: function (callback) {
                return ApiHandler.queryCategorys(function (res) {
                    var returnData = ApiMapper.mapQueryCategorys(res.data);
                    callback && callback(returnData);// jshint ignore:line
                });
            },

            regist: function (data, callback) {
                return ApiHandler.regist(data, function (res) {
                    callback && callback(res.data.openid);// jshint ignore:line
                });
            },

            getAccesskey: function (openid, callback) {
                return ApiHandler.getAccesskey(openid, function (res) {
                    callback && callback(res.data);//jshint ignore:line
                });
            },

            queryOrders: function (page, state, callback) {
                return ApiHandler.queryOrders(page, state, function (res) {
                    var returnData = res.data.orders.map(ApiMapper.mapQueryOrders);
                    callback && callback(returnData);//jshint ignore:line
                })
            },

            doRefreshAccesskey: function (callback) {
                return ApiHandler.doRefreshAccesskey(function (res) {
                    callback && callback(res.data);//jshint ignore:line
                });
            },

            orderBuy: function (id, callback) {
                return ApiHandler.orderBuy(id, function (res) {
                    var returnData = ApiMapper.mapOrder(res.data);
                    callback && callback(returnData);//jshint ignore:line
                });
            },

            orderStats: function (callback) {
                return ApiHandler.orderStats(function (res) {
                    var returnData = ApiMapper.mapStats(res.data);
                    callback && callback(returnData);//jshint ignore:line
                });
            },

            queryOrder: function (sn, callback) {
                return ApiHandler.queryOrder(sn, function (res) {
                    var returnData = ApiMapper.mapOrders(res.data);
                    callback && callback(returnData);//jshint ignore:line
                });
            }


        };
    }])

    .factory('ApiMapper', ['$sce', function ($sce) {
        function orderStatus(r) {
            switch (r.state) {
                case 'needcosume' :
                    return {
                        words: '待消费',
                        status: 1
                    };
                case 'close' :
                    return {
                        words: '交易关闭',
                        status: 2
                    };
                case 'finish' :
                    return {
                        words: '交易完成',
                        status: 2
                    };
                case 'needpay' :
                    return {
                        words: '待付款',
                        status: 0
                    };
                case 'refunding' :
                    return {
                        words: '退款中',
                        status: 2
                    };
                case 'refund' :
                    return {
                        words: '已关闭',
                        status: 2
                    };
            }
        }

        function changeMoney(r){
            return r/100;
        }

        return {
            mapHomeModel: function (r) {
                return {
                    id: r.id,
                    style: r.style,
                    title: r.name,
                    category: {
                        id: r.category.id,
                        title: r.category.title
                    },
                    products: r.products.map(function (d) {
                        return {
                            id: d.id,
                            price: changeMoney(d.price),
                            sale: changeMoney(d.sale),
                            title: d.title,
                            picture: d.image,
                            orders: d.orders ? d.orders : 0
                        }
                    })
                };
            },

            mapQueryProducts: function (r) {
                return {
                    id: r.id,
                    attribute: r.attribute,
                    title: r.title,
                    price: changeMoney(r.price),
                    sale: changeMoney(r.sale),
                    beginTime: r.begintime,
                    endTime: r.endtime,
                    noteService: r.noteservice,
                    noteConsume: r.noteconsume,
                    noteCost: r.notecost,
                    introduce: r.introduce,
                    flow: r.flow,
                    operator: r.operator,
                    categories: {
                        id: r.categories.id,
                        title: r.categories.title
                    },
                    orders: r.orders,
                    visitors: r.visitors,
                    partner: {
                        id: r.provider.id,
                        unit: r.provider.unit,
                        introduce: r.provider.introduce
                    },
                    picture: {
                        original: r.images.original,
                        thumb: r.images.thumb
                    },
                    productRepertory: r.productrepertory
                };
            },

            mapTimeSale: function (r) {
                return {
                    id: r.id,
                    title: r.title,
                    picture: r.images,
                    beginTime: r.begintime,
                    endTime: r.endtime * 1000
                };
            },

            mapQueryPrductDetails: function (r) {
                return {
                    id: r.id,
                    title: r.title,
                    attribute: r.attribute,
                    price: changeMoney(r.price),
                    sale: changeMoney(r.sale),
                    beginTime: r.begintime,
                    endTime: r.endtiem,
                    note: {
                        service: r.note.service,
                        consume: r.note.consume,
                        cost: r.note.cost
                    },
                    noteService: r.noteService,
                    noteConsume: r.noteconsume,
                    noteCost: r.notecost,
                    introduce: $sce.trustAsHtml(r.introduce),
                    flow: $sce.trustAsHtml(r.flow),
                    orders: r.orders,
                    picture: {
                        original: r.images.original,
                        thumb: r.images.thumb
                    },
                    operator: r.operator,
                    categories: {
                        id: r.categories.id,
                        title: r.categories.title
                    },
                    provider: {
                        id: r.provider.id,
                        name: r.provider.name,
                        address: r.provider.address,
                        introduce: r.provider.introduce,
                        operator: r.provider.operator
                    },
                    repertory: {
                        amount: r.repertory.amount,
                        orders: r.repertory.orders,
                        visitors: r.repertory.visitors,
                        cheaters_orders: r.repertory.cheaters_orders,
                        cheaters_visitors: r.repertory.cheaters_visitors
                    }
                }
            },

            mapQueryCategorys: function (r) {
                return {
                    total: r.total,
                    categorys: r.categorys.map(function (d) {
                        return {
                            id: d.id,
                            title: d.title
                        };
                    })
                }
            },

            mapQueryOrders: function (r) {
                return {
                    sn: r.sn,
                    money: changeMoney(r.money),
                    state: orderStatus(r),
                    code: r.code,
                    time: r.createtime * 1000,
                    product: {
                        title: r.product.title,
                        price: changeMoney(r.product.price),
                        sale: changeMoney(r.product.sale),
                        picture: r.product.images
                    }
                }
            },

            mapOrder: function (r) {
                return {
                    sn: r.sn,
                    money: changeMoney(r.money),
                    state: r.state,
                    createtime: r.createtime
                };
            },

            mapStats: function (r) {
                return {
                    close: r.close,
                    finish: r.finish,
                    needConsume: r.needconsume,
                    needPay: r.needpay,
                    refund: r.refund,
                    refunding: r.refunding
                };
            },

            mapOrders: function(r){
                return {
                    code: r.code,
                    createTime: r.createtime,
                    money: changeMoney(r.money),
                    sn: r.sn,
                    state: r.state,
                    product: {
                        price: changeMoney(r.product.price),
                        sale: changeMoney(r.product.sale),
                        title: r.product.title,
                        images: r.product.images[0]
                    }
                };
            }

        };
    }])

    .service('UI', ['$http', '$window', '$q', '$ionicLoading', '$timeout', function ($http, $window, $q, $ionicLoading, $timeout) {
        this.toast = function (msg, duration, position) {
            if (typeof msg === 'object') {
                msg = JSON.stringify(msg);
            }

            if (!duration)
                duration = 'short';
            if (!position)
                position = 'center';

            // … fallback / customized $ionicLoading:
            $ionicLoading.show({
                template: '<div class="toast-fallback">' + msg + '</div>',
                noBackdrop: true,
                hideOnStateChange: false,
                duration: (duration == 'short' ? 2000 : 5000)
            });
        };

        this.loading = {
            show: function (msg) {
                $ionicLoading.show({
                    //template: '<ion-spinner icon="ripple" class="spinner-fff" style="stroke: #fff;fill: #fff;"></ion-spinner><p class="font-14 no-margin">' + msg + '</p>',
                    template: '<img src="svg/puff.svg" width="40" height="40" alt="" ><br/><p class="font-14 no-margin">' + msg + '</p>',
                    noBackdrop: false
                    //duration: 3000
                });
            },

            hide: function () {
                $ionicLoading.hide();
            }
        };

    }])

    .factory('Chats', [function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    }])

    .factory('WechatService', ['ConfigurationService', '$http', 'AppUrlHelper', 'LocalService', 'MemberService', function (ConfigurationService, $http, AppUrlHelper, LocalService, MemberService) {
        var weChat = {},
            config,
            self = {};

        function checkTicket() {
            var ticket = LocalService.getLocal('ticket'),
                ticketObj;
            if (ticket) {
                ticketObj = JSON.parse(ticket);
                if (self.getTimestamp() - ticketObj.time >= 7000) {
                    return '';
                } else {
                    return ticketObj.ticket;
                }
            } else {
                return '';
            }
        }

        self.getSigNature = function () {
            var returnTicket = checkTicket(),
                signature;

           /* if (returnTicket) {
                signature = self.sha1Sign(returnTicket);
                self.doConfig(config);
            } else {*/
                var urlToken = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + ConfigurationService.wechatPay.testId/*appId*/ + '&secret=' + ConfigurationService.wechatPay.testSecret/*appSecret*/;
                self.doAjax(urlToken, function (data) {
                    var urlJsApi = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + data.access_token + '&type=jsapi';
                    self.doAjax(urlJsApi, function (val) {
                        var localData = {ticket: val.ticket, time: self.getTimestamp(), accessToken: data.access_token};
                        LocalService.getLocal('ticket', JSON.stringify(localData));
                        signature = self.sha1Sign(val.ticket);

                        self.doConfig(config);
                    });
                });
           // }

        };

        self.doConfig = function (data) {
            console.log(config);
            wx.config(config);

            wx.ready(function () {
                //alert(ConfigurationService.initStatus);
                ConfigurationService.initStatus = true;
               // alert(ConfigurationService.initStatus)
            });

            wx.error(function (res) {
                alert('config验证不通过');
                ConfigurationService.initStatus = false;
            });

        };

        self.doAjax = function (url, callback) {
            $.ajax({
                type: 'GET',
                url: 'http://wx.tao3w.com/author/index.php',
                data: {
                    url: url
                },
                dataType: 'json',
                success: function (data) {
                    callback && callback(data);// jshint ignore:line
                },
                error: function (data) {
                   // alert('error');
                }
            });
        };

        self.sha1 = function (s) {
            var shaObj = new jsSHA('SHA-1', 'TEXT');
            shaObj.update(s);
            return shaObj.getHash('HEX');
        };

        self.getCurrentUrlWithoutHash = function () {
            var url = window.location.href;
            var indexOfHash = url.indexOf('#');
            if (indexOfHash >= 0) {
                url = url.substr(0, indexOfHash);
            }

            return url;
        };

        self.sha1Sign = function (ticket) {
            console.log(self.getCurrentUrlWithoutHash());
            var s = 'jsapi_ticket=' + ticket + '&noncestr=' + config.nonceStr + '&timestamp=' + config.timestamp + '&url=' + self.getCurrentUrlWithoutHash();

            config.signature = self.sha1(s);
            console.log(s);

            return config.signature;
        };

        self.guid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '' + s4() + '' + s4() + '' +
                s4() + '' + s4() + s4() + s4();
        };

        self.getTimestamp = function () {
            return Math.floor((new Date()).getTime() / 1000);
        };

        self.initConfig = function () {
            config = {
                debug: true,
                appId: ConfigurationService.wechatPay.testId,
                timestamp: self.getTimestamp(),
                nonceStr: self.guid(),
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'onVoicePlayEnd',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            };

        };
        /* weChat.initConfig = function(){

         };*/
        var images = {
                localId: [],
                serverId: []
            },
            codes = [];

        return {
            initConfig: function () {
                self.initConfig();
                self.getSigNature();
            },

            checkJsApi: function (methods, callback) {
                wx.checkJsApi({
                    jsApiList: methods,
                    success: function (res) {
                        //alert(JSON.stringify(res));
                        callback && callback(res);// jshint ignore:line
                    },
                    error: function (res) {
                        alert('error');
                    }
                });
            },

            onMenuShareAppMessage: function (data, trigger, success, cancel) {
                wx.onMenuShareAppMessage({
                    title: data.title,
                    desc: data.desc,
                    link: data.link,
                    imgUrl: data.imgUrl,
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                        alert('用户点击发送给朋友');
                        trigger && trigger('用户点击发送给朋友');// jshint ignore:line
                    },
                    success: function (res) {
                        alert('已分享');
                        success && success('已分享');// jshint ignore:line
                    },
                    cancel: function (res) {
                        alert('已取消');
                        cancel && cancel('已取消');// jshint ignore:line
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                        cancel && cancel('失败');// jshint ignore:line
                    }
                });
            },

            onMenuShareTimeline: function (data, callback) {
                wx.onMenuShareTimeline({
                    title: data.title,
                    link: data.link,
                    imgUrl: data.imgUrl,
                    trigger: function (res) {
                        alert('用户点击分享到朋友圈');
                        callback && callback('用户点击分享到朋友圈');// jshint ignore:line
                    },
                    success: function (res) {
                        alert('已分享');
                        callback && callback('已分享');// jshint ignore:line
                    },
                    cancel: function (res) {
                        alert('已取消');
                        callback && callback('已取消');// jshint ignore:line
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                        callback && callback(res);// jshint ignore:line
                    }
                });
            },

            onMenuShareQQ: function (data, callback) {
                wx.onMenuShareQQ({
                    title: data.title,
                    desc: data.desc,
                    link: data.link,
                    imgUrl: data.imgUrl,
                    trigger: function (res) {
                        alert('用户点击发送qq');
                        callback && callback('用户点击发送qq');// jshint ignore:line
                    },
                    success: function (res) {
                        alert('已分享');
                        callback && callback('已分享');// jshint ignore:line
                    },
                    cancel: function (res) {
                        alert('已取消');
                        callback && callback('已取消');// jshint ignore:line
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                        callback && callback('失败');// jshint ignore:line
                    }
                });
            },

            onMenuShareWeibo: function (data, callback) {
                wx.onMenuShareWeibo({
                    title: data.title,
                    desc: data.desc,
                    link: data.link,
                    imgUrl: data.imgUrl,
                    trigger: function (res) {
                        alert('用户点击发送weibo');
                        callback && callback('用户点击发送weibo');// jshint ignore:line
                    },
                    success: function (res) {
                        alert('已分享');
                        callback && callback('已分享');// jshint ignore:line
                    },
                    cancel: function (res) {
                        alert('已取消');
                        callback && callback('已取消');// jshint ignore:line
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                        callback && callback('失败');// jshint ignore:line
                    }
                });
            },

            onMenuShareQZone: function (data, callback) {
                wx.onMenuShareQZone({
                    title: data.title,
                    desc: data.desc,
                    link: data.link,
                    imgUrl: data.imgUrl,
                    trigger: function (res) {
                        alert('用户点击发送QZone');
                        callback && callback('用户点击发送QZone');// jshint ignore:line
                    },
                    success: function (res) {
                        alert('已分享');
                        callback && callback('已分享');// jshint ignore:line
                    },
                    cancel: function (res) {
                        alert('已取消');
                        callback && callback('已取消');// jshint ignore:line
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                        callback && callback('失败');// jshint ignore:line
                    }
                });
            },

            chooseImage: function (callback) {
                wx.chooseImage({
                    success: function (res) {
                        images.localId = res.localIds;
                        callback && callback(res);// jshint ignore:line
                    }
                });
            },

            previewImage: function (activeIndex, pictures) {
                wx.previewImage({
                    current: pictures[activeIndex],
                    urls: pictures
                });
            },

            getNetworkType: function (callback) {
                wx.getNetworkType({
                    success: function (res) {
                        alert(res.networkType);
                        callback && callback(res.networkType);// jshint ignore:line
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                        callback && callback('error');// jshint ignore:line
                    }
                });
            },

            getLocation: function (callback) {
                wx.getLocation({
                    success: function (res) {
                        callback && callback(res);// jshint ignore:line
                    },
                    cancel: function (res) {
                        alert('用户拒绝授权获取地理位置');
                    }
                });
            },

            getLocationMap: function (data) {
                wx.openLocation({
                    latitude: data ? data.lat : 23.099994,
                    longitude: data ? data.lng : 113.324520,
                    name: '绿岸科创园',
                    address: '杭州市文一西路888号',
                    scale: 14,
                    infoUrl: 'http://m.mayfou.com'
                });
            },

            closeWindow: function () {
                wx.closeWindow();
            },

            scanQRCode: function (callback) {
                wx.scanQRCode({
                    needResult: 1,
                    desc: 'scanQRCode desc',
                    success: function (res) {
                        callback && callback(res);// jshint ignore:line
                    }
                });
            },

            chooseWXPay: function (data, callback) {
                self.doAjax(ConfigurationService.wxHelper+'&out_trade_no='+data.sn+'&subject='+encodeURIComponent(data.body)+'&accesskey='+MemberService.getAccessKey(), function(res){
                    wx.chooseWXPay({
                        timestamp: res.timeStamp,
                        nonceStr: res.nonceStr,
                        package: res.package,
                        signType: res.signType,
                        paySign: res.paySign,
                        success: function (res) {
                            callback && callback(res);// jshint ignore:line
                        }
                    });

                   /* WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        res,
                        function (res) {
                            alert(6666);
                            WeixinJSBridge.log(res.err_msg);

                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                success(res);
                            } else {
                                error(res);
                            }
                        }
                    );*/
                });


            },

            openProductSpecificView: function (data) {
                wx.openProductSpecificView({
                    productId: data.productId,
                    extInfo: data.extInfo
                });
            },

            addCard: function (data, callback) {
                wx.addCard({
                    cardList: /*[
                     {
                     cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                     cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f54dae85e7807cc9525ccc127b4796e021f05b33"}'
                     },
                     {
                     cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                     cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f54dae85e7807cc9525ccc127b4796e021f05b33"}'
                     }
                     ]*/data,
                    success: function (res) {
                        alert('已添加卡券：' + JSON.stringify(res.cardList));
                        callback && callback(res);// jshint ignore:line
                    }
                });
            },

            chooseCard: function (card) {
                wx.chooseCard({
                    cardSign: '8ef8aa071f1d2186cb1355ec132fed04ebba1c3f',
                    timestamp: 1437997723,
                    nonceStr: 'k0hGdSXKZEj3Min5',
                    success: function (res) {
                        res.cardList = JSON.parse(res.cardList);
                        encrypt_code = res.cardList[0]['encrypt_code'];// jshint ignore:line
                        alert('已选择卡券：' + JSON.stringify(res.cardList));
                        /*decryptCode(encrypt_code, function (code) {
                         codes.push(code);
                         });*/
                    }
                });
            },

            openCard: function () {
                if (codes.length < 1) {
                    alert('请先使用 chooseCard 接口选择卡券。');
                    return false;
                }
                var cardList = [];
                for (var i = 0; i < codes.length; i++) {
                    cardList.push({
                        cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                        code: codes[i]
                    });
                }
                wx.openCard({
                    cardList: cardList
                });
            }

        };

        return weChat;// jshint ignore:line

    }])

    .factory('LoadMoreHelpper', [function () {
        return {
            checkLoadStatus: function (len) {
                var length = len || len == 0 ? len : 20;
                if (length < 20) {
                    return false;
                } else {
                    return true;
                }
            }
        };
    }])

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
