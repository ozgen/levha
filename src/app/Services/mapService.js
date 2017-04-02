/**
 * Created by Ozgen on 1/15/17.
 */
angular.module('mapService', [])
    .factory('MapService', ['$q', '$timeout', 'leafletData', 'AuthService', function ($q, $timeout, leafletData, AuthService) {

        return ({
            getTheMap: getTheMap,
            addControlPlaceholders: addControlPlaceholders,
            getTheMapWithCentered: getTheMapWithCentered,
            addMarkersToLayerGroup: addMarkersToLayerGroup
        })

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

        function getTheMap() {
            var deferred = $q.defer();
            $timeout(function () {
                leafletData.getMap().then(function (lfMap) {
                    lfMap.scrollWheelZoom.disable();
                    addControlPlaceholders(lfMap);


                    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(lfMap);
                    deferred.resolve(lfMap);
                    lfMap.zoomControl.setPosition('verticalcenterright');
                    var refreshBtn = L.easyButton('fa-refresh', function (btn, map) {

                        map.invalidateSize();

                    }).addTo(lfMap);

                    refreshBtn.setPosition('bottomright');


                });


            }, 700);

            return deferred.promise;
        }

        function getTheMapWithCentered() {

            var deferred = $q.defer();
            $timeout(function () {
                leafletData.getMap().then(function (lfMap) {
                    lfMap.scrollWheelZoom.disable();
                    addControlPlaceholders(lfMap);

                    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(lfMap);
                    AuthService.getCoords().then(function (data) {
                        var locx = parseFloat(data.locationx);
                        var locy = parseFloat(data.locationy);
                        lfMap.setView(new L.LatLng(locx, locy), 12);
                    })
                    deferred.resolve(lfMap);
                    lfMap.zoomControl.setPosition('verticalcenterright');
                    var refreshBtn = L.easyButton('fa-refresh', function (btn, map) {

                        map.invalidateSize();

                    }).addTo(lfMap);

                    refreshBtn.setPosition('bottomright');

                });
            }, 500);

            return deferred.promise;
        }

        function addMarkersToLayerGroup(markerGroup, groupName) {
            /* var markerGroup = L.layerGroup(markers);
             var overlayMaps = {
             String(groupName): markerGroup
             };
             */
            L.control.layers(markerGroup, getLayers())

        }

        function getLayers() {
            notFinishedLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            });
            finishedLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            });
            ongoingLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            });

            var baseMaps = {
                "Tamamlanmayanlar": notFinishedLayer,
                "Tamamlananlar": finishedLayer,
                "Devam Edenler": ongoingLayer
            };

            return baseMaps;
        }


    }])