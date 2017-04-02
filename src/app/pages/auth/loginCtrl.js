(function () {
    'use strict';

    angular.module('LoginCtrl', [])
        .controller('loginCtrl', loginCtrl);

    function loginCtrl($rootScope, $scope, $timeout, $state, toastr, AuthService, $uibModal) {
        $scope.title = 'YKS A.Ş.';
        var _toast;


        $scope.loginSpin = false;


        $scope.login = function () {

            // initial values
            $scope.disabled = true;


            AuthService.login($scope.loginForm.email, $scope.loginForm.password)
                // handle success
                .then(function () {
                    toastr.clear(_toast);
                    _toast = toastr.success("Giriş Başarılı");

                    $state.go('dashboard');
                }, function (err) {
                    if (err === 'alreadyLoggedin') {
                        toastr.clear(_toast);
                        _toast = toastr.error("Kullanıcı zaten giriş yapmıştır!");
                    } else if (err === 'deleted') {
                        toastr.clear(_toast);
                        _toast = toastr.error("Kullanıcı hesabı silinmiştir!");

                    } else if (err === 'freezed') {
                        toastr.clear(_toast);
                        _toast = toastr.error("Hesap dondurulmuştur!");
                    } else {
                        toastr.clear(_toast);
                        _toast = toastr.error("E-mail veya şifre hatalı");

                    }
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });


        };


    };
})
();
