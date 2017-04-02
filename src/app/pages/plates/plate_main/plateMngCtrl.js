/**
 * Created by Ozgen on 10/18/16.
 */

/**
 * Created by Eray on 11.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.plate')
        .controller('plateMngCtrl', plateMngCtrl);

    /** @ngInject */
    function plateMngCtrl($scope, $timeout, leafletData, PlateService, $filter, $uibModal, MapService, AuthService, SweetAlert, toastr) {
        'use strict';
        $scope.title = "Home";
        $scope.isLoading = true;
        $scope.showMap = false;

        $scope.roleAdmin = AuthService.checkRole('admin');
        $scope.showProcess = true;

        var map = {};

        angular.extend($scope, {
            location: {zoom: 12},
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

        MapService.getTheMapWithCentered().then(function (map2) {

            map = map2;

        })


        function setDataToPnl(data) {

            $scope.currentPage = 1
                , $scope.numPerPage = 5
                , $scope.maxSize = 5;


            var markerColor = "";
            switch (data.platePocess) {
                case 'completed':
                    markerColor = 'green';
                    break;
                case 'notStarted':
                    markerColor = 'blue';
                    break;
                case 'notCompleted':
                    markerColor = 'red';
                    break;
                default:
                    break;
            }
            $scope.plates = data;


            $scope.markers = [];
            var locx = 0;
            var locy = 0;
            for (var i in data) {
                if (data[i].process) {
                    data[i].processLabel = PlateService.getPlateOperationLabel(data[i].process);
                }
                locx = parseFloat(data[i].locationx);
                locy = parseFloat(data[i].locationy);
                var src = "";
                src = '/client/getpic/' + data[i].picture_name;
                var message = "<b><font color='RED'>" + data[i].no + "</font> </b><br>" +
                    "<b>Açıklama:</b>" + data[i].explanation +
                    "<br> <b>İstek Tarihi Tarihi: </b>" +
                    $filter('date')(new Date(data[i].request_date), "dd/MM/yyyy");

                $scope.markers[i] = {
                    lat: locx,
                    lng: locy,
                    focus: true,
                    draggable: false,
                    message: message,
                    icon: {
                        iconUrl: src,
                        shadowUrl: '/client/getpic/shadow.png',

                        iconSize: [38, 40], // size of the icon
                        shadowSize: [50, 64], // size of the shadow
                        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                        shadowAnchor: [30, 94],  // the same for the shadow
                        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
                    }
                };
            }


            $scope.totalItems = $scope.plates.length;
            $scope.numPages = function () {
                return Math.ceil($scope.plates.length / $scope.numPerPage);
            };

            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;
                $scope.filteredPlates = $scope.plates.slice(begin, end);
            });

            $scope.isLoading = false;


        }


        PlateService.getCompletedPlateReq().then(function (data) {
            data.platePocess = 'completed';
            $scope.completedPlates = data;

        })
        PlateService.getNotCompletedReqPlate().then(function (data) {
            data.platePocess = 'notCompleted';
            $scope.notCompletedPlates = data;

        })
        PlateService.getAllApprovablePlates().then(function (data) {
            data.plateProcess = 'toApprove';
            $scope.toApprovePlates = data;
        })

        PlateService.getReqPlateMonthly().then(function (data) {
            data.platePocess = 'notStarted';
            $scope.notStartedPlates = data;
            setDataToPnl(data);
            $scope.showMap = true;
        })

        $scope.setCompletedPlateToPln = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.completedPlates);
            $scope.showMap = true;
        }
        $scope.setMonthlyPlateToPln = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.notStartedPlates);
            $scope.showMap = true;
            $scope.showProcess = true;

        }
        $scope.setNotCompletedPlateToPnl = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.notCompletedPlates);
            $scope.showMap = true;
        }

        $scope.setApprovablePlateReq = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.toApprovePlates);
            $scope.showMap = true;
            $scope.showProcess = false;

        }


        setTimeout(function () {

            $scope.showMap = true;
        }, 200);

        $scope.openPlateReq = function (data) {
            data.buttonState = 'update';
            $scope.showMap = false;
            if (data.plate_type === 'Diğer') {
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
            } else {
                $scope.showMap = false;
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

        }
        $scope.openProcessDialog = function (data) {
            $uibModal.open({
                    templateUrl: "app/pages/plates/plate_main/process.html",
                    controller: "processCtrl",
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

        $scope.$on('leafletDirectiveMarker.click', function (e, args) {
            // Args will contain the marker name and other relevant information
            map.setView(args.leafletEvent.latlng, 12);


        });


        $scope.approvePlateReq = function (data) {
            if($scope.roleAdmin){
            SweetAlert.swal({
                    title: "İsteği Onayla",
                    text: "İsteği onaylamak istediğinize emin misiniz?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#31B404",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        data.status = 1;
                        PlateService.updatePlateReq(data).then(function (data) {
                            toastr.success("İstek başarıyla onaylandı");
                            location.reload();
                        }, function (err) {
                            $scope.isLoading = false;
                            toastr.error("Onaylama sırasında hata!");
                            $scope.showMap = true;
                            $uibModalInstance.close();

                        })
                    }
                });
            }else{
                toastr.error("Onaylamaya yetkiniz yok!");
            }
        }


    }


})();
