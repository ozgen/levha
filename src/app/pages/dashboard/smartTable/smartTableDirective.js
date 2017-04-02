/**
 * Created by Eray on 20.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('smartTableHome', smartTableHome)
        .directive('searchWatchModel', function () {
            return {
                require: '^stTable',
                scope: {
                    searchWatchModel: '='
                },
                link: function (scope, ele, attr, ctrl) {
                    var table = ctrl;
                    scope.$watch('searchWatchModel', function (val) {
                        ctrl.search(val);
                    });

                }
            };
        });

    /** @ngInject */
    function smartTableHome() {
        return {
            restrict: 'E',
            controller: 'smartTableCtrl',
            templateUrl: 'app/pages/dashboard/smartTable/smartTable.html'
        };
    }
})();