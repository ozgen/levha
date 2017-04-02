(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('manageCtrl', manageCtrl);

    /** @ngInject */
    function manageCtrl($scope, UserService, $cookieStore, SweetAlert, $uibModal, DefService) {
        var vm = this;
        $scope.currentPage2 = 1;
        $scope.numPerPage2 = 5;
        $scope.maxSize2 = 5;
        $scope.isLoading = true;

        function getUsers(data) {
            $scope.currentPage2 = 1;
            $scope.numPerPage2 = 5;
            $scope.maxSize2 = 5;
            $scope.totalItems2 = data.length;
            for (var i in data) {
                if (!data[i].pictureName) {
                    data[i].pictureName = 'profile.jpeg';
                }
                if (data[i].roles.length) {
                    for (var j in data[i].roles) {
                        if (data[i].roles[j] === 'manager') {
                            data[i].manager = true;
                        } else if (data[i].roles[j] === 'controller') {
                            data[i].controller = true;
                        } else if (data[i].roles[j] === 'technician') {
                            data[i].technician = true;
                        }
                    }
                }
            }
            $scope.isLoading = false;
            return data;
        }

        UserService.getFreezeUsers().then(function (data) {
            $scope.freezeUsers = getUsers(data);
        })

        UserService.getOnlineUsers().then(function (data) {
            $scope.onlineUsers = getUsers(data);
        })

        UserService.getAllUsers().then(function (data) {
            $scope.users = getUsers(data);
            $scope.allUsers = getUsers(data);
        })

        $scope.setFreezeUsersToPnl = function () {
            $scope.users = $scope.freezeUsers;
            vm.callServer($scope.tablestate);
        }
        $scope.setOnlineUsersToPnl = function () {
            $scope.users = $scope.onlineUsers;
            vm.callServer($scope.tablestate);
        }

        $scope.setAllUsersToPnl = function () {
            $scope.users = $scope.allUsers;
            vm.callServer($scope.tablestate);
        }

        $scope.showOperation = function (data) {

            $uibModal.open({
                    templateUrl: "app/pages/users/allUsers/operation/user_operation.html",
                    controller: "UserOprCtrl",
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

        $scope.openUserDetail = function (data) {

            $uibModal.open({
                    templateUrl: "app/pages/users/allUsers/detail/detail.html",
                    controller: "UserDetailCtrl",
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

        vm.callServer = function callServer(tableState) {

            vm.isLoading = true;
            $scope.tablestate = angular.copy(tableState);
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            DefService.getThePage(start, number, tableState, $scope.users).then(function (result) {
                vm.displayed = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                vm.isLoading = false;
            });
        };


    }

})();
