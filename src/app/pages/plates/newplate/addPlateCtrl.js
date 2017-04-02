/**
 * Created by Ozgen on 10/18/16.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('addPlateCtrl', addPlateCtrl);

    /** @ngInject */
    function addPlateCtrl($scope, $uibModal, toastr, PlateService, leafletData, $cookieStore, item, $uibModalInstance,
                          $timeout, SweetAlert, AuthService, MapService, DefService) {
        var vm = this;
        var mapAdd = {};
        vm.model = {};
        vm.options = {};
        if (item.locationx) {
            vm.model.buttonState = 'update';
            item.buttonState = 'update';
            $scope.showUpdateBtn = true;
        } else {
            vm.model.buttonState = 'save';
            item.buttonState = 'save';
            $scope.showUpdateBtn = false;
        }
        $scope.filteredPlateTypes = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 6
            , $scope.maxSize = 5;
        $scope.showSpinner = false;
        $scope.changePlateType = false;
        $scope.changePlateTempFlag = false;

        vm.platemodel = {};
        vm.platefields = PlateService.getPlateFields(false);

        $scope.isshow = false;
        $scope.showMap1 = false;

        AuthService.getCoords().then(function (data) {
            $scope.coords = data;
        })


        vm.setPlateType = function () {
            $scope.showSpinner = true;
            PlateService.getPlateTypes(vm.platemodel).then(function (plateTypes) {
                $scope.plateTypes = plateTypes;
                $scope.isshow = true;
                $scope.showSpinner = false;
                vm.callServer($scope.tablestate);
            });
        }

        vm.selectPlateType = function (data) {
            $scope.title = PlateService.getPlateTypeLabel(vm.platemodel.plate_type);
            data._id = item._id;
            data.request_date = item.request_date;
            if (item.locationx) {
                vm.model.buttonState = 'update';
            } else {
                vm.model.buttonState = 'save';
            }
            data.buttonState = item.buttonState;
            data.expiration_date = item.expiration_date;
            data.emergency = item.emergency;
            data.locationx = item.locationx;
            data.locationy = item.locationy;
            data.last_montage_date = item.last_montage_date;
            vm.model = angular.copy(data);
            vm.fields = PlateService.getAddPlateFields(false);
            //:TODO refactor code after adding scale data in plateJson.json
            $scope.scales = ["60 cm", "70 cm"];//item.scale;
            $scope.changePlateType = false;
            var locx = 0;
            var locy = 0;
            locx = parseFloat(item.locationx);
            locy = parseFloat(item.locationy);
            MapService.getTheMapWithCentered().then(function (map2) {
                mapAdd = map2;
                var marker;

                if (item.buttonState === 'update') {
                    marker = L.marker([locx, locy], {
                        icon: L.AwesomeMarkers.icon({
                            icon: 'cog',
                            prefix: 'glyphicon',
                            markerColor: 'red'
                        })
                    }).addTo(mapAdd);
                }

                mapAdd.on("click", function (e) {
                    if (marker)
                        mapAdd.removeLayer(marker);
                    marker = L.marker([e.latlng.lat, e.latlng.lng], {
                        icon: L.AwesomeMarkers.icon({
                            icon: 'cog',
                            prefix: 'glyphicon',
                            markerColor: 'red'
                        })
                    }).addTo(mapAdd);
                    vm.model.locationx = e.latlng.lat;
                    vm.model.locationy = e.latlng.lng;
                });
            });

        }
        vm.changePlateTemp = function () {
            $scope.changePlateType = true;
            $scope.changePlateTempFlag = true;
            $scope.model2 = vm.model;
            vm.callServer($scope.tablestate);

        }

        vm.cancelPlateTemp = function () {
            $scope.showSpinner = true;
            $scope.changePlateTempFlag = false;
            $scope.changePlateType = false;
            $scope.showSpinner = false;
            if (item) {

                $scope.title = PlateService.getPlateTypeLabel(item.plate_type);
                vm.model = angular.copy(item);
                vm.fields = PlateService.getAddPlateFields(false);

                //:TODO refactor code after adding scale data in plateJson.json
                $scope.scales = ["60 cm", "70 cm"];//item.scale;

            } else {
                $scope.title = PlateService.getPlateTypeLabel($scope.model2.plate_type);
                vm.model = angular.copy($scope.model2);
                vm.fields = PlateService.getAddPlateFields(false);
            }

        }


        $scope.title = PlateService.getPlateTypeLabel(item.plate_type);
        var last_montage_date = new Date();
        last_montage_date.setMonth(last_montage_date.getMonth() + 1);

        if (!item.last_montage_date) {
            item.last_montage_date = PlateService.convertDate(last_montage_date);
        }
        if (!item.request_date)
            item.request_date = PlateService.convertDate(new Date());
        vm.model = angular.copy(item);

        vm.fields = PlateService.getAddPlateFields(false);

        //:TODO refactor code after adding scale data in plateJson.json
        $scope.scales = ["60 cm", "70 cm"];//item.scale;
        
        var locx = 0;
        var locy = 0;
        locx = parseFloat(item.locationx);
        locy = parseFloat(item.locationy);

        var marker;
        MapService.getTheMapWithCentered().then(function (map2) {

            mapAdd = map2;

            if (item.buttonState === 'update') {
                //  mapAdd.panTo(new L.LatLng(locx, locy)).setZoom(18);
                marker = L.marker([locx, locy], {
                    icon: L.AwesomeMarkers.icon({
                        icon: 'cog',
                        prefix: 'glyphicon',
                        markerColor: 'red'
                    })
                }).addTo(mapAdd);
                mapAdd.setView([locx, locy], 15)
            }
            else {
                locx = parseFloat($scope.coords.locationx);
                locy = parseFloat($scope.coords.locationy);
                mapAdd.setView(new L.LatLng(locx, locy)).setZoom(14);
            }

            mapAdd.on("click", function (e) {
                if (marker)
                    mapAdd.removeLayer(marker);
                marker = L.marker([e.latlng.lat, e.latlng.lng], {
                    icon: L.AwesomeMarkers.icon({
                        icon: 'cog',
                        prefix: 'glyphicon',
                        markerColor: 'red'
                    })
                }).addTo(mapAdd);
                vm.model.locationx = e.latlng.lat;
                vm.model.locationy = e.latlng.lng;

            });

        });

        vm.callServer = function callServer(tableState) {

            vm.isLoading = true;
            $scope.tablestate = angular.copy(tableState);
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            if ($scope.plateTypes) {
                DefService.getThePage(start, number, tableState, $scope.plateTypes).then(function (result) {
                    vm.displayed = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    vm.isLoading = false;
                });
            }
        };

        setTimeout(function () {

            $scope.showMap1 = true;
        }, 200);


        vm.cancel = function () {

            $uibModalInstance.dismiss('cancel');
            $scope.showMap = true;
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
                        vm.model.status = 0;
                        vm.model._id = undefined;
                        PlateService.savePlateReq(vm.model).then(function (data) {
                            toastr.success("İstek başarıyla yaratıldı");
                            $uibModalInstance.close();
                            $scope.showMap = true;


                        }, function (err) {
                            $scope.isLoading = false;
                            toastr.error("Kayıt sırasında hata!");

                        })
                    }
                });

        }

        vm.update = function () {

            SweetAlert.swal({
                    title: "İsteği Güncelle",
                    text: "İsteği güncellemek istediğinize emin misiniz?",
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
                        PlateService.updatePlateReq(vm.model).then(function (data) {
                            toastr.success("İstek başarıyla güncellendi");
                            location.reload();
                        }, function (err) {
                            $scope.isLoading = false;
                            toastr.error("Güncelleme sırasında hata!");
                            $scope.showMap = true;
                            $uibModalInstance.close();

                        })
                    }
                });

        }


    }

})();

