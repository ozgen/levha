/**
 * Created by Ozgen on 12/9/16.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('addPlateTypeCtrl', addPlateTypeCtrl);

    /** @ngInject */
    function addPlateTypeCtrl($scope, $uibModal, toastr, DefService, $cookieStore, $uibModalInstance, SweetAlert) {

        var vm = this;
        vm.plateTypeModels = {};
        vm.plateTypeModelFields = DefService.getPlateTypeDefFields(false);

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        vm.ok = function () {
            if (vm.plateTypeModels.name && vm.plateTypeModels.value) {
                DefService.savePlateType(vm.plateTypeModels).then(function (data) {
                    toastr.success("Levha Tipi başarıyla kaydedildi.");
                    location.reload(); //refresh main page


                }, function (err) {
                    toastr.error("Kayıt sırasında hata.");
                })
            } else {
                toastr.error('Lütfen zorunlu alanları doldurunuz...')
            }
        }


    }

})();