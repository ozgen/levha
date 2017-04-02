(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/pages/dashboard/dashboard.html',
                title: 'Dashboard',
                controller: 'smartTableCtrl',
                controllerAs: 'vm',
                sidebarMeta: {
                    icon: 'ion-android-home',
                    order: 0,
                },
                requireLogin: true
            });
    }

})();
