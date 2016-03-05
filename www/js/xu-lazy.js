angular.module('xu-lazy', [])
    .directive('lazyContainer', [
        function () {
            var uid = 0;

            function getUid(el) {
                var __uid = el.data("__uid");
                if (!__uid) {
                    el.data("__uid", (__uid = '' + ++uid));
                }
                return __uid;
            }

            return {
                restrict: 'EA',
                controller: ['$scope', '$element', function ($scope, $element) {
                    var elements = {};

                    function onLoad() {
                        var $el = angular.element(this);
                        var uid = getUid($el);

                        $el.css('opacity', 1);

                        if (elements.hasOwnProperty(uid)) {
                            delete elements[uid];
                        }
                    }

                    function isVisible(elem) {
                        var containerRect = $element[0].getBoundingClientRect();
                        var elemRect = elem[0].getBoundingClientRect();
                        var xVisible, yVisible;
                        var offset = 50;

                        if (elemRect.bottom + offset >= containerRect.top &&
                            elemRect.top - offset <= containerRect.bottom) {
                            yVisible = true;
                        }

                        if (elemRect.right + offset >= containerRect.left &&
                            elemRect.left - offset <= containerRect.right) {
                            xVisible = true;
                        }

                        return xVisible && yVisible;
                    }

                    function checkImage() {
                        Object.keys(elements).forEach(function (uid) {
                            var obj = elements[uid],
                                iElement = obj.iElement,
                                iScope = obj.iScope;
                            if (isVisible(iElement) && iElement.tagName === 'IMG') {
                                iElement.attr('src', iScope.lazySrc);
                            }else if(isVisible(iElement) && iElement.tagName !== 'IMG'){
                                iElement.css({
                                    'background-image': 'url(' + iScope.backgroundLazySrc + ')',
                                    'opacity': 1,
                                    'background-repeat': 'no-repeat',
                                    'background-size': 'cover'

                                })
                            }
                        });
                    }

                    this.addImg = function (iScope, iElement, iAttrs) {
                        iElement.bind('load', onLoad);
                        iScope.$watch('lazySrc', function () {
                            var speed = "1s";
                            if (iScope.animateSpeed != null) {
                                speed = iScope.animateSpeed;
                            }
                            if (isVisible(iElement)) {
                                if (iScope.animateVisible) {
                                    iElement.css({
                                        'background-color': '#fff',
                                        'opacity': 0,
                                        '-webkit-transition': 'opacity ' + speed,
                                        'transition': 'opacity ' + speed
                                    });
                                }
                                iElement.attr('src', iScope.lazySrc);
                            } else {
                                var uid = getUid(iElement);
                                iElement.css({
                                    'background-color': '#fff',
                                    'opacity': 0,
                                    '-webkit-transition': 'opacity ' + speed,
                                    'transition': 'opacity ' + speed
                                });
                                elements[uid] = {
                                    iElement: iElement,
                                    iScope: iScope
                                };
                            }
                        });

                        iScope.$on('$destroy', function () {
                            iElement.unbind('load');
                            var uid = getUid(iElement);
                            if (elements.hasOwnProperty(uid)) {
                                delete elements[uid];
                            }
                        });
                    };

                    this.addBackground = function(iScope, iElement, iAttrs){
                        var img = document.createElement("img");
                        img.src = iAttrs.backgroundLazySrc;
                        img.id = 'IMG';
                        var IMG = document.getElementById('IMG');

                        $(img).bind('load', onLoad);
                        iScope.$watch('backgroundLazySrc', function () {
                            var speed = "1s";
                            if (iScope.animateSpeed != null) {
                                speed = iScope.animateSpeed;
                            }
                            if (isVisible(iElement)) {
                                if (iScope.animateVisible) {
                                    iElement.css({
                                        'background-color': 'url(' + iAttrs.backgroundLazySrc + ')',
                                        'opacity': 1,
                                        '-webkit-transition': 'opacity ' + speed,
                                        'transition': 'opacity ' + speed

                                    })
                                }

                                iElement.css({
                                    'background-image': 'url(' + iAttrs.backgroundLazySrc + ')',
                                    'background-repeat': 'no-repeat',
                                    'background-size': 'cover',
                                    'opacity': 1,
                                    '-webkit-transition': 'opacity ' + speed,
                                    'transition': 'opacity ' + speed,

                                })

                            } else {
                                var uid = getUid(iElement);
                                iElement.css({
                                    'background-color': '#ccc',
                                    'opacity': 0,
                                    '-webkit-transition': 'opacity ' + speed,
                                    'transition': 'opacity ' + speed
                                });
                                elements[uid] = {
                                    iElement: iElement,
                                    iScope: iScope
                                };
                            }
                        });

                        iScope.$on('$destroy', function () {
                            $(img).unbind('load');
                            var uid = getUid(iElement);
                            if (elements.hasOwnProperty(uid)) {
                                delete elements[uid];
                            }
                        });
                    };

                    $element.bind('scroll', checkImage);
                    $element.bind('resize', checkImage);
                }]
            };
        }
    ])
    .directive('lazySrc', [
        function () {
            return {
                restrict: 'A',
                require: '^lazyContainer',
                scope: {
                    lazySrc: '@',
                    animateVisible: '@',
                    animateSpeed: '@'
                },
                link: function (iScope, iElement, iAttrs, containerCtrl) {
                    containerCtrl.addImg(iScope, iElement, iAttrs);
                }
            };
        }
    ])

    .directive('backgroundLazySrc', [
        function () {
            return {
                restrict: 'A',
                require: '^lazyContainer',
                scope: {
                    backgroundLazySrc: '@',
                    animateVisible: '@',
                    animateSpeed: '@'
                },
                link: function (iScope, iElement, iAttrs, containerCtrl) {
                    containerCtrl.addBackground(iScope, iElement, iAttrs);
                }
            };
        }
    ])
;
