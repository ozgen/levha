/**
 * Created by Ozgen on 12/18/16.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.region', [])
        .config(routeConfig)

    /** @ngInject */
    function routeConfig($stateProvider) {

        $stateProvider
            .state('regi', {
                url: '/region',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Bölge/Şube Yönetimi',
                sidebarMeta: {
                    icon: 'ion-more',
                    order: 400,
                },
                requireLogin: true
            }).state('regi.zone', {
            url: '/zone',
            templateUrl: 'app/pages/region/zone/region.html',
            title: 'Bölge Tanımlama',
            controller: 'regionCtrl',
            controllerAs: 'vm',
            sidebarMeta: {
                icon: 'ion-plus',
                order: 1,
            },
            requireLogin: true,
            userRole: 'super_admin'

        }).state('regi.branch', {
            url: '/branch',
            templateUrl: 'app/pages/region/branch/branch.html',
            title: 'Şube Tanımlama',
            controller: 'branchCtrl',
            controllerAs: 'vm',
            sidebarMeta: {
                icon: 'ion-plus',
                order: 0,
            },
            requireLogin: true,
            userRole: 'admin'


        });
    }

})
();

