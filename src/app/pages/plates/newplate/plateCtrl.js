/**
 * Created by Eray on 11.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('plateCtrl', plateCtrl);

    /** @ngInject */
    function plateCtrl($scope, $state, $uibModal, toastr, PlateService, $cookieStore, $filter, $timeout, leafletData,
                       FileUploader, SweetAlert, AuthService, DefService) {


        var vm = this;
        $scope.filteredPlateTypes = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 6
            , $scope.maxSize = 5;
        $scope.showSpinner = false;
        vm.model = {};
        DefService.getPlateTypeFields(false).then(function (fields) {

            vm.fields = fields;
        })

        vm.fields = PlateService.getPlateFields(false);
        vm.otherFields = PlateService.getOtherPlateFields(false);
        vm.otherModel = {};
        $scope.showOther = false;

        $scope.isshow = false;

        //location
        var locx = 0;
        var locy = 0;

        AuthService.getCoords().then(function (data) {
            $scope.coords = data;
        })

        vm.setPlateTypeCombo = function () {

            if (vm.model.plate_type !== "Diğer") {
                $scope.showSpinner = true;
                PlateService.getPlateTypes(vm.model).then(function (plateTypes) {
                    $scope.plateTypes = plateTypes;
                    $scope.isshow = true;
                    $scope.showSpinner = false;
                    vm.callServer($scope.tablestate);

                });


            } else {

                $scope.showOther = true;
                $scope.isshow = false;
                $scope.showSpinner = false;
                var last_montage_date = new Date();
                last_montage_date.setMonth(last_montage_date.getMonth() + 1);

                vm.model.last_montage_date = PlateService.convertDate(last_montage_date);

                vm.otherModel = angular.copy(vm.model);

            }

        }

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

        vm.selectPlateType = function (data) {
            data.plate_type = vm.model.plate_type;

            $uibModal.open({
                    templateUrl: "app/pages/plates/newplate/addPlate.html",
                    controller: "addPlateCtrl",
                    controllerAs: "vm",
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        item: function () {
                            return data;
                        }
                    }
                }
            );


        }

        angular.extend($scope, {
            location: {},
            markers: {},
            defaults: {
                maxZoom: 18,
                minZoom: 0
            },
            layers: {
                baselayers: {
                    googleHybrid: {
                        name: 'Karma',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleTerrain: {
                        name: 'Arazi',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Yol',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            controls: {
                fullscreen: {
                    position: 'topright'
                },
                scale: true
            },
            events: { // or just {} //all events
                markers: {
                    enable: ['dragend']
                    //logic: 'emit'
                }
            }
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

        $timeout(function () {

            leafletData.getMap().then(function (lfMap) {

                var marker;
                lfMap.scrollWheelZoom.disable();

                locx = parseFloat($scope.coords.locationx);
                locy = parseFloat($scope.coords.locationy);
                lfMap.panTo(new L.LatLng(locx, locy)).setZoom(12);

                lfMap.on("click", function (e) {
                    if (marker)
                        lfMap.removeLayer(marker);
                    marker = L.marker([e.latlng.lat, e.latlng.lng], {
                        icon: L.AwesomeMarkers.icon({
                            icon: 'cog',
                            prefix: 'glyphicon',
                            markerColor: 'red'
                        })
                    }).addTo(lfMap);
                    vm.otherModel.locationx = e.latlng.lat;
                    vm.otherModel.locationy = e.latlng.lng;

                    vm.markers = marker;
                });
            });
        }, 300);

        vm.cancel = function cancel() {
            $scope.otherModel = {};
            $scope.showOther = false;
        };

        vm.ok = function (formData) {
            if (vm.otherModel.no && vm.otherModel.request_date
                && vm.otherModel.emergency && vm.otherModel.locationx
                && vm.otherModel.locationy && vm.otherModel.last_montage_date) {
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
                                    folder: "traffic"
                                });
                                vm.otherModel.picture_name = uploader.queue[0].file.name;
                            } else {
                                vm.otherModel.picture_name = "empty.jpg";
                            }
                            PlateService.savePlateReq(vm.otherModel).then(function (data) {

                                toastr.success(data.no + "İstek başarıyla yaratıldı");
                                location.reload();
                            }, function (err) {
                                $scope.isLoading = false;
                                toastr.error("Kayıt sırasında hata!")

                            })
                        }
                    });
            } else {
                toastr.error("Lütfen zorunlu alanları doldurunuz!")

            }

        }


    }

})();
