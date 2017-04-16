/**
 * Created by Ozgen on 12/9/16.
 */
angular.module('defService', []).factory('DefService', ['$q', '$http', 'AuthService', '$filter', '$timeout',
    function ($q, $http, AuthService, $filter, $timeout) {

        return ({
            getPlateDefinitionFields: getPlateDefinitionFields,
            getPicFields: getPicFields,
            savePlateDef: savePlateDef,
            getRegionFields: getRegionFields,
            getBranchFields: getBranchFields,
            saveRegion: saveRegion,
            saveBranch: saveBranch,
            getRegions: getRegions,
            getRegionComboFields: getRegionComboFields,
            getTheRegion: getTheRegion,
            getAllPlateDefifinitions: getAllPlateDefifinitions,
            getPlateTypeFields: getPlateTypeFields,
            getThePlateTypeLabel: getThePlateTypeLabel,
            savePlateType: savePlateType,
            getPage: getPage,
            getPlateTypeDefFields: getPlateTypeDefFields,
            getTheRegionWithName: getTheRegionWithName,
            getRegionBranches: getRegionBranches,
            deleteRegionBranch: deleteRegionBranch,
            getPageWithData: getPageWithData,
            getThePage: getThePage,
            convertString: convertString
        });

        function getPlateTypeFields(readOnly) {
            var deferred = $q.defer();
            $http.get('/client/get/types', AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(
                        [{
                            className: 'col-xs-12',
                            key: 'plate_type',
                            type: 'select',
                            templateOptions: {
                                type: 'text',
                                label: 'Levha Tipi',
                                required: true,
                                options: data
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        }
                        ]);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;


        }

        function getPlateDefinitionFields(readOnly) {
            var field = [];

            field = [
                {
                    className: 'row',
                    fieldGroup: [


                        {
                            className: 'col-xs-12',
                            type: 'input',
                            key: 'no',
                            templateOptions: {
                                label: 'No',
                                type: 'text',
                                required: true
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
                                required: true,
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
                                required: true,
                                type: 'text'
                            },
                            expressionProperties: {
                                'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                    return readOnly;
                                }
                            }
                        },
                        {
                            className: 'col-xs-4',
                            type: 'repeatScale',
                            key: 'scale',

                            templateOptions: {
                                fields: [
                                    {
                                        className: 'row',
                                        fieldGroup: [
                                            {
                                                className: 'col-xs-12',
                                                type: 'input',
                                                key: 'scale',
                                                templateOptions: {
                                                    label: 'Ölçü:',
                                                    type: "text"
                                                },
                                                expressionProperties: {
                                                    'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                                                        return readOnly;
                                                    }
                                                }
                                            }
                                        ]
                                    }
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

            return field;
        }

        function getPicFields(readOnly) {
            return [
                {
                    className: 'col-xs-12',
                    template: '<div><strong>LEVHA İSTEĞİ</strong><hr></div>'
                },
                {
                    className: 'col-xs-12',
                    type: 'input',
                    key: 'picture_name',
                    templateOptions: {
                        label: 'Levha Resmi Adı (Uzantısı ile birlikte Ör: p1.gif)',
                        type: 'text'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }
            ];

        }

        function savePlateDef(data) {

            var deferred = $q.defer();

            $http.post('/client/save/plate/def ', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getRegionFields(readOnly) {
            return [
                {
                    className: 'col-xs-12',
                    type: 'input',
                    key: 'name',
                    templateOptions: {
                        label: 'Bölge Adı',
                        type: 'text',
                        required: true
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }, {
                    className: 'col-xs-12',
                    type: 'input',
                    key: 'code',
                    templateOptions: {
                        label: 'Bölge Kodu',
                        required: true,
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
        }

        function getBranchFields(readOnly) {
            return [
                {
                    className: 'col-xs-12',
                    type: 'input',
                    key: 'name',
                    templateOptions: {
                        label: 'Şube Adı',
                        type: 'text',
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
        }


        function getPlateTypeDefFields(readOnly) {
            return [
                {
                    className: 'col-xs-12',
                    type: 'input',
                    key: 'name',

                    templateOptions: {
                        label: 'Şeçmeli alanda Görünmesi gereken İsmi',
                        type: 'text',
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
                    type: 'input',
                    key: 'value',
                    templateOptions: {
                        label: 'Değeri (Ör: Tehlikeli ve Uyarı İşaretleri : traffic_danger_warning_signs )',
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

        function saveRegion(data) {

            var deferred = $q.defer();

            data.name_ = convertString(data.name);
            $http.post('/client/save/region', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function saveBranch(data) {

            var deferred = $q.defer();
            data.branchModel.name_ = convertString(data.branchModel.name);
            $http.post('/client/save/branch', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getRegions() {

            var deferred = $q.defer();

            $http.get('/client/get/all/region', AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getRegionComboFields(readOnly, array) {


            return [
                {
                    className: 'col-xs-12',
                    key: 'region_id',
                    type: 'select',
                    wrapper: 'loading',
                    templateOptions: {
                        type: 'text',
                        label: 'Bölge',
                        options: array
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }
            ];

        }

        function getTheRegion(data) {
            var deferred = $q.defer();
            $http.post('/client/get/the/region', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function getAllPlateDefifinitions() {
            var deferred = $q.defer();
            $http.get('/client/get/all/platedef', AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;


        }

        function getPage(start, number, params, functionName) {

            var deferred = $q.defer();
            functionName.then(function (data) {

                if (data) {
                    var filtered = params.search.predicateObject ? $filter('filter')(data, params.search.predicateObject) : data;

                    if (params.sort.predicate) {
                        filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                    }

                    var result = filtered.slice(start, start + number);

                    $timeout(function () {
                        //note, the server passes the information about the data set size
                        deferred.resolve({
                            data: result,
                            numberOfPages: Math.ceil(filtered.length / number)
                        });
                    }, 500);
                }
            }, function (err) {

            })


            return deferred.promise;
        }


        function getThePlateTypeLabel(data) {
            var deferred = $q.defer();
            $http.post('/client/get/the/plate_type', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data.name);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function savePlateType(data) {
            var deferred = $q.defer();
            $http.post('/client/save/plate_type', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getTheRegionWithName(data) {

            var deferred = $q.defer();
            $http.post('/client/get/region/name', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getRegionBranches(data) {
            var deferred = $q.defer();
            $http.post('/client/get/region/branches', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function deleteRegionBranch(data) {
            var deferred = $q.defer();
            $http.post('/client/delete/region/branch', data, AuthService.getHeader())
                .success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getPageWithData(start, number, params, regiondata) {
            var deferred = $q.defer();
            getRegionBranches(regiondata).then(function (data) {


                var filtered = params.search.predicateObject ? $filter('filter')(data, params.search.predicateObject) : data;

                if (params.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $timeout(function () {
                    //note, the server passes the information about the data set size
                    deferred.resolve({
                        data: result,
                        numberOfPages: Math.ceil(filtered.length / number)
                    });
                }, 500);

            }, function (err) {

            })


            return deferred.promise;
        }

        function getThePage(start, number, params, data) {
            var deferred = $q.defer();
            var filtered = params.search.predicateObject ? $filter('filter')(data, params.search.predicateObject) : data;

            if (params.sort.predicate) {
                filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
            }

            var result = filtered.slice(start, start + number);
            $timeout(function () {
                //note, the server passes the information about the data set size
                deferred.resolve({
                    data: result,
                    numberOfPages: Math.ceil(filtered.length / number)
                });
            }, 500);


            return deferred.promise;
        }


        function convertString(phrase) {
            var maxLength = 100;

            var returnString = phrase.toLowerCase();
            //Convert Characters
            returnString = returnString.replace(/ö/g, 'o');
            returnString = returnString.replace(/ç/g, 'c');
            returnString = returnString.replace(/ş/g, 's');
            returnString = returnString.replace(/ı/g, 'i');
            returnString = returnString.replace(/ğ/g, 'g');
            returnString = returnString.replace(/ü/g, 'u');

            // if there are other invalid chars, convert them into blank spaces
            returnString = returnString.replace(/[^a-z0-9\s-]/g, "");
            // convert multiple spaces and hyphens into one space       
            returnString = returnString.replace(/[\s-]+/g, " ");
            // trims current string
            returnString = returnString.replace(/^\s+|\s+$/g, "");
            // cuts string (if too long)
            if (returnString.length > maxLength)
                returnString = returnString.substring(0, maxLength);
            // add hyphens
            returnString = returnString.replace(/\s/g, "-");

            return returnString;
        }

    }])