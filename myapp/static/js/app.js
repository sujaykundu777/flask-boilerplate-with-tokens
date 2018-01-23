'use strict'; // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute','ngCookies']);

myApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
      templateUrl: "static/partials/home.html"
    }).
    when('/about', {
      templateUrl: "static/partials/about.html"
    }).
    when('/signin', {
      templateUrl: "static/partials/auth/signin.html",
      controller: "signinController"
    }).
    when('/signup', {
      templateUrl: 'static/partials/auth/signup.html',
      controller: "signupController"
    }).
    when('/dashboard', {
      templateUrl: 'static/partials/admin/dashboard.html'
    }).
    when('/profile', {
      templateUrl: 'static/partials/user/profile.html'
    }).
    when('/signout',{
      templateUrl: '',
      controller: "signoutController"
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }
]);


myApp.controller('signinController', ['$scope', '$http', '$location', function($scope, $http, $location){
       $scope.signin = function(){
         //Get user credentials
         $scope.credentials = {
           email: $scope.email,
           password: $scope.password
         };
         $http
             .post('/api/signin', $scope.credentials)
             .then(function(response){
                 console.log(response.data.message);
                 $location.path('/');
             })
             .catch(function activateError(error){
               console.log(error);
             });
       };
}]);

myApp.controller('signupController',['$scope', '$http', '$location', function($scope, $http, $location){
      $scope.signup = function(){
        //Gey user credentials
        $scope.credentials = {
          email: $scope.email,
          password: $scope.password
        };
        $http
            .post('/api/signup',$scope.credentials)
            .then(function(response){
              console.log(response.data.message);
              $location.path('/');
            })
            .catch(function activateError(error){
              console.log(error);
            });
      };
}]);

myApp.controller('signoutController',['$scope', '$location', '$cookies', function($scope, $location, $cookies){
     //Clear all credentials
     $scope.signout = function(response){
            if(response.status == 200){
              $location.path('/');
            }
            else{
              $location.path('/');
            }
     };
}]);
