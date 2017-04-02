/**
 * Created by Ozgen on 6/19/16.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UserDetailCtrl', UserDetailCtrl);

    /** @ngInject */
    function UserDetailCtrl($scope, $uibModal, toastr, UserService, $cookieStore, item, $uibModalInstance,
                            $timeout, SweetAlert, FileUploader, DefService, AuthService) {
        var vm = this;

        $scope.showSpinner = true;
        $scope.pictureName = item.pictureName;
        vm.title = item.name + " " + item.surname;

        DefService.getRegions().then(function (data) {
            var array = [];

            if (data) {
                for (var i in data) {
                    var it = {};
                    it.name = data[i].name;
                    it.value = data[i].name_;
                    array.push(it);
                }
            }
            // todo region ve branch comboloarını gözden geçir.

            vm.regionFields = UserService.getRegionComboFields(true, array);
            vm.roles = item.roles[0];

        }, function (err) {
            var array = [];
            for (var i in item.roles) {
                var it = {};
                it.name = item.roles[i].region;
                it.value = item.roles[i].region;
                array.push(it);
            }
            vm.regionFields = UserService.getRegionComboFields(true, array);
            vm.roles = item.roles[0];
        });

        $scope.$watch('vm.roles.region', function (newVal, oldVal) {
            DefService.getTheRegionWithName(vm.roles).then(function (data) {
                var array = [];
                for (var i in data.branch) {
                    var item = {};
                    item.name = data.branch[i].name;
                    item.value = data.branch[i].name_;
                    array.push(item);
                }
                vm.branchFields = UserService.getBranchComboFields(false, array, !AuthService.checkRole('admin'));
            });
        });
        var uploader = $scope.uploader = new FileUploader({
            url: '/client/upload'
        });
        $scope.setFile = function (element) {
            $scope.currentFile = element.files[0];
            $scope.pictureName = $scope.currentFile.name;

            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source = event.target.result;
                $scope.$apply()

            };
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);

        };
        //:TODO cunfigrue user html and ctrl
        vm.model = {};
        item.password = "";
        vm.model = angular.copy(item);
        vm.fields = UserService.getUserFields(false);
        $scope.showSpinner = false;
        vm.ok = function (formData) {
            SweetAlert.swal({
                    title: "Güncelle",
                    text: "Güncellemek istediğinize emin misiniz?",
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

                        if (uploader.queue[0]) {
                            uploader.queue[0].formData.push({
                                folder: "profilePictures"
                            });
                            vm.model.pictureName = uploader.queue[0].file.name;
                        } else if (!vm.model.pictureName) {
                            vm.model.pictureName = "profile.jpeg";
                        }
                        if (vm.model.tcNo && vm.model.email) {
                            $scope.update = true;
                            vm.model.roles = [];
                            vm.model.roles.push(vm.roles);
                            if (vm.model.password || vm.model.password2) {
                                if (vm.model.password !== vm.model.password2) {
                                    toastr.error("Kullanıcı bilgilerini kontrol ediniz!");

                                    $scope.update = false;
                                }
                            }
                            if ($scope.update) {
                                UserService.updateUser(vm.model)
                                    .then(function () {
                                        uploader.uploadAll();

                                        uploader.onCompleteAll();
                                        {
                                            toastr.success("Kullanıcı başarıyla güncellendi!");


                                        }

                                    }, function (err) {
                                        toastr.error("Kullanıcı bilgilerini kontrol ediniz!");

                                    })

                            }
                        } else {
                            toastr.error("Kullanıcı bilgilerini kontrol ediniz!");

                        }
                    }
                });

        }

        vm.cancel = function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();