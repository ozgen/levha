(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .config(toastrLibConfig);

    /** @ngInject */
    function toastrLibConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            timeOut: 3000,
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body',
            progressBar: true
        });
    }
})();