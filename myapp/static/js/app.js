'use strict'; // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
      templateUrl: "static/partials/home.html",
      access: {restricted: false}
    }).
    when('/about', {
      templateUrl: "static/partials/about.html",
      access: {restricted: false}
    }).
    when('/signin', {
      templateUrl: "static/partials/auth/signin.html",
      controller: "signinController",
      access: {restricted: false}
    }).
    when('/signup', {
      templateUrl: 'static/partials/auth/signup.html',
      access: {restricted: false}
    //  controller: 'signupController'
    }).
    when('/profile', {
      templateUrl: 'static/partials/user/profile.html',
      access: {restricted: true}
    })
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }]);

  myApp.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
      function (event, next, current) {
        AuthService.getUserStatus()
        .then(function(){
          if (next.access.restricted && !AuthService.isLoggedIn()){
            $location.path('/login');
            $route.reload();
          }
        });
    });
  });
  
//Controller to handle Login Authentication
myApp.controller('signinController', ['$scope',
  function($scope){
       $scope.signin = function signin(){

       }
  }
]);
