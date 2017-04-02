angular.module('authService', ['ngCookies'])

    .factory('AuthService', ['$q', '$http', '$rootScope', '$cookieStore', 'Session', '$timeout',
        function ($q, $http, $rootScope, $cookieStore, Session, $timeout) {


            var user = null;

            return ({
                isLoggedIn: isLoggedIn,
                login: login,
                logout: logout,
                getRole: getRole,
                checkRole: checkRole,
                getCurrentUserEmail: getCurrentUserEmail,
                getUserDetails: getUserDetails,
                getToken: getToken,
                getHeader: getHeader,
                checkRegionAdmin: checkRegionAdmin,
                getCoords: getCoords

            });

            function isLoggedIn() {
                if ($cookieStore.get('loggedin')) {
                    $rootScope.$isLoggedIn = true;
                    return true;
                } else {
                    $rootScope.$isLoggedIn = false;
                    return false;
                }

            };

            function getRole() {
                if (isLoggedIn()) {
                    return $cookieStore.get('loggedin').roles;
                } else {
                    return;
                }
            }


            function login(email, password) {


                var deferred = $q.defer(); // new deferred instance

                $http.post('/client/signin', {email: email, password: password})
                    .success(function (req, res) {

                        if (req.token) {
                            user = true;
                            if (req.token === 'deleted') {
                                deferred.reject('deleted');
                            } else if (req.token === 'freezed') {
                                deferred.reject('freezed');
                            } else {
                                Session.create(req.token,
                                    req.user.name,
                                    req.user.surname,
                                    req.user.email,
                                    req.user._id,
                                    req.user.workPhone,
                                    req.user.privatePhone,
                                    req.user.adress,
                                    req.user.roles,
                                    req.user.pictureName,
                                    req.user.tcNo);
                                $cookieStore.put('loggedin', Session);
                                deferred.resolve();
                            }
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    .error(function (err) {
                        user = false;
                        deferred.reject();
                    });

                return deferred.promise;

            };

            function logout() {

                var deferred = $q.defer();

                $.ajax({
                        type: "GET",
                        async: false,
                        url: '/client/logout',
                        headers: getToken()
                    })
                    .success(function (data) {
                        user = false;
                        Session.destroy();
                        $cookieStore.remove('loggedin');
                        deferred.resolve();
                    })
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    })

                return deferred.promise;

            };


            function checkRole(rol) {
                var roles = getRole();
                for (var i in roles) {
                    var role = roles[i];
                    if (role.role === rol) {
                        return true;
                        break;
                    }
                    if (role.role === 'super_admin') {
                        return true;
                        break;
                    }

                }
                return false;
            }

            function checkRegionAdmin() {

                var roles = getRole();
                for (var i in roles) {
                    var role = roles[i];
                    if (role.region && role.branch === undefined) {
                        return true;
                        break;
                    }
                    if (role.role === 'super_admin') {
                        return true;
                        break;
                    }

                }
                return false;
            }

            function getUserDetails() {

                var session = $cookieStore.get('loggedin');
                if (session) {
                    return {
                        name: session.name,
                        surname: session.surname,
                        email: session.email
                    }
                }
            }

            function getCurrentUserEmail() {
                if (isLoggedIn()) {
                    return $cookieStore.get('loggedin').email;
                } else {
                    return;
                }
            }

            function getToken() {

                if (isLoggedIn()) return {"authorization": $cookieStore.get('loggedin').token};

            }

            function getHeader() {
                // todo headeri coklu role göre tekrar elden geçir !!!

                return {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'authorization': $cookieStore.get('loggedin').token,
                        'region': String($cookieStore.get('loggedin').roles[0].region),
                        'branch': String($cookieStore.get('loggedin').roles[0].branch)
                    }
                };
            }

            function getCoords() {
                var deferred = $q.defer();
                $http.get('/client/get/coord', getHeader()).success(function (data) {
                    if (data) deferred.resolve(data);
                }).error(function (err) {

                    deferred.reject(err);
                });
                return deferred.promise;
            }


        }])

