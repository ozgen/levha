/**
 * Created by Ozgen on 12/9/16.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.definition', [])
        .config(routeConfig)

    /** @ngInject */
    function routeConfig($stateProvider) {

        $stateProvider
            .state('definition', {
                url: '/definition',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Tanımlamalar',
                sidebarMeta: {
                    icon: 'ion-navicon',
                    order: 300,
                },
                requireLogin: true,
                userRole: 'admin'
            }).state('definition.plate', {
            url: '/plate',
            templateUrl: 'app/pages/definition/plate/plateDefinition.html',
            title: 'Levha Tanımı',
            controller: 'plateDefCtrl',
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

