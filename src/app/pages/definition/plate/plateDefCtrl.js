/**
 * Created by Ozgen on 12/9/16.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('plateDefCtrl', plateDefCtrl);

    /** @ngInject */
    function plateDefCtrl($scope, $uibModal, toastr, DefService, $cookieStore, SweetAlert, FileUploader) {

        var vm = this;
        vm.model = {};
        vm.picModel = {};
        vm.picFields = DefService.getPicFields(false);
        vm.fields = DefService.getPlateDefinitionFields(false);
        $scope.isTableOpen = true;
        $scope.isDefOpen = false;
        DefService.getPlateTypeFields(false).then(function (fields) {

            vm.typeFields = fields;
            vm.typeModel = {};
        })

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

        vm.test = function (picModel) {
            $uibModal.open({
                    templateUrl: "app/pages/definition/plate/test.html",
                    controller: function ($scope) {
                        $scope.plate_pic = picModel.picture_name;
                    }
                }
            );
        }

        vm.save = function () {
            var dat = vm.model;
            var scale = [];
            if (vm.model.scale) {
                for (var i = 0; i < vm.model.scale.length; i++) {
                    scale[i] = vm.model.scale[i].scale;
                }
            }
            //dat.picture_name = vm.picModel.picture_name;
            dat.scale = scale;
            dat.plate_type = vm.typeModel.plate_type;
            if (uploader.queue[0]) {
                uploader.queue[0].formData.push({
                    folder: "traffic"
                });
                dat.picture_name = uploader.queue[0].file.name;
            } else {
                dat.picture_name = vm.picModel.picture_name;
            }
            DefService.getThePlateTypeLabel(vm.typeModel).then(function (data) {

                dat.plate_type_label = data;

                DefService.savePlateDef(dat).then(function (data) {
                    uploader.uploadAll();

                    uploader.onCompleteAll();
                    toastr.success("Levha başarıyla tanımlandı.");
                    location.reload();
                }, function (err) {
                    toastr.error("Tanımlama sırasında hata!");
                })
            })


        }


        vm.callServer = function callServer(tableState) {

            vm.isLoading = true;
            $scope.tablestate = angular.copy(tableState);
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            DefService.getPage(start, number, tableState, DefService.getAllPlateDefifinitions()).then(function (result) {
                vm.displayed = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                vm.isLoading = false;
            });
        };

        $scope.editData = function (data) {

            vm.picModel.picture_name = data.picture_name;
            vm.model = data;
            var scales = [];
            if (data.scale) {
                for (var i in data.scale) {
                    var s = {};
                    s.scale = data.scale[i];
                    scales.push(s);
                }
            }
            vm.model.scale = scales;
            vm.typeModel.plate_type = data.plate_type;
            $scope.controlTabs();
            vm.callServer($scope.tablestate);

        }

        vm.cancel = function () {
            vm.options.resetModel();
            vm.typeModel = {};
            vm.picModel = {};
            vm.model = {};
            $scope.controlTabs();
        }

        $scope.controlTabs = function () {
            if ($scope.isTableOpen) {
                $scope.isTableOpen = false;
                $scope.isDefOpen = true;
            }
            else {
                $scope.isTableOpen = true;
                $scope.isDefOpen = false;
            }
        }
        vm.openTypeFields = function () {
            $uibModal.open({
                    templateUrl: "app/pages/definition/plate/newType.html",
                    controller: "addPlateTypeCtrl",
                    controllerAs: "vm",
                    backdrop: 'static',
                    size: 'lg'

                }
            );
        }

        vm.delete = function (data) {
            SweetAlert.swal({
                    title: "Tanım Silme",
                    text: "Levha Tanımını silmek istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        data.is_deleted = 1;
                        DefService.savePlateDef(data).then(function (data) {
                            toastr.success("Levha başarıyla silindi.");
                            vm.options.resetModel();
                            location.reload();

                        }, function (err) {
                            toastr.error("Silme işlemi sırasında hata!");
                        })
                    }
                });


        }


    }

})();