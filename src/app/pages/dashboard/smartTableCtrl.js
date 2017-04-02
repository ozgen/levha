(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('smartTableCtrl', smartTableCtrl)

    /** @ngInject */

    function smartTableCtrl($scope, $timeout, leafletData, PlateService, $filter, $uibModal, toastr, AuthService) {
        'use strict';
        $scope.title = "Home";
        $scope.isLoading = true;
        $scope.showMap2 = true;
        $scope.markers = [];

        AuthService.getCoords().then(function (data) {
            $scope.coords = data;
        })


        var map = {};
        var latlng = {};

        function addControlPlaceholders(map) {
            var corners = map._controlCorners,
                l = 'leaflet-',
                container = map._controlContainer;

            function createCorner(vSide, hSide) {
                var className = l + vSide + ' ' + l + hSide;

                corners[vSide + hSide] = L.DomUtil.create('div', className, container);
            }

            createCorner('verticalcenter', 'left');
            createCorner('verticalcenter', 'right');
        }

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

        function getPlateReqFromLatLng(latlng) {
            var plateReq = {};
            for (var i in $scope.completedPlates) {
                if (parseFloat($scope.completedPlates[i].locationx) === latlng.lat) {
                    plateReq = $scope.completedPlates[i];
                }
            }
            if (!plateReq.no) {
                for (var i in $scope.notCompletedPlates) {
                    if (parseFloat($scope.notCompletedPlates[i].locationx) === latlng.lat) {
                        plateReq = $scope.notCompletedPlates[i];
                    }
                }
            }
            if (!plateReq.no) {
                for (var i in $scope.notStartedPlates) {
                    if (parseFloat($scope.notStartedPlates[i].locationx) === latlng.lat) {
                        plateReq = $scope.notStartedPlates[i];
                    }
                }
            }

            return plateReq;

        }


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


            var locx = 0;
            var locy = 0;
            var c = 10;
            if ($scope.markers.length) {
                c = $scope.markers.length + c + 1;
            }
            for (var i in data) {
                if (data[i].process) {
                    data[i].processLabel = PlateService.getPlateOperationLabel(data[i].process);
                }
                locx = parseFloat(data[i].locationx);
                locy = parseFloat(data[i].locationy);
                console.log(data[i].picture_name)
                var src = "";
                src = '/client/getpic/' + data[i].picture_name;
                var message = "<b><font color='RED'>" + data[i].no + "</font> </b><br>" +
                    "<b>Açıklama:</b>" +data[i].explanation +
                    "<br> <b>İstek Tarihi Tarihi: </b>" +
                    $filter('date')(new Date(data[i].request_date), "dd/MM/yyyy");

                $scope.markers[c + i] = {
                    lat: locx,
                    lng: locy,
                    focus: true,
                    draggable: false,
                    message: message,
                    icon: {
                        iconUrl: src,
                        shadowUrl: '/client/getpic/shadow.png',

                        iconSize:     [38, 40], // size of the icon
                        shadowSize:   [50, 64], // size of the shadow
                        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        shadowAnchor: [30, 94],  // the same for the shadow
                        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                    }
                };
            }


            $timeout(function () {
                leafletData.getMap()
                    .then(function (lfMap) {

                        map = lfMap;
                        map.scrollWheelZoom.disable();

                        addControlPlaceholders(map);

// Change the position of the Zoom Control to a newly created placeholder.
                        map.zoomControl.setPosition('verticalcenterright');

// You can also put other controls in the same placeholder.
                        L.control.scale({position: 'verticalcenterright'}).addTo(map);

                        locx = parseFloat($scope.coords.locationx);
                        locy = parseFloat($scope.coords.locationy);
                        map.panTo(new L.LatLng(locx, locy)).setZoom(12);


                    })
            }, 500);
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
            setDataToPnl(data);
            PlateService.getNotCompletedReqPlate().then(function (data) {
                data.platePocess = 'notCompleted';
                $scope.notCompletedPlates = data;
                setDataToPnl(data);
                PlateService.getReqPlateMonthly().then(function (data) {
                    data.platePocess = 'notStarted';
                    $scope.notStartedPlates = data;
                    setDataToPnl(data);
                })

            })


        })
        $timeout(function () {
            leafletData.getMap()
                .then(function (lfMap) {
                    map = lfMap;

                    var editBtn = L.easyButton('fa-edit', function (btn, map) {
                        if (latlng.lat) {
                            var plateReq = getPlateReqFromLatLng(latlng);
                            $scope.showMap2 = false;
                            $uibModal.open({
                                    templateUrl: "app/pages/plates/newplate/addPlate.html",
                                    controller: "addPlateCtrl",
                                    controllerAs: "vm",
                                    backdrop: 'static',
                                    resolve: {
                                        item: function () {
                                            return plateReq;
                                        }
                                    }
                                }
                            );

                        } else {
                            toastr.error("Öncelikle bir marker seçiniz!");
                        }
                    }).addTo(map);
                    var positionBtn = L.easyButton('fa-globe', function (btn, map) {

                        map.setZoom(12);

                    }).addTo(map);
                    editBtn.setPosition('bottomright');
                    positionBtn.setPosition('bottomright');

                })
        }, 500);


        $scope.setCompletedPlateToPln = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.completedPlates);
        }
        $scope.setMonthlyPlateToPln = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.notStartedPlates);
        }
        $scope.setNotCompletedPlateToPnl = function () {
            $scope.isLoading = true;
            setDataToPnl($scope.notCompletedPlates);
        }


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
            latlng = args.leafletEvent.latlng;
            map.setView(args.leafletEvent.latlng, 18);


        });

        $scope.openMap = function () {
            $scope.showMap2 = true;
            $timeout(function () {
                leafletData.getMap()
                    .then(function (lfMap) {
                        map = lfMap;
                        map.setView(latlng, 12);
                        L.easyButton('fa-edit', function (btn, map) {
                            if (latlng.lat) {
                                var plateReq = getPlateReqFromLatLng(latlng);
                                $scope.showMap2 = false;
                                $uibModal.open({
                                        templateUrl: "app/pages/plates/newplate/addPlate.html",
                                        controller: "addPlateCtrl",
                                        controllerAs: "vm",
                                        backdrop: 'static',
                                        resolve: {
                                            item: function () {
                                                return plateReq;
                                            }
                                        }
                                    }
                                );

                            } else {
                                toastr.error("Öncelikle bir marker seçiniz!");
                            }
                        }).addTo(map);
                        L.easyButton('fa-globe', function (btn, map) {

                            map.setZoom(12);

                        }).addTo(map);


                    })
            }, 500);


        }


    }
})
();