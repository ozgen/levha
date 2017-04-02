/**
 * Created by Ozgen on 1/28/17.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate').controller('bulkReqCtrl', bulkReqCtrl);

    /** @ngInject */
    function bulkReqCtrl($scope, $uibModal, toastr, PlateService, $cookieStore, SweetAlert, DefService) {

        var vm = this;

        vm.callServer = function callServer(tableState) {

            vm.isLoading = true;
            $scope.tablestate = angular.copy(tableState);
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = 5;  // Number of entries showed per page.

            DefService.getPage(start, number, tableState, DefService.getAllPlateDefifinitions()).then(function (result) {
                vm.displayed = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                vm.isLoading = false;
            });
        };

        // Declare the array for the selected items
        vm.selected = [];


        // Function to get data by selecting a single row
        vm.select = function (id) {

            var found = vm.selected.indexOf(id);

            if (found == -1) vm.selected.push(id);

            else vm.selected.splice(found, 1);

        }
        var isSelected = false;
        vm.defaultData = {};
        vm.getSelected = function () {

            if (!isSelected) {
                vm.defaultData = vm.displayed
                vm.displayed = vm.selected;
                isSelected = true;
            } else {
                isSelected = false;
                if (vm.defaultData)
                    vm.displayed = vm.defaultData;
            }

        }

        vm.ok = function () {

            SweetAlert.swal({
                    title: "Toplu İsteği Kaydet",
                    text: "Toplu İsteği kaydetmek istediğinize emin misiniz? (Konum bilgisi yetkili olduğunuz bölgenin veya şubenin " +
                    "koordinatları olarak kabul edilerek kayıt yapılacak!!!)",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var quantitiy = true;
                        for (var i in vm.selected) {
                            if (!vm.selected[i].nums)
                                quantitiy = false;
                            else if (vm.selected[i].nums < 0)
                                quantitiy = false;
                            else if (vm.selected[i].nums == 0)
                                quantitiy = false;
                        }
                        if (vm.selected.length === 0) {
                            quantitiy = false;
                            toastr.error("En az bir levha seçiniz...")
                            return;
                        }

                        if (quantitiy) {


                        } else {
                            toastr.error("Miktar bilgilerini kontrol ediniz!");
                        }
                    }
                });

        }

        vm.cancel = function () {

        }

    }

})();

