/**
 * Created by Ozgen on 4/9/17.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('newAddPlateCtrl', newAddPlateCtrl);

    /** @ngInject */
    function newAddPlateCtrl($scope, $uibModal, toastr, PlateService, leafletData, $cookieStore, item, $uibModalInstance,
                             $timeout, SweetAlert, AuthService, MapService, DefService) {
        var vm = this;
        vm.model = {};
        vm.options = {};
        vm.platemodel = {};
        vm.platefields = PlateService.getPlateFields(false);

        $scope.title = PlateService.getPlateTypeLabel(item.plate_type);
        var last_montage_date = new Date();
        last_montage_date.setMonth(last_montage_date.getMonth() + 1);
        if (!item.last_montage_date) {
            item.last_montage_date = PlateService.convertDate(last_montage_date);
        }
        if (!item.request_date)
            item.request_date = PlateService.convertDate(new Date());
        vm.model = angular.copy(item);

        vm.fields = PlateService.getNewAddPlateFields(false);
        var locationArr = item.locArray;
        //:TODO refactor code after adding scale data in plateJson.json
        $scope.scales = ["60 cm", "70 cm"];//item.scale;

        vm.cancel = function () {

            $uibModalInstance.dismiss('cancel');
            location.reload();
        }

        vm.ok = function () {

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
                        for (var i = 0; i < locationArr.length; i++) {
                            var loc = locationArr[i];

                            vm.model.status = 0;
                            vm.model._id = undefined;
                            vm.model.locationx = parseFloat(loc.locationx);
                            vm.model.locationy = parseFloat(loc.locationy);
                            PlateService.savePlateReq(vm.model).then(function (data) {


                            }, function (err) {
                                $scope.isLoading = false;
                                toastr.error("Kayıt sırasında hata!");
                                return;
                            })
                        }
                        toastr.success("İstek başarıyla yaratıldı");
                        $uibModalInstance.close();
                    }
                });

        }

    }

})();

