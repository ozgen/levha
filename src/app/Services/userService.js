/**
 * Created by Ozgen on 10/13/16.
 */
angular.module('userService', [])
    .factory('UserService', ['$q', '$http', 'AuthService', function ($q, $http, AuthService) {

        return ({
            getUserFields: getUserFields,
            getRoles: getRoles,
            insertNewUser: insertNewUser,
            getAllUsers: getAllUsers,
            getOnlineUsers: getOnlineUsers,
            getFreezeUsers: getFreezeUsers,
            updateUser: updateUser,
            getPasswordFields: getPasswordFields,
            getRegionComboFields: getRegionComboFields,
            getBranchComboFields: getBranchComboFields,
            getUsersComboValue: getUsersComboValue,
            getUsersComboFields: getUsersComboFields
        });


        function getRoles() {
            return [
                {value: 'admin', name: "Yönetici"},
                {value: 'user', name: "Kullanıcı"}
            ];
        }


        function getUserFields(readOnly) {

            return [
                {
                    className: 'col-xs-12',
                    key: 'tcNo',
                    type: 'maskedInput',
                    templateOptions: {
                        type: 'text',
                        label: 'T.C. Kimlik Numarası',
                        mask: '99999999999',
                        placeholder: 'T.C. Kimlik Numarasını giriniz.'
                    }, expressionProperties: {
                    'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                        return readOnly;
                    }
                }
                },
                {
                    className: 'col-xs-12',
                    key: 'name',
                    type: 'input',
                    templateOptions: {
                        type: 'text',
                        label: 'Adı',
                        placeholder: 'Adını giriniz.'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                },
                {
                    className: 'col-xs-12',
                    key: 'surname',
                    type: 'input',
                    templateOptions: {
                        type: 'text',
                        label: 'Soyadı',
                        placeholder: 'Soyadını giriniz.'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                },
                {
                    className: 'col-xs-12',
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        label: 'Email Adres',
                        placeholder: 'Mail adresini giriniz.',
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
                    key: 'workPhone',
                    type: 'maskedInput',
                    templateOptions: {
                        type: 'phone',
                        label: 'İş Telefonu',
                        mask: '(999) 999 99 99',
                        placeholder: 'İş telefonunu giriniz.'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                },
                {
                    className: 'col-xs-12',
                    key: 'privatePhone',
                    type: 'maskedInput',
                    templateOptions: {
                        type: 'phone',
                        label: 'Kişisel Telefon',
                        mask: '(999) 999 99 99',
                        placeholder: 'Kişisel telefonunu giriniz.'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                },
                {
                    className: 'col-xs-12',
                    key: 'adress',
                    type: 'textarea',
                    templateOptions: {
                        type: 'textarea',
                        label: 'Adres',
                        placeholder: 'Adres bilgilerini giriniz...'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                },
                {
                    className: 'col-xs-12',
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Şifre',
                        placeholder: 'Şifresini giriniz...',
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
                    key: 'password2',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Şifre (Tekrar)',
                        placeholder: 'Aynı şifreyi tekrar giriniz...',
                        required: true
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }
            ];

        }

        function getPasswordFields(readOnly) {
            return [

                {
                    className: 'col-xs-12',
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Şifre',
                        placeholder: 'Şifresini giriniz...',
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
                    key: 'password2',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Şifre (Tekrar)',
                        placeholder: 'Aynı şifreyi tekrar giriniz...',
                        required: true
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }


            ];
        }

        function getRegionComboFields(readOnly, region) {

            return [
                {
                    className: 'col-xs-12',
                    key: 'region',
                    type: 'select',
                    wrapper: 'loading',
                    templateOptions: {
                        type: 'text',
                        label: 'Bölge',
                        options: region
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }
            ];

        }

        function getBranchComboFields(readOnly, branch, readOnlyBranch) {
            return [
                {
                    className: 'col-xs-12',
                    key: 'branch',
                    type: 'select',
                    wrapper: 'loading',
                    templateOptions: {
                        type: 'text',
                        label: 'Şube',
                        options: branch
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnlyBranch;
                        }
                    }
                },
                {
                    className: 'col-xs-12',
                    key: 'role',
                    type: 'select',
                    wrapper: 'loading',
                    templateOptions: {
                        type: 'text',
                        label: 'Yetkisi',
                        options: getRoles()
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }
            ];
        }

        function getOnlineUsers() {
            var deferred = $q.defer();
            $http.get('/client/get/online/users', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getFreezeUsers() {
            var deferred = $q.defer();
            $http.get('/client/get/freeze/users', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getAllUsers() {
            var deferred = $q.defer();
            $http.get('/client/get/all/users', AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function insertNewUser(user) {
            var deferred = $q.defer();

            $http.post('/client/signup', user).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;

        }

        function updateUser(user) {
            var deferred = $q.defer();
            $http.post('/client/update/user', user, AuthService.getHeader()).success(function (data) {
                if (data) deferred.resolve(data);
            }).error(function (err) {
                if (err) deferred.reject();
            });

            return deferred.promise;
        }

        function getUsersComboValue() {
            var deferred = $q.defer();
            getAllUsers().then(function (users) {
                var comboItems = [];
                if (users) {

                    for (var i in users) {
                        var item = {};
                        item.name = users[i].name + " " + users[i].surname;
                        item.value = users[i].email;
                        comboItems.push(item);
                    }
                    deferred.resolve(comboItems);

                }

            })

            return deferred.promise;
        }

        function getUsersComboFields(readOnly, users) {

            return [
                {
                    className: 'col-xs-12',
                    key: 'user',
                    type: 'select',
                    wrapper: 'loading',
                    templateOptions: {
                        type: 'text',
                        label: 'Kullanıcılar',
                        options: users
                    },
                    expressionProperties: {
                        'templateOptions.disabled': function ($viewValue, $modelValue, scope) {
                            return readOnly;
                        }
                    }
                }
            ];

        }


    }]);