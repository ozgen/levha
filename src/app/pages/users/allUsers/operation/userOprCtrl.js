/**
 * Created by Ozgen on 10/18/16.
 */

/**
 * Created by Eray on 11.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UserOprCtrl', UserOprCtrl);

    /** @ngInject */
    function UserOprCtrl($scope, $uibModal, toastr, UserService, $cookieStore, item, $uibModalInstance,
                         $timeout, SweetAlert) {
        var vm = this;
        $scope.user = item;
        vm.user = item;
        vm.model = {};
        vm.fields = UserService.getPasswordFields(false);
        $scope.showPassTemplate = false;

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        vm.addTemplate = function () {
            $scope.showPassTemplate = true;
        }

        vm.unfreeze = function () {

            vm.user.isFreeze = false;
            SweetAlert.swal({
                    title: "Hesabı Aktifleştir",
                    text: "Hesabı aktifleştirmek istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        // call logout from service
                        UserService.updateUser(vm.user).then(function (data) {
                            toastr.success(data.name + " " + data.surname + " Hesap Aktifleştirildi. ");
                            $uibModalInstance.close();

                        }, function (err) {
                            $scope.isLoading = false;
                            toastr.error("İşlem sırasında hata!");

                        })
                    }
                });

        }
        vm.freeze = function () {

            vm.user.isFreeze = true;
            SweetAlert.swal({
                    title: "Hesabı Dondur",
                    text: "Hesabı dondurmak istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        // call logout from service
                        UserService.updateUser(vm.user).then(function (data) {
                            toastr.success(data.name + " " + data.surname + " Hesap donduruldu. ");
                            $uibModalInstance.close();

                        }, function (err) {
                            $scope.isLoading = false;
                            toastr.error("İşlem sırasında hata!");

                        })
                    }
                });

        }

        vm.deleteUser = function () {
            vm.user.isDeleted = 1;

            SweetAlert.swal({
                    title: "Hesabı Sil",
                    text: "Hesabı silmek istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        // call logout from service
                        UserService.updateUser(vm.user).then(function (data) {
                            toastr.success(data.name + " " + data.surname + " Hesap silindi. ");
                            $uibModalInstance.close();

                        }, function (err) {
                            $scope.isLoading = false;
                            toastr.error("İşlem sırasında hata!");

                        })
                    }
                });

        }

        vm.refreshPass = function () {
            if (vm.model.password === vm.model.password2) {
                vm.user.password = vm.model.password;
                console.log(vm.user)
                SweetAlert.swal({
                        title: "Şifre Yenile",
                        text: "Şifreyi yenilemek istediğinize emin misiniz?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#31B404",
                        confirmButtonText: "Evet",
                        cancelButtonText: "Hayır",
                        closeOnConfirm: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            // call logout from service

                            UserService.updateUser(vm.user).then(function (data) {
                                toastr.success(data.name + " " + data.surname + " Şifre başarı ile yenilendi. ");
                                $uibModalInstance.close();
                                
                            }, function (err) {
                                $scope.isLoading = false;
                                toastr.error("İşlem sırasında hata!");

                            })
                        }
                    });


            } else {
                toastr.error("Şifreleri aynı doldulmanız gerekmektedir!");
                
            }

        }


    }
})();
