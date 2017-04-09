/**
 * Created by Ozgen on 12/18/16.
 */



(function () {
    'use strict';

    angular.module('BlurAdmin.pages.region')
        .controller('branchCtrl', branchCtrl);

    /** @ngInject */
    function branchCtrl($scope, $uibModal, toastr, DefService, $cookieStore,
                        SweetAlert, FileUploader, leafletData, $timeout, AuthService, MapService) {

        var vm = this;

        $scope.showBranchList = false;
        var mapBranch = {};
        vm.branchModel = {};
        $scope.markers = [];
        var roleSuperAdmin = AuthService.checkRole('super_admin');
        var roleAdmin = AuthService.checkRole('admin');
        $scope.regList = [];
        $scope.openDefBranch = true;
        var refreshBtn;

        var locx = 0;
        var locy = 0;

        AuthService.getCoords().then(function (data) {
            $scope.coords = data;
        })


        DefService.getRegions().then(function (data) {
            var array = [];
            $scope.regList = data;
            for (var i in data) {
                var item = {};
                item.name = data[i].name;
                item.value = data[i]._id;
                array.push(item);
            }
            vm.regionComboFields = DefService.getRegionComboFields(false, array);
            vm.regionIdModel = {};
            $scope.showRegionCombo = true;
        });
        vm.regionIdModel = {};

        $scope.status = false;
        $scope.showRegionMap = false;


        $scope.updateMap = function (data) {

            MapService.getTheMap().then(function (map) {

                mapBranch = map;
                var marker;
                locx = parseFloat(data.locationx);
                locy = parseFloat(data.locationy);
                mapBranch.setView(new L.LatLng(locx, locy)).setZoom(12);
                if (refreshBtn === undefined) {
                    MapService.addRefreshBtn(map);
                }
                mapBranch.on("click", function (e) {
                    if (marker)
                        mapBranch.removeLayer(marker);
                    marker = L.marker([e.latlng.lat, e.latlng.lng], {
                        icon: L.AwesomeMarkers.icon({
                            icon: 'cog',
                            prefix: 'glyphicon',
                            markerColor: 'red'
                        })
                    }).addTo(mapBranch);
                    vm.branchModel.locationx = e.latlng.lat;
                    vm.branchModel.locationy = e.latlng.lng;
                });
            })

        }


        vm.branchFields = DefService.getBranchFields(false);


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

        $scope.updateMap($scope.coords);


        vm.ok = function () {
            if (vm.branchModel.name
                && vm.branchModel.locationx
                && vm.branchModel.locationy && vm.regionIdModel.region_id) {
                SweetAlert.swal({
                        title: "Şube Kaydet",
                        text: "Şubeyi kaydetmek istediğinize emin misiniz?",
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
                                vm.branchModel.logo = uploader.queue[0].file.name;
                            } else {
                                vm.branchModel.logo = "logo2.png";
                            }
                            vm.wholeModel = {};
                            vm.wholeModel.branchModel = vm.branchModel;
                            vm.wholeModel.region_id = vm.regionIdModel.region_id;

                            DefService.saveBranch(vm.wholeModel).then(function (data) {

                                toastr.success(data.name + " İstek başarıyla yaratıldı");
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

        vm.cancel = function () {
            vm.options.resetModel();
            vm.regionIdModel = {};
            vm.branchModel = {};
            vm.callServer($scope.tablestate);
            $scope.openDefBranch = false;
            $scope.showBranchList = false;
            $scope.updateMap($scope.coords);

        }

        vm.callServer = function callServer(tableState) {
            vm.isLoading = true;
            $scope.tablestate = angular.copy(tableState);
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.


            DefService.getPageWithData(start, number, tableState, vm.regionIdModel).then(function (result) {
                vm.displayed = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                vm.isLoading = false;
            });
        }

        $scope.$watch('vm.regionIdModel.region_id', function (newVal, oldVal) {
            DefService.getTheRegion(vm.regionIdModel).then(function (data) {
                $scope.updateMap(data);
                mapBranch.panTo(new L.LatLng(data.locationx, data.locationy), 12);
                $scope.showBranchList = true;
                vm.callServer($scope.tablestate);
            })

        });


        vm.editData = function (data) {
            vm.branchModel = data;

            $scope.updateMap(data);
            $scope.openDefBranch = true;

        }

        vm.delete = function (data) {
            SweetAlert.swal({
                    title: "Şube Silme",
                    text: "Şube Tanımını silmek istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        data.region_id = vm.regionIdModel.region_id;
                        DefService.deleteRegionBranch(data).then(function (data) {
                            toastr.success("Şube başarıyla silindi.");
                            vm.options.resetModel();
                            location.reload();
                        }, function (err) {
                            toastr.error("Silme işlemi sırasında hata!");
                        })
                    }
                });
        }

    };

})();
