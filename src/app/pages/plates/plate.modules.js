
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate', [])
        .config(routeConfig)

    /** @ngInject */
    function routeConfig($stateProvider) {

        $stateProvider
            .state('plate', {
                url: '/plates',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Levha Yönetimi',
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: 300,
                },
                requireLogin: true
            }).state('plate.newplatereq', {
            url: '/newplatereq',
            templateUrl: 'app/pages/plates/newplate/newplate.html',
            title: 'Yeni Levha İsteği',
            controller: 'plateCtrl',
            controllerAs: 'vm',
            sidebarMeta: {
                icon: 'ion-plus',
                order: 0,
            },
            requireLogin: true
        }).state('plate.plate_management', {
            url: '/plate_management',
            templateUrl: 'app/pages/plates/plate_main/main.html',
            title: 'Levha Yönetimi',
            controller: 'plateMngCtrl',
            controllerAs: 'vm',
            sidebarMeta: {
                icon: 'ion-plus',
                order: 0,
            },
            requireLogin: true
        }).state('plate.bulkreq', {
            url: '/plate_bulk',
            templateUrl: 'app/pages/plates/bulk/bulk.html',
            title: 'Toplu Levha İsteği',
            controller: 'bulkReqCtrl',
            controllerAs: 'vm',
            sidebarMeta: {
                icon: 'ion-plus',
                order: 0,
            },
            requireLogin: true
        }).state('plate.bulkapprove', {
            url: '/plate_approve',
            templateUrl: 'app/pages/plates/plate_main/main.html',
            title: 'Levha Onay Ekranı',
            controller: 'plateMngCtrl',
            controllerAs: 'vm',
            sidebarMeta: {
                icon: 'ion-plus',
                order: 0,
            },
            requireLogin: true
        }).state('plate.addPlateReq', {
            url: '/addPlatereq',
            templateUrl: 'app/pages/plates/newplate/addPlate.html',
            title: 'Yeni Levha İsteği',
            controller: 'addPlateCtrl',
            requireLogin: true
        }).state('plate.plateProcess', {
            url: '/process',
            templateUrl: 'app/pages/plates/plate_main/process.html',
            title: 'Levha İşlem',
            controller: 'processCtrl',
            requireLogin: true
        });
    }

})
();
