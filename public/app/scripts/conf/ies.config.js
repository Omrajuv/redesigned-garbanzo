(function () {
    'use strict';
    var myApp = angular.module('ies');
    myApp.config(configuration);
    configuration.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function configuration($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/user');
        $stateProvider
            .state('users', {
                url: "/user",
                templateUrl: 'app/modules/user.html',
                controller: 'userCtrl',
            });
    }

})();