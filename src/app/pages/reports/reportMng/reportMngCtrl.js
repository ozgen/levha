(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports')
        .controller('reportMngCtrl', reportMngCtrl);

    /** @ngInject */
    function reportMngCtrl($scope, UserService, $cookieStore, SweetAlert, $uibModal, SearchService, toastr) {

        var vm = this;
        vm.model = {};
        vm.fields = SearchService.getSearchFields(false);
        $scope.showPreview = false;

        var user = $cookieStore.get('loggedin');
        $scope.personel = user.name+ " "+user.surname;
        $scope.personel_email = user.email;
        $scope.printDate = new Date();

        function checkDates() {

            if (vm.model.request_date > vm.model.request_date2) {
                toastr.error('Tarih Kriterlerini Düzgün giriniz');
                return false;
            }
            if (vm.model.last_montage_date > vm.model.last_montage_date2) {
                toastr.error('Tarih Kriterlerini Düzgün giriniz');
                return false;
            }
            if ((vm.model.request_date2 && vm.model.request_date == undefined)
                || (vm.model.request_date2 == undefined && vm.model.request_date)) {
                toastr.error('Tarih Kriterlerini Düzgün giriniz');
                return false;
            }
            if ((vm.model.last_montage_date && vm.model.last_montage_date2 == undefined)
                || (vm.model.last_montage_date == undefined && vm.model.last_montage_date2)) {
                toastr.error('Tarih Kriterlerini Düzgün giriniz');
                return false;
            }
            return true;

        }

        var options = {orientation: "p", unit: "pt", format: "a4"};
        var pdf3 = new jsPDF(options);

        vm.cancel = function () {
            location.reload();
        }

        vm.ok = function () {
            if (!angular.equals(vm.model, {})) {
                if (vm.model.last_montage_date || vm.model.last_montage_date2 ||
                    vm.model.request_date || vm.model.request_date2) {
                    if (checkDates()) {
                        SearchService.getSearchData(vm.model).then(function (data) {

                            vm.searchedData = data;
                            if(data.length>0)
                                $scope.showPreview = true;
                                
                        })
                    }
                } else {
                    SearchService.getSearchData(vm.model).then(function (data) {

                        vm.searchedData = data;
                        if(data.length>0)
                            $scope.showPreview = true;
                    })
                }

            } else {
                toastr.error("En az bir arama ktriteri veya tarih ikililerinden ikisini giriniz!");
            }
        }


        var margins = {top: 25, bottom: 60, left: 20, width: 522};


        vm.printPDF = function () {
            pdf3.addHTML(document.getElementById('pdfToPrint'), margins.top, margins.left, {}, function () {
                pdf3.save('rapor.pdf');
                toastr.success('Rapor başarı ile üretildi.')
            });

        }


    }

})();