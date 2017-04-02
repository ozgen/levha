/**
 * Created by Eray on 11.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('newUserCtrl', newUserCtrl);

    /** @ngInject */
    function newUserCtrl($scope, $uibModal, toastr, UserService, $cookieStore, FileUploader,
                         $timeout, SweetAlert, $filter, DefService, AuthService) {

        var vm = this;
        vm.title = "Yeni Kullanıcı Yarat";

        $scope.example5model = [];
        $scope.example5data = UserService.getRoles();
        $scope.example5settings = {
            selectionCount: 'Seçilmiş'
        };
        $scope.example5customTexts = {buttonDefaultText: 'Rol Seçiniz'};

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

        $scope.removePicture = function () {
            $scope.picture = $filter('appImage')('theme/no-photo.png');
            $scope.noPicture = true;
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();

        };
        $scope.getFile = function (element) {


            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.picture = event.target.result;
                $scope.$apply()

            };
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        };
        //:TODO cunfigrue user html and ctrl
        vm.model = {};
        vm.fields = UserService.getUserFields(false);
        var hasBranch = false;
        DefService.getRegions().then(function (data) {
            var array = [];
            for (var i in data) {
                var item = {};
                item.name = data[i].name;
                item.value = data[i].name;
                array.push(item);
            }
            vm.regionFields = UserService.getRegionComboFields(false, array);
            vm.roles = {};

        }, function (err) {

            var roles = AuthService.getRole();
            var array = [];
            for (var i in roles) {
                var it = {};
                it.name = roles[i].region;
                it.value = roles[i].region;
                array.push(it);
                if (roles[i].branch)
                    hasBranch = true;
            }
            vm.regionFields = UserService.getRegionComboFields(true, array);
            vm.roles = roles[0];
        });

        $scope.$watch('vm.roles.region', function (newVal, oldVal) {
            DefService.getTheRegionWithName(vm.roles).then(function (data) {
                var array = [];
                for (var i in data.branch) {
                    var item = {};
                    item.name = data.branch[i].name;
                    item.value = data.branch[i].name;
                    array.push(item);
                }
                vm.branchFields = UserService.getBranchComboFields(false, array, hasBranch);

            });
        });


        vm.ok = function (formData) {
            SweetAlert.swal({
                    title: "İsteği Kaydet",
                    text: "İsteği kaydetmek istediğinize emin misiniz?",
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
                        } else {
                            vm.model.pictureName = "profile.jpeg";
                        }
                        if (vm.model.tcNo && vm.model.email && vm.model.password &&
                            (vm.model.password === vm.model.password2) && vm.roles) {

                            vm.model.roles = [];
                            convertRoles()
                            vm.model.roles.push(vm.roles);
                            UserService.insertNewUser(vm.model)
                                .then(function () {
                                    uploader.uploadAll();

                                    uploader.onCompleteAll();

                                    toastr.success("Yeni kullanıcı başarıyla oluşturuldu!");
                                    location.reload();


                                }, function (err) {
                                    toastr.error("Kullanıcı bilgilerini kontrol ediniz!");

                                })
                        } else {
                            toastr.error("Kullanıcı bilgilerini kontrol ediniz!");
                        }
                    }
                });

        }

        vm.cancel = function cancel() {
            location.reload();
        };

        function convertRoles() {
            if (vm.roles.branch)
                vm.roles.branch = DefService.convertString(vm.roles.branch);
            if (vm.roles.region)
                vm.roles.region = DefService.convertString(vm.roles.region);
        }


    }
})();
