'use strict';

angular.module('BlurAdmin', [
        'ngAnimate',
        'ui.bootstrap',
        'ui.sortable',
        'ui.router',
        'ngTouch',
        'toastr',
        'smart-table',
        "xeditable",
        'ui.slimscroll',
        'ngJsTree',
        'angular-progress-button-styles',
        'formly',
        'formlyBootstrap',
        'angularFileUpload',
        'datetimepicker',
        'ui.mask',
        'oitozero.ngSweetAlert',
        'ngIdle',
        'leaflet-directive',
        'angularjs-dropdown-multiselect',
        'ngSanitize',

        'authService',
        'searchService',
        'plateService',
        'userService',
        'defService',
        'mapService',

        'BlurAdmin.theme',
        'BlurAdmin.pages'

    ])
    .constant('_', window._, 'appApiCheck', apiCheck({
        output: {prefix: 'yksWeb'}
    }))
    .service('Session', function () {
        this.create = function (token, name, surname, email, _id, workPhone, privatePhone, adress, roles, pictureName, tcNo) {
            this.token = token;
            this.name = name;
            this.surname = surname;
            this.email = email;
            this._id = _id;
            this.workPhone = workPhone;
            this.privatePhone = privatePhone;
            this.adress = adress;
            this.roles = roles;
            this.pictureName = pictureName;
            this.tcNo = tcNo;
        };
        this.destroy = function () {
            this.token = null;
            this.name = null;
            this.surname = null;
            this.email = null;
            this._id = null;
            this.workPhone = null;
            this.privatePhone = null;
            this.adress = null;
            this.roles = null;
            this.pictureName = null;
        };
    })
    .config(function (IdleProvider) {
        // configure Idle settings
        IdleProvider.idle(290); // in seconds
        IdleProvider.timeout(300); // in seconds
    })
    .config(function (formlyConfigProvider) {
        var unique = 1;
        var unique2 = 1;
        formlyConfigProvider.setType({
            name: 'repeatSection',
            templateUrl: 'takyidatRepeat.html',
            controller: function ($scope) {
                $scope.formOptions = {formState: $scope.formState};
                $scope.addNew = addNew;
                $scope.copyFields = copyFields;

                function copyFields(fields) {
                    fields = angular.copy(fields);
                    addRandomIds(fields);
                    return fields;
                }

                function addNew() {
                    $scope.model['takyidat_degerleri'] = $scope.model['takyidat_degerleri'] || [];
                    var repeatsection = $scope.model['takyidat_degerleri'];
                    var lastSection = repeatsection[repeatsection.length - 1];
                    var newsection = {};
                    if (lastSection) {
                        newsection = angular.copy(lastSection);
                    }
                    repeatsection.push(newsection);
                }

                function addRandomIds(fields) {
                    unique++;
                    angular.forEach(fields, function (field, index) {
                        if (field.fieldGroup) {
                            addRandomIds(field.fieldGroup);
                            return; // fieldGroups don't need an ID
                        }

                        if (field.templateOptions && field.templateOptions.fields) {
                            addRandomIds(field.templateOptions.fields);
                        }

                        field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
                    });
                }

                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }
            }
        });


    })
    .run(function (formlyConfig) {
        formlyConfig.setWrapper({
            name: 'loading',
            templateUrl: 'loading.html'
        });

        formlyConfig.setType({
            name: 'datetimepicker',
            templateUrl: 'datetimepicker.html',
            wrapper: ['bootstrapLabel', 'bootstrapHasError'],
            defaultOptions: {
                templateOptions: {
                    datetimepicker: {
                        useStrict: true,
                        locale: 'tr',
                        format: 'DD.MM.YYYY'
                    }
                },
                parsers: [convertDate],
                formatters: [converToNormalDate]
            }
        });

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

        formlyConfig.setType({
            name: 'maskedInput',
            extends: 'input',
            template: '<input class="form-control" ng-model="model[options.key]" />',
            defaultOptions: {
                ngModelAttrs: {
                    mask: {
                        attribute: 'ui-mask'
                    },
                    maskPlaceholder: {
                        attribute: 'ui-mask-placeholder'
                    }
                },
                templateOptions: {
                    maskPlaceholder: ''
                }
            }
        });

        formlyConfig.setType({
            name: 'typeahead',
            template: '<input type="text" ng-model="model[options.key]" uib-typeahead="item for item in to.options | filter:$viewValue | limitTo:8" class="form-control">',
            wrapper: ['bootstrapLabel', 'bootstrapHasError']
        });

        formlyConfig.setType({
            name: 'decimalInput',
            extends: 'input',
            template: '<input class="form-control" placeholder=".. , .." ng-model="model[options.key]"  step="0.01"/>',
            wrapper: ['bootstrapLabel', 'bootstrapHasError']
        });

        formlyConfig.setType({
            name: 'multiselect',
            extends: 'select',
            defaultOptions: {
                ngModelAttrs: {
                    'true': {
                        value: 'multiple'
                    }
                }
            }
        });
        var unique = 1;
        var unique2 = 1;
        formlyConfig.setType({
            name: 'repeatScale',
            templateUrl: 'repeatScale.html',
            controller: function ($scope) {
                $scope.formOptions = {formState: $scope.formState};
                $scope.addNew = addNew;
                $scope.copyFields = copyFields;

                function copyFields(fields) {
                    fields = angular.copy(fields);
                    addRandomIds(fields);
                    return fields;
                }

                function addNew() {
                    $scope.model['scale'] = $scope.model['scale'] || [];
                    var repeatsection = $scope.model['scale'];
                    var lastSection = repeatsection[repeatsection.length - 1];
                    var newsection = {};
                    if (lastSection) {
                        newsection = angular.copy(lastSection);
                    }
                    repeatsection.push(newsection);
                }

                function addRandomIds(fields) {
                    unique2++;
                    angular.forEach(fields, function (field, index) {
                        if (field.fieldGroup) {
                            addRandomIds(field.fieldGroup);
                            return; // fieldGroups don't need an ID
                        }

                        if (field.templateOptions && field.templateOptions.fields) {
                            addRandomIds(field.templateOptions.fields);
                        }

                        field.id = field.id || (field.key + '_' + index + '_' + unique2 + getRandomInt(0, 9999));
                    });
                }

                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }
            }
        });

        formlyConfig.setType({
            name: 'button',
            template: '<div><button type="{{::to.type}}" class="btn btn-{{::to.btnType}}" ng-click="onClick($event)">{{to.text}}</button></div>',
            wrapper: ['bootstrapLabel'],
            defaultOptions: {
                templateOptions: {
                    btnType: 'default',
                    type: 'button'
                },
                extras: {
                    skipNgModelAttrsManipulator: true // <-- perf optimazation because this type has no ng-model
                }
            },
            controller: function ($scope) {
                $scope.onClick = onClick;

                function onClick($event) {
                    if (angular.isString($scope.to.onClick)) {
                        return $scope.$eval($scope.to.onClick, {$event: $event});
                    } else {
                        return $scope.to.onClick($event);
                    }
                }
            },
            apiCheck: function (check) {
                return {
                    templateOptions: {
                        onClick: check.oneOfType([check.string, check.func]),
                        type: check.string.optional,
                        btnType: check.string.optional,
                        text: check.string
                    }
                }
            },

        });
    })
    .run(function (Idle) {
        Idle.watch();
    })

    .directive('rowSelect', rowSelect)

    .directive('mapView', function () {
        return{
            templateUrl:'app/directives/map.html'
           
        }
    })

function rowSelect() {
    return {
        require: '^stTable',
        template: '<input type="checkbox">',
        $scope: {
            row: '=rowSelect'
        },
        link: function ($scope, element, attr, ctrl) {

            element.bind('click', function (evt) {

                $scope.$apply(function () {

                    ctrl.select($scope.row, 'multiple');

                });

            });

            $scope.$watch('row.isSelected', function (newValue) {

                if (newValue === true) {

                    element.parent().addClass('st-selected');
                    element.find('input').attr('checked', true);

                } else {

                    element.parent().removeClass('st-selected');
                    element.find('input').attr('checked', false);

                }
            });
        }
    };
}

