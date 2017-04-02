/**
 * Created by Ozgen on 9/21/16.
 */
angular.module('plateService', [])
    .factory('PlateService', ['$q', '$http', 'AuthService', function ($q, $http, AuthService) {

        return ({
            getPlateFields: getPlateFields,
            getPlateTypes: getPlateTypes,
            getPlatePic: getPlatePic,
            getAddPlateFields: getAddPlateFields,
            getPlateTypeLabel: getPlateTypeLabel,
            savePlateReq: savePlateReq,
            getReqPlateMonthly: getReqPlateMonthly,
            updatePlateReq: updatePlateReq,
            getPlateProcessFields: getPlateProcessFields,
            savePlateOperations: savePlateOperations,
            getOnePlateOperations: getOnePlateOperations,
            getPlateOperationLabel: getPlateOperationLabel,
            getCompletedPlateReq: getCompletedPlateReq,
            convertDate: convertDate,
            converToNormalDate: converToNormalDate,
            getNotCompletedReqPlate: getNotCompletedReqPlate,
            deletePlateReq: deletePlateReq,
            getOtherPlateFields: getOtherPlateFields,
            wait: wait,
            savePlateTypes: savePlateTypes,
            getAllApprovablePlates:getAllApprovablePlates
        });

        function savePlateTypes() {
            var deferred = $q.defer();
            $http.post('/client/save/types', [
                {name: "Tehlike uyarı işaretleri", value: "traffic_danger_warning_signs"},
                {name: "Trafik tanzim işaretleri", value: "traffic_cooperation_signs"},
                {name: "Bilgi işaretleri", value: "traffic_info_signs"},
                {name: "Otoyol işaretleri", value: "traffic_highway_signs"},
                {name: "Duraklama ve Park İşaretleri", value: "traffic_stop_signs"},
                {name: "Diğer", value: "Diğer"}
            ]).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getPlateFields(readOnly) {

            var fields = [];

            fields = [
                {
                    fieldGroup: [
                        {
                            className: 'section-label',
                            template: '<div><strong>LEVHA İSTEĞİ</strong><hr></div>'
                        },
                        {
                            key: 'plate_type',
                            type: 'select',
                            templateOptions: {
                                type: 'text',
                                label: 'Levha Tipi',
                                required: true,
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


                    ]
                }
            ];

            return fields;

        }

        function getPlateTypes(data) {
            var deferred = $q.defer();
            $http.post('/client/plate', data, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getPlatePic(pictureName) {

            var deffered = $q.defer();
            $http.get('/client/getpic/' + pictureName).success(function (file) {
                if (file) deffered.resolve(file);

            }).error(function (err) {
                if (err) deffered.reject();
            });

            return deffered.promise;

        }

        function getAddPlateFields(readOnly) {
            return [
                {
                    className: 'row',
                    fieldGroup: [
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'no',
                            templateOptions: {
                                label: 'No',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return true;
                                }
                            }
                        }, {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'material',
                            templateOptions: {
                                label: 'Yapıldığı Malzeme',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'textarea',
                            key: 'explanation',
                            templateOptions: {
                                label: 'Açıklama',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return true;
                                }
                            }
                        }, {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'request_date',
                            templateOptions: {
                                label: 'İstek Tarihi'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'expiration_date',
                            templateOptions: {
                                label: 'Son Kullanma Tarihi'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'last_montage_date',
                            templateOptions: {
                                label: 'Miat Tarihi'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            key: 'emergency',
                            type: 'select',
                            templateOptions: {
                                type: 'text',
                                label: 'Aciliyet Durumu',
                                required: true,
                                options: [
                                    {name: "Çok Önemli", value: 1},
                                    {name: "Onemli", value: 2},
                                    {name: "Az önemli", value: 3},
                                    {name: "Diğer", value: 4}

                                ]
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'locationx',
                            templateOptions: {
                                label: 'Konum Bilgisi Enlem',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'locationy',
                            templateOptions: {
                                label: 'Konum Bilgisi Boylam',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        }

                    ]
                }]
        }

        function getPlateTypeLabel(plate_type_value) {
            var returnVal = "";
            var types = [
                {name: "Tehlike uyarı işaretleri", value: "traffic_danger_warning_signs"},
                {name: "Trafik tanzim işaretleri", value: "traffic_cooperation_signs"},
                {name: "Bilgi işaretleri", value: "traffic_info_signs"},
                {name: "Otoyol işaretleri", value: "traffic_highway_signs"},
                {name: "Duraklama ve Park İşaretleri", value: "traffic_stop_signs"},
                {name: "Diğer", value: "Diğer"}
            ];

            for (var type in types) {
                if (types[type].value === plate_type_value) {
                    returnVal = types[type].name;
                }
            }

            return returnVal;
        }

        function getOtherPlateFields(readOnly) {

            return [
                {
                    className: 'row',
                    fieldGroup: [
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'plate_type',
                            templateOptions: {
                                label: 'Levha Tipi',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return true;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'plate_shape',
                            templateOptions: {
                                label: 'Levha Şekli',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'textarea',
                            key: 'plate_shape_explanation',
                            templateOptions: {
                                label: 'Levha Şekil Açıklaması',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'selScale',
                            templateOptions: {
                                label: 'Ölçüleri',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'no',
                            templateOptions: {
                                label: 'No',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        }, {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'material',
                            templateOptions: {
                                label: 'Yapıldığı Malzeme',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'textarea',
                            key: 'explanation',
                            templateOptions: {
                                label: 'Açıklama',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        }, {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'request_date',
                            templateOptions: {
                                label: 'İstek Tarihi'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'expiration_date',
                            templateOptions: {
                                label: 'Son Kullanma Tarihi'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'last_montage_date',
                            templateOptions: {
                                label: 'Miat Tarihi'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            key: 'emergency',
                            type: 'select',
                            templateOptions: {
                                type: 'text',
                                label: 'Aciliyet Durumu',
                                required: true,
                                options: [
                                    {name: "Çok Önemli", value: 1},
                                    {name: "Onemli", value: 2},
                                    {name: "Az önemli", value: 3},
                                    {name: "Diğer", value: 4}

                                ]
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'locationx',
                            templateOptions: {
                                label: 'Konum Bilgisi Enlem',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'locationy',
                            templateOptions: {
                                label: 'Konum Bilgisi Boylam',
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        }

                    ]
                }]

        }

        function getPlateProcessFields(readOnly) {

            return [
                {
                    className: 'row',
                    fieldGroup: [

                        {
                            className: 'col-xs-12',
                            type: 'datetimepicker',
                            key: 'operation_date',
                            templateOptions: {
                                label: 'İşlem Tarihi',
                                required: true
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            key: 'process',
                            type: 'select',
                            templateOptions: {
                                type: 'text',
                                label: 'İşlem Tipi',
                                required: true,
                                options: [
                                    {name: "Levha üretildi; fakat takılmadı.", value: "produced_not_montage"},
                                    {name: "Levha Üretildi ve takıldı.", value: "produced_montaged"},
                                    {name: "Levha üretim aşamasında.", value: "in_production"},
                                    {name: "Firmaya verildi.", value: "to_firm"},
                                    {name: "Firmadan sonuç bekler.", value: "in_firm"},
                                    {name: "İhale Bekler", value: "w8_bid"},
                                    {name: "Diğer", value: "other"}
                                ]
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-12',
                            type: 'textarea',
                            key: 'explanation',
                            templateOptions: {
                                label: 'Açıklama',
                                type: 'text',
                                required: true
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        }

                    ]
                }
            ];

        }


        function savePlateReq(data) {

            var deferred = $q.defer();

            $http.post('/client/save/reqplate', data, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }


        function getReqPlateMonthly() {
            var deferred = $q.defer();
            $http.get('/client/get/reqplate/monthly', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getNotCompletedReqPlate() {
            var deferred = $q.defer();
            $http.get('/client/get/reqplate/notcompleted', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function updatePlateReq(data) {

            var deferred = $q.defer();

            $http.post('/client/update/reqplate', data, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function savePlateOperations(data) {

            var deferred = $q.defer();

            $http.post('/client/save/plateoperation', data, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getOnePlateOperations(plate_id) {

            var deferred = $q.defer();

            $http.get('/client/get/plate/operation/' + plate_id, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function deletePlateReq(plate_id) {
            var deferred = $q.defer();
            var obj = {};
            obj.plate_id = plate_id;


            $http.post('/client/delete/platereq', obj, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getPlateOperationLabel(plate_oper_value) {
            var returnVal = "";
            var types = [
                {name: "Levha üretildi; fakat takılmadı.", value: "produced_not_montage"},
                {name: "Levha Üretildi ve takıldı.", value: "produced_montaged"},
                {name: "Levha üretim aşamasında.", value: "in_production"},
                {name: "Firmaya verildi.", value: "to_firm"},
                {name: "Firmadan sonuç bekler.", value: "in_firm"},
                {name: "İhale Bekler", value: "w8_bid"},
                {name: "Yeni yaratılmış.", value: "created"},
                {name: "Diğer", value: "other"}

            ];

            for (var type in types) {
                if (types[type].value === plate_oper_value) {
                    returnVal = types[type].name;
                }
            }
            return returnVal;
        }

        function getCompletedPlateReq() {
            var deferred = $q.defer();
            $http.get('/client/get/reqplate/completed', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getAllApprovablePlates() {
            var deferred = $q.defer();
            $http.get('/client/get/allapprovable/reqplate', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function convertDate(val) {
            if (moment(val, 'DD.MM.YYYY HH.mm').isValid()) {
                return moment(val, 'DD.MM.YYYY HH:mm').format();
            } else if (moment(val, 'DD.MM.YYYY HH').isValid()) {
                return moment(val, 'DD.MM.YYYY HH').format();
            } else if (moment(val, 'DD.MM.YYYY').isValid()) {
                return moment(val, 'DD.MM.YYYY').format();
            } else if (moment(val, 'YYYY').isValid()) {
                return moment(val, 'YYYY').format();
            }
        }

        function converToNormalDate(val) {
            return moment(val, moment.ISO_8601);
        }

        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
            return true;
        }

    }]);