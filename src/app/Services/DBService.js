angular.module('dbService', [])
    .factory('DBService', ['$q', '$http', 'SMSEmailService',
        function ($q, $http, SMSEmailService) {

            return (
            {
                saveWithoutValidation: saveWithoutValidation,
                checkEmail: checkEmail
            });

            function saveWithoutValidation(newUser) {

                var deferred = $q.defer(); // new deferred instance

                $http.post('/client/initial/register', {newUser: newUser})
                    .success(function (req, res) {
                        if (res === 200) {
                            SMSEmailService.authenticateWithEmail(req.User, req.password)
                                .then(function (err, result) {
                                    if (err) {
                                        deferred.reject(err);
                                    }
                                    deferred.resolve();
                                });
                        } else {
                            deferred.reject(err);
                        }
                    })
                    // handle   error
                    .error(function (err) {
                        deferred.reject(err);
                    });

                // return promise object

                return deferred.promise;
            }

            function checkEmail(email) {

                var deferred = $q.defer();

                $http.post('/client/check/mail', {email: email})
                    .success(function (req, res) {
                        console.log('checkMail: ' + req.email);
                        if (res === 200) {
                            var toMail = req.email;
                            var subject = 'Şifre Yenileme';
                            var html = 'Merhabalar,    ' + '  Şifre : ' + req.password;
                            var sendMail = SMSEmailService.sendSMSorMail(toMail, subject, html,'www.reacweb.com','Yeni Şifre oluştur.' );
                            sendMail.then(function (err, result) {

                                if (err) {

                                    deferred.reject();
                                }

                                deferred.resolve();
                            })
                        } else {

                            deferred.reject();
                        }
                    })
                    .error(function (data) {
                        deferred.reject();
                    })

                return deferred.promise;
            }

        }])