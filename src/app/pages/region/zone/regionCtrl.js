/**
 * Created by Ozgen on 12/18/16.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.region')
        .controller('regionCtrl', regionCtrl);

    /** @ngInject */
    function regionCtrl($scope, $uibModal, toastr, DefService, $cookieStore, SweetAlert,
                        FileUploader, leafletData, $timeout, AuthService, MapService) {
        var vm = this;
        vm.regionModel = {};
        $scope.markers = [];
        var mapRegion = {};
        $scope.openDefRegion = false;
        var locx = 0;
        var locy = 0;
        var marker;
        var refreshBtn;
        AuthService.getCoords().then(function (data) {
            $scope.coords = data;
            $scope.updateMap(data);
        })


        $scope.status = false;
        $scope.showRegionMap = false;
        vm.regionFields = DefService.getRegionFields(false);
        $scope.showRegionMap = false;



        $scope.updateMap = function (data) {

            MapService.getTheMap().then(function (map) {
                $scope.showRegionMap = true;
                mapRegion = map;
                var marker;
                map.on("click", function (e) {
                    if (marker)
                        map.removeLayer(marker);
                    marker = L.marker([e.latlng.lat, e.latlng.lng], {
                        icon: L.AwesomeMarkers.icon({
                            icon: 'cog',
                            prefix: 'glyphicon',
                            markerColor: 'red'
                        })
                    }).addTo(map);
                    vm.regionModel.locationx = e.latlng.lat;
                    vm.regionModel.locationy = e.latlng.lng;

                });
                if (data === undefined)
                    data = $scope.coords;
                locx = parseFloat(data.locationx);
                locy = parseFloat(data.locationy);
                map.setView(new L.LatLng(locx, locy), 8);
                if (refreshBtn === undefined) {
                    MapService.addRefreshBtn(map);
                }

            })

        }


        // mapRegion.panTo(new L.LatLng(locx, locy)).setZoom(12);

        $scope.showRegionMap = true;


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


        vm.ok = function () {

            if (vm.regionModel.name && vm.regionModel.code
                && vm.regionModel.locationx
                && vm.regionModel.locationy) {
                SweetAlert.swal({
                        title: "Bölge Kaydet",
                        text: "Bölgeyi kaydetmek istediğinize emin misiniz?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#31B404",
                        confirmButtonText: "Evet",
                        cancelButtonText: "Hayır",
                        closeOnConfirm: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {

                            if (uploader.queue[0]) {
                                uploader.queue[0].formData.push({
                                    folder: "logo"
                                });
                                vm.regionModel.logo = uploader.queue[0].file.name;
                            } else {
                                vm.regionModel.logo = "logo2.png";
                            }
                            DefService.saveRegion(vm.regionModel).then(function (data) {
                                toastr.success(data.name + " Bölgesi başarıyla yaratıldı");
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


        vm.callServer = function callServer(tableState) {

            vm.isLoading = true;
            $scope.tablestate = angular.copy(tableState);
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            DefService.getPage(start, number, tableState, DefService.getRegions()).then(function (result) {
                vm.displayed = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                vm.isLoading = false;
            });
        };

        vm.delete = function (data) {
            SweetAlert.swal({
                    title: "Bölge Silme",
                    text: "Bölge Tanımını silmek istediğinize emin misiniz?",
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
                        DefService.saveRegion(data).then(function (data) {
                            toastr.success("Bölge başarıyla silindi.");
                            vm.options.resetModel();
                            location.reload();
                        }, function (err) {
                            toastr.error("Silme işlemi sırasında hata!");
                        })
                    }
                });
        }


        vm.editData = function (data) {

            vm.regionModel = data;
            $scope.openDefRegion = true;
            $scope.showRegionMap = true;
            $scope.updateMap(data);
            // mapRegion.panTo(new L.LatLng(data.locationx, data.locationy), 12);


        }

        vm.cancel = function () {
            $scope.openDefRegion = true;
            $scope.openDefRegion = false;
            vm.options.resetModel();
            vm.regionModel = {};
            vm.callServer($scope.tablestate);
            $scope.updateMap();
        }

    }

})();
