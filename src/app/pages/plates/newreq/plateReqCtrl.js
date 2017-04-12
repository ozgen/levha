/**
 * Created by Ozgen on 4/9/17.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('newPlateReqCtrl', newPlateReqCtrl);

    /** @ngInject */
    function newPlateReqCtrl($scope, $state, $uibModal, toastr, PlateService, leafletData,
                             FileUploader, SweetAlert, AuthService, DefService, MapService) {

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
        var mapPlate;
        var refreshBtn;
        var btnReq;
        var sidebar;
        $scope.showSlideBar = false;
        var locArray = [];

        //location
        var locx = 0;
        var locy = 0;

        angular.extend($scope, {
            location: {
                lat: 51.505,
                lng: -0.09,
                zoom: 12
            },
            markers: {},
            zoomControl: false,

            defaults: {
                map: {
                    contextmenu: true,
                    contextmenuWidth: 140,
                    contextmenuItems: [{
                        text: 'Levha İsteği Oluştur',
                        callback: createPlateReq
                    }]
                }
            },
            layers: {
                baselayers: {
                    osm: {
                        name: "Ana Harita Katmanı",
                        type: "xyz",
                        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        layerOptions: {
                            subdomains: ["a", "b", "c"],
                            attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">YKSTrafik</a> contributors",
                            continuousWorld: true
                        }
                    }
                },
                overlays: {
                    newreq: {
                        name: 'İstekler',
                        type: 'markercluster',
                        visible: true
                    }
                },
                options: {
                    position: 'bottomleft'
                }
            }
        });

        function createPlateReq(e) {
            if (locArray.length > 0) {
                $scope.showSlideBar = true;
                sidebar.show();
            } else {
                toastr.error("Lütfen haritadan en az bir konum seçiniz.");
            }
        }

        AuthService.getCoords().then(function (data) {
            $scope.coords = data;
            updateMap(data);

        })

        function updateMap(data) {

            MapService.getTheMap().then(function (map) {
                $scope.showRegionMap = true;
                mapPlate = map;

                map.on("click", function (e) {
                    var marker = L.marker([e.latlng.lat, e.latlng.lng], {
                        icon: L.AwesomeMarkers.icon({
                            icon: 'cog',
                            prefix: 'glyphicon',
                            markerColor: 'red'

                        }),
                        draggable: true
                    }).on('click', onClick);

                    function onClick(e) {
                        mapPlate.removeLayer(this);
                        remove({locationx: e.latlng.lat, locationy: e.latlng.lng})
                        console.log(locArray);
                    }

                    mapPlate.addLayer(marker);
                    locArray.push({locationx: e.latlng.lat, locationy: e.latlng.lng})
                    console.log(locArray);
                    $scope.removeMarker = function (marker) {
                        mapPlate.removeLayer(marker);
                    }
                    function remove(item) {
                        var index = locArray.indexOf(item);
                        locArray.splice(index, 1);

                    }

                });
                if (data === undefined)
                    data = $scope.coords;
                locx = parseFloat(data.locationx);
                locy = parseFloat(data.locationy);

                mapPlate.setView(new L.LatLng(locx, locy), 12);
                mapPlate.invalidateSize();
                L.control.scale({
                    imperial: false
                }).addTo(map);
                mapPlate.zoomControl.setPosition('topright');
                if (refreshBtn === undefined) {
                    MapService.addRefreshBtn(mapPlate, function (btn) {
                        refreshBtn = btn;
                    });
                }
                if (btnReq === undefined) {
                    btnReq = L.easyButton('fa-edit', function (btn, map) {

                        if (locArray.length > 0) {
                            $scope.showSlideBar = true;
                            sidebar.show();
                        } else {
                            toastr.error("Lütfen haritadan en az bir konum seçiniz.");
                        }
                    }).addTo(mapPlate);
                    btnReq.setPosition('topright');
                }
                sidebar = L.control.sidebar('sidebar', {
                    closeButton: true,
                    position: 'left'
                });
                mapPlate.addControl(sidebar);
                sidebar.on('shown', function () {
                    console.log('Sidebar is visible.');
                });
                sidebar.on('hide', function () {
                    console.log('Sidebar will be hidden.');
                });
                sidebar.on('hidden', function () {
                    console.log('Sidebar is hidden.');
                });
                L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
                    console.log('Close button clicked.');
                });

            })

        }

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
            data.locArray = locArray;
            sidebar.hide();
            $uibModal.open({
                    templateUrl: "app/pages/plates/newreq/addnewReq.html",
                    controller: "newAddPlateCtrl",
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

        $scope.$on('$destroy', function () {
            mapPlate.remove();
        });


    }

})();
