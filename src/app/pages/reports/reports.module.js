(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports', [])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig($stateProvider) {

        $stateProvider
            .state('reports', {
                url: '/reports',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Rapor Yönetimi',
                sidebarMeta: {
                    icon: 'ion-ios-book-outline',
                    order: 300,
                },
                requireLogin: true
            })
            .state('reports.new', {
                url: '/reports/new',
                title: 'Rapor Yarat',
                templateUrl: 'app/pages/reports/reportMng/reports.html',
                controller: 'reportMngCtrl',
                controllerAs: 'vm',
                sidebarMeta: {
                    icon: 'ion-ios-book-outline',
                    order: 300,
                },
                requireLogin: true
            })

    }

})();
