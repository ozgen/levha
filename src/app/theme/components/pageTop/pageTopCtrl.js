/**
 * Created by Eray on 11.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($rootScope, $scope, SweetAlert, AuthService, toastr, $cookieStore, $uibModal) {

        $scope.$watch('search', function (value) {
            $rootScope.$broadcast('Search', value);
        });


        $scope.pictureName = $cookieStore.get('loggedin').pictureName;


        /*
         Idle control
         */
        $scope.$on('IdleStart', function () {
            toastr.info('Oturumunuz 10 saniye sonra kapatılacak', {timeOut: 10000});
        });

        $scope.$on('IdleEnd', function () {
            toastr.clear();
        });

        $scope.$on('IdleTimeout', function () {
            $scope.logout(null);
        });

        $scope.logout = function (cnt) {

            if (cnt == 'X') {
                SweetAlert.swal({
                        title: "Çıkış",
                        text: "Çıkış yapmak istediğinizden emin misiniz?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        cancelButtonText: "Hayır",
                        confirmButtonText: "Evet",
                        closeOnConfirm: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            // call logout from service
                            AuthService.logout()
                                .then(function () {
                                    location.reload();
                                })
                        }
                    });
            } else {
                // call logout from service
                AuthService.logout()
                    .then(function () {
                        location.reload();
                    })
            }

        };

        $scope.openCurrentUserDetail = function () {
            var data = {};
            data = $cookieStore.get('loggedin');
            $uibModal.open({
                    templateUrl: "app/pages/users/allUsers/detail/detail.html",
                    controller: "UserDetailCtrl",
                    controllerAs: "vm",
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        item: function () {
                            return data;
                        }
                    }
                }
            );
        }
    }
})();