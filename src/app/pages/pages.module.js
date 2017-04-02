(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
            'ui.router',

            'LoginCtrl',

            'BlurAdmin.pages.dashboard',
            'BlurAdmin.pages.plate',
            'BlurAdmin.pages.users',
            'BlurAdmin.pages.reports',
            'BlurAdmin.pages.definition',
            'BlurAdmin.pages.region'
        ])
        .config(routeConfig)
        .run(['$rootScope', '$state', 'AuthService', '$location',
            function ($rootScope, $state, AuthService, $location) {
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    $rootScope.location = $location;

                    if (toState.userRole !== undefined) {
                        if (!AuthService.checkRole(toState.userRole) && AuthService.isLoggedIn()) {
                            event.preventDefault();
                            $state.go('error');

                            return;

                        } else if (!AuthService.checkRegionAdmin()) {
                            event.preventDefault();
                            $state.go('error');

                            return;
                        }

                    }
                    if (toState.name == 'login' && fromState.name != 'login' && !AuthService.isLoggedIn()) {
                        return;
                    }
                    if (toState.requireLogin && AuthService.isLoggedIn()) {
                        return;
                    }
                    event.preventDefault();
                    $state.go('login');

                });
            }]);

    function routeConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go("dashboard");
        });

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "app/pages/auth/auth.html",
                controller: 'loginCtrl',
                requireLogin: false
            })
            .state('error', {
                url: "/error",
                templateUrl: "app/pages/auth/error.html",
                requireLogin: true
            })
    }

})();
