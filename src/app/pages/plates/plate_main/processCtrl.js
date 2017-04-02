/**
 * Created by Ozgen on 10/18/16.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('processCtrl', processCtrl);

    /** @ngInject */
    function processCtrl($scope, $uibModal, toastr, PlateService, $cookieStore, item, $uibModalInstance, SweetAlert, UserService) {

        var vm = this;
        vm.plateNo = item.no;
        $scope.showTable = false;
        $scope.showAssign = false;

        PlateService.getOnePlateOperations(item._id).then(function (data) {

            if (data.length > 0) {

                for (var i in data) {
                    data[i].processLabel = PlateService.getPlateOperationLabel(data[i].process);

                }
                $scope.operations = data;
                $scope.showBtn = true;
            }

        });

        vm.model = {};

        vm.fields = PlateService.getPlateProcessFields(false);

        UserService.getUsersComboValue().then(function (users) {

            vm.userComboFields = UserService.getUsersComboFields(false, users);
            vm.modelAssign = {};
        });

        vm.ok = function () {
            vm.model.plate_id = item._id;
            SweetAlert.swal({
                    title: "İşlemi Onayla",
                    text: "İşlemi onaylamak istediğinize emin misiniz?",
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
                        if (vm.model.operation_date && vm.model.explanation && vm.model.process) {
                            PlateService.savePlateOperations(vm.model).then(function (data) {
                                toastr.success("İşlem başarıyla onaylandı.");
                                location.reload(); //refresh main page


                            }, function (err) {
                                toastr.error("Onaylanma sırasında hata.");
                            })
                        } else {
                            toastr.error("Lütfen zorunlu alanları doldurunuz");


                        }
                    }
                });

        }

        vm.delete = function () {


            SweetAlert.swal({
                    title: "Silme İşlemini Onayla",
                    text: "İşlemi onaylamak istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#FF0000",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        PlateService.deletePlateReq(item._id).then(function (data) {
                            toastr.success("İşlem başarıyla onaylandı.");
                            location.reload(); //refresh main page

                        }, function (err) {
                            toastr.error("Onaylanma sırasında hata.");

                        })

                    }
                });

        }

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        vm.showHistory = function () {
            $scope.showTable = true;


        }
        vm.closeHistory = function () {
            $scope.showTable = false;


        }

        vm.assign = function () {
            $scope.showAssign = true;

        }

        vm.assignToSO = function () {

            SweetAlert.swal({
                    title: "İşlemi Onayla",
                    text: "İşlemi onaylamak istediğinize emin misiniz?",
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
                        if (vm.modelAssign.user) {
                            item.assignee = vm.modelAssign.user;
                            PlateService.updatePlateReq(item).then(function (data) {
                                toastr.success("İşlem başarıyla onaylandı.");
                                location.reload(); //refresh main page


                            }, function (err) {
                                toastr.error("Onaylanma sırasında hata.");
                            })
                        } else {
                            toastr.error("Lütfen zorunlu alanları doldurunuz");


                        }
                    }
                });
        }


    }

})();

