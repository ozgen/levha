(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users', [])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig($stateProvider) {

        $stateProvider
            .state('users', {
                url: '/users',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Kullanıcı Yönetimi',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 300,
                },
                requireLogin: true,
                userRole: 'admin'
            })
            .state('users.newUser', {
                templateUrl: 'app/pages/users/newUser/user.html',
                url: '/newUser',
                title: 'Yeni Kullanıcı Yarat',
                controller: 'newUserCtrl',
                controllerAs: 'vm',
                sidebarMeta: {
                    icon: 'ion-person-add',
                    order: 0,
                },
                requireLogin: true,
                userRole: 'admin'

            })
            .state('users.allUsers', {
                url: '/allUsers',
                templateUrl: 'app/pages/users/allUsers/allUsers.html',
                controller: "manageCtrl",
                controllerAs: "vm",
                title: 'Kullanıcı Yönetimi',
                sidebarMeta: {
                    order: 0,
                },
                requireLogin: true,
                userRole: 'admin'
            })
            .state('users.allUsers.detail', {
                url: '/user/detail',
                templateUrl: 'app/pages/users/allUsers/detail/detail.html',
                title: 'Kullanıcı',
                controller: "UserDetailCtrl",
                controllerAs: "vm",
                requireLogin: true,
                userRole: 'admin'
            })
            .state('users.operation', {
                templateUrl: 'app/pages/users/allUsers/operation/user_operation.html',
                url: '/users/operation',
                title: 'Kullanıcı Bilgilerini Güncelle',
                controller: 'UserOprCtrl',
                controllerAs: 'vm',
                requireLogin: true,
                userRole: 'admin'
            });
    }

})();
