'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', [
 'ngRoute',
]);

myApp.config(['$routeProvider',
     function($routeProvider,) {
         $routeProvider.
             when('/', {
                 templateUrl: '../static/partials/home.html',
             }).
             when('/about', {
                 templateUrl: '../static/partials/about.html',
             }).
             otherwise({
                 redirectTo: '/'
             });

          //$locationProvider.html5Mode(true);
    }]);
