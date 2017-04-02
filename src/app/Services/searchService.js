angular.module('searchService', [])
    .factory('SearchService', ['$q', '$http', 'AuthService', 'PlateService',
        function ($q, $http, AuthService, PlateService) {


            return ({

                getSearchFields: getSearchFields,
                getSearchData: getSearchData

            });

            function getSearchFields(readOnly) {

                return [
                    {
                        key: 'plate_type',
                        type: 'select',
                        templateOptions: {
                            type: 'text',
                            label: 'Levha Tipi',
                            options: [
                                {name: "Tehlike uyarı işaretleri", value: "traffic_danger_warning_signs"},
                                {name: "Trafik tanzim işaretleri", value: "traffic_cooperation_signs"},
                                {name: "Bilgi işaretleri", value: "traffic_info_signs"},
                                {name: "Otoyol işaretleri", value: "traffic_highway_signs"},
                                {name: "Duraklama ve Park İşaretleri", value: "traffic_stop_signs"},
                                {name: "Diğer", value: "Diğer"}
                            ]
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    }
                    ,
                    {
                        key: 'emergency',
                        type: 'select',
                        templateOptions: {
                            type: 'text',
                            label: 'Aciliyet Durumu',
                            options: [
                                {name: "Çok Önemli", value: 1},
                                {name: "Onemli", value: 2},
                                {name: "Az önemli", value: 3},

                            ]
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    }, {

                        key: 'process',
                        type: 'select',
                        templateOptions: {
                            type: 'text',
                            label: 'İşlem Tipi',
                            options: [
                                {name: "Levha üretildi; fakat takılmadı.", value: "produced_not_montage"},
                                {name: "Levha Üretildi ve takıldı.", value: "produced_montaged"},
                                {name: "Levha üretim aşamasında.", value: "in_production"},
                                {name: "Firmaya verildi.", value: "to_firm"},
                                {name: "Firmadan sonuç bekler.", value: "in_firm"},
                                {name: "İhale Bekler", value: "w8_bid"}
                            ]
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    },
                    {

                        type: 'datetimepicker',
                        key: 'request_date',
                        templateOptions: {
                            label: 'İstek Tarihi Başlangıç'
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    },
                    {

                        type: 'datetimepicker',
                        key: 'request_date2',
                        templateOptions: {
                            label: 'İstek Tarihi Bitiş'
                        },

                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    },

                    {

                        type: 'datetimepicker',
                        key: 'last_montage_date',
                        templateOptions: {
                            label: 'Miat Tarihi Başlangıç'
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    },
                    {

                        type: 'datetimepicker',
                        key: 'last_montage_date2',
                        templateOptions: {
                            label: 'Miat Tarihi Bitiş'
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                return readOnly;
                            }
                        }
                    }
                ]
            }

            function getSearchData(data) {
                var deferred = $q.defer();

                $http.post('/client/search/param', data, AuthService.getHeader()).success(function (data) {
                    if (data) {
                        for (var i in data) {
                            data[i].plate_type_label = PlateService.getPlateTypeLabel(data[i].plate_type);
                            data[i].process_label = PlateService.getPlateOperationLabel(data[i].process);
                            data[i].sno = parseInt(i) + 1;
                        }
                        deferred.resolve(data);
                    }
                }).error(function (err) {
                    if (err) deferred.reject();
                });

                return deferred.promise;

            }


        }]
    );
